import React from 'react';
import { Sidebar } from './components/Sidebar';
import { BannerPreview } from './components/BannerPreview';
import { VariationGallery } from './components/VariationGallery';
import { BannerConfig, BannerOption, GenerationHistoryItem } from './types';
import { AIService } from './services/aiService';
import { calculateCredits, getApiKeyStatus } from './lib/usage';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Download, Layout, Undo2, Redo2, Zap, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function App() {
  const [config, setConfig] = React.useState<BannerConfig>({
    folds: 4,
    width: 1920,
    height: 700,
    resolution: '1K',
    mode: ['cinematic'],
    prompt: '',
    textModelId: 'gemini-3-flash-preview',
    imageModelId: 'gemini-2.5-flash-image',
    autoBestVersion: true,
    compareMode: false,
    hybridBlend: false,
    brandPresets: [
      {
        id: 'brand-crompton',
        name: 'Crompton',
        colors: ['#00529B', '#FFFFFF', '#002D5A', '#E6F0F9'],
        logo: 'https://www.crompton.co.in/cdn/shop/files/Crompton_Logo_New.png',
        stylePrompt: `
          Official Crompton Brand Aesthetic: Professional, reliable, clean corporate engineering. 
          Color Palette: Primary Crompton Blue (#00529B), stark White (#FFFFFF), Deep Navy (#002D5A).
          
          STRICT CONSTRAINT: No humans, animals, or living things. 
          EXCEPTION: Human hands are allowed ONLY if they are using a remote to control the product (e.g., switching on a fan).
          
          Product Knowledge:
          1. FANS: Focus on BLDC Technology, SilentPro, and Anti-Dust. Show air delivery and premium finishes.
          2. KITCHEN: Chimneys, Mixer Grinders, Hobs.
          3. LIGHTING & WATER HEATERS.
        `,
        negativePrompt: 'humans, people, faces, animals, pets, living things, cluttered, messy, unprofessional, low quality, neon colors.'
      },
      {
        id: 'brand-amazon-aplus',
        name: 'Amazon A+ Header',
        colors: ['#FFFFFF', '#232F3E', '#FF9900'],
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        stylePrompt: `
          Premium eCommerce A+ Content Style: High-conversion layout, clean, professional.
          
          STRICT CONSTRAINT: No humans, animals, or living things. 
          EXCEPTION: Human hands are allowed ONLY if they are using a remote to control the product.
          
          LAYOUT: Each fold should be a distinct visual (lifestyle or feature shot).
        `,
        negativePrompt: 'humans, people, faces, animals, pets, living things, blurry, text in image.'
      }
    ],
    activeBrandId: 'brand-crompton',
    textLayers: [],
    aspectRatio: '16:9',
    productRef: { strength: 80 },
    styleRef: { strength: 50 },
    imageRef: { strength: 50 },
    projectName: 'Crompton Brand Engine',
    isAutoSaveEnabled: true,
    lighting: 'studio',
    composition: 'dynamic',
    colorMood: 'neutral',
    continuityEngine: {
      edgeAlignment: 85,
      seamBlending: 90,
      depthMapping: 75
    }
  });

  const [isApiKeySelected, setIsApiKeySelected] = React.useState<boolean | null>(null);

  // Check for API key selection
  React.useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setIsApiKeySelected(selected);
      } else {
        // Fallback for local development or if not in AI Studio environment
        setIsApiKeySelected(true);
      }
    };
    checkKey();
  }, []);

  const handleOpenSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success and proceed to the app as per guidelines
      setIsApiKeySelected(true);
    }
  };

  // Undo/Redo History
  const [history, setHistory] = React.useState<BannerConfig[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const isUndoRedoAction = React.useRef(false);

  // Initialize history
  React.useEffect(() => {
    if (history.length === 0) {
      setHistory([config]);
      setHistoryIndex(0);
    }
  }, []);

  // Track config changes for history
  React.useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setHistory(prev => {
        const currentHistory = prev.slice(0, historyIndex + 1);
        const lastState = currentHistory[currentHistory.length - 1];
        
        // Deep compare to avoid unnecessary history pushes
        if (lastState && JSON.stringify(lastState) === JSON.stringify(config)) {
          return prev;
        }

        const newHistory = [...currentHistory, config];
        // Limit history to 50 steps
        if (newHistory.length > 50) return newHistory.slice(newHistory.length - 50);
        return newHistory;
      });
      
      setHistory(prev => {
        // Update index based on new history length
        setHistoryIndex(prev.length - 1);
        return prev;
      });
    }, 800); // 800ms debounce for history pushes to avoid spamming during slider drags

    return () => clearTimeout(timer);
  }, [config]);

  const undo = React.useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setConfig(history[prevIndex]);
    }
  }, [history, historyIndex]);

  const redo = React.useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setConfig(history[nextIndex]);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const [options, setOptions] = React.useState<BannerOption[]>([]);
  const [selectedOption, setSelectedOption] = React.useState<BannerOption | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isRemixing, setIsRemixing] = React.useState<number | null>(null);
  const [zoom, setZoom] = React.useState(1);
  const [savedProjects, setSavedProjects] = React.useState<Record<string, BannerConfig>>({});
  const [showOverwriteModal, setShowOverwriteModal] = React.useState<{ name: string; config: BannerConfig } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  const [generationHistory, setGenerationHistory] = React.useState<GenerationHistoryItem[]>([]);
  const [apiKeyStatus, setApiKeyStatus] = React.useState<{ selected: boolean; label: string }>({ selected: false, label: 'Checking...' });

  // Load theme and history on mount
  React.useEffect(() => {
    const checkKey = async () => {
      const status = await getApiKeyStatus();
      setApiKeyStatus(status);
    };
    checkKey();
  }, [isApiKeySelected]);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }

    const savedHistory = localStorage.getItem('generation_history');
    if (savedHistory) {
      try {
        setGenerationHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse generation history', e);
      }
    }
  }, []);

  // Save history to localStorage
  React.useEffect(() => {
    localStorage.setItem('generation_history', JSON.stringify(generationHistory));
  }, [generationHistory]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
    localStorage.setItem('app_theme', newTheme);
  };

  const handleDownload = () => {
    if (!selectedOption) return;
    
    selectedOption.folds.forEach((fold, index) => {
      const link = document.createElement('a');
      link.href = fold;
      link.download = `${config.projectName.replace(/\s+/g, '_')}_fold_${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // Load saved projects on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('banner_projects');
    if (saved) {
      try {
        setSavedProjects(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved projects', e);
      }
    }
  }, []);

  // Auto-save effect
  React.useEffect(() => {
    if (!config.isAutoSaveEnabled) return;

    const timer = setTimeout(() => {
      const updatedProjects = {
        ...savedProjects,
        [config.projectName]: config
      };
      setSavedProjects(updatedProjects);
      localStorage.setItem('banner_projects', JSON.stringify(updatedProjects));
    }, 1000); // 1s debounce

    return () => clearTimeout(timer);
  }, [config, savedProjects]);

  const handleProjectNameChange = (newName: string) => {
    if (savedProjects[newName] && newName !== config.projectName) {
      setShowOverwriteModal({ name: newName, config: savedProjects[newName] });
    } else {
      setConfig(prev => ({ ...prev, projectName: newName }));
    }
  };

  const confirmOverwrite = () => {
    if (showOverwriteModal) {
      setConfig(prev => ({ ...prev, projectName: showOverwriteModal.name }));
      setShowOverwriteModal(null);
    }
  };

  const loadProject = (name: string) => {
    const project = savedProjects[name];
    if (project) {
      setConfig(project);
    }
  };

  const deleteProject = (name: string) => {
    const updated = { ...savedProjects };
    delete updated[name];
    setSavedProjects(updated);
    localStorage.setItem('banner_projects', JSON.stringify(updated));
  };

  const loadHistoryItem = (item: GenerationHistoryItem) => {
    setConfig(item.config);
    setOptions(item.options);
    const selected = item.options.find(opt => opt.id === item.selectedOptionId) || item.options[0];
    setSelectedOption(selected);
  };

  const deleteHistoryItem = (id: string) => {
    setGenerationHistory(prev => prev.filter(item => item.id !== id));
  };

  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleGenerate = async () => {
    if (isGenerating) {
      abortControllerRef.current?.abort();
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const aiService = AIService.getInstance();
      const results = await aiService.generateBanner(config, controller.signal);
      
      if (controller.signal.aborted) return;

      setOptions(results);
      if (results.length > 0) {
        const firstOption = results[0];
        setSelectedOption(firstOption);

        // Add to history
        const historyItem: GenerationHistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          config: { ...config },
          options: results,
          selectedOptionId: firstOption.id
        };
        setGenerationHistory(prev => [historyItem, ...prev].slice(0, 20)); // Keep last 20 generations
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error("Generation failed:", error);
      
      // Handle permission denied or missing key errors
      if (error.message?.includes('PERMISSION_DENIED') || error.message?.includes('Requested entity was not found')) {
        setIsApiKeySelected(false);
        alert("Access denied. Please select a valid API key with billing enabled to use this model.");
      } else {
        alert("Generation failed. Please ensure your API key is configured correctly.");
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleRemixFold = async (foldIndex: number) => {
    if (!selectedOption) return;
    setIsRemixing(foldIndex);
    try {
      const aiService = AIService.getInstance();
      const newFoldImage = await aiService.remixFold(config, selectedOption, foldIndex);
      
      const updatedOption = {
        ...selectedOption,
        folds: selectedOption.folds.map((f, i) => i === foldIndex ? newFoldImage : f)
      };
      
      setSelectedOption(updatedOption);
      setOptions(prev => prev.map(opt => opt.id === selectedOption.id ? updatedOption : opt));
    } catch (error) {
      console.error("Remix failed:", error);
    } finally {
      setIsRemixing(null);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[var(--bg)] text-[var(--text-primary)] overflow-hidden selection:bg-[var(--accent)]/30 transition-colors duration-300">
      {/* API Key Selection Overlay */}
      <AnimatePresence>
        {isApiKeySelected === false && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          >
            <div className="bg-[#151619] border border-[var(--border)] rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto">
                <Layout className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Premium Model Access</h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  To use high-quality image generation models, you must select an API key from a paid Google Cloud project.
                </p>
              </div>
              
              <div className="bg-black/40 rounded-xl p-4 border border-[var(--border)] text-left">
                <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">Requirements:</h4>
                <ul className="text-[11px] text-[var(--text-primary)] space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-[var(--accent)] mt-1.5" />
                    <span>Google Cloud project with billing enabled</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-[var(--accent)] mt-1.5" />
                    <span>Gemini API enabled in the project</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleOpenSelectKey}
                  className="w-full py-4 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)]"
                >
                  Select API Key
                </button>
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors uppercase tracking-widest font-bold"
                >
                  View Billing Documentation
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <motion.div 
        animate={{ 
          width: isSidebarOpen ? '320px' : '0px',
          opacity: isSidebarOpen ? 1 : 0,
          x: isSidebarOpen ? 0 : -320
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:relative z-50 h-full overflow-hidden"
      >
        <Sidebar 
          config={config} 
          setConfig={setConfig} 
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          savedProjects={savedProjects}
          onLoadProject={loadProject}
          onDeleteProject={deleteProject}
          onProjectNameChange={handleProjectNameChange}
          generationHistory={generationHistory}
          onLoadHistoryItem={loadHistoryItem}
          onDeleteHistoryItem={deleteHistoryItem}
          onClose={() => setIsSidebarOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </motion.div>
      
      <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        {/* Top Toolbar */}
        <header className="h-14 border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-6 bg-[#111] backdrop-blur-xl z-20 transition-colors duration-300">
          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[var(--accent)]/10 rounded-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors border border-transparent hover:border-[var(--accent)]/30"
            >
              <Layout size={18} />
            </button>
            
            <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-black/40 rounded-sm border border-[var(--border)] group focus-within:border-[var(--accent)]/50 transition-all">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] leading-none mb-1">Project_ID</span>
                <input 
                  type="text"
                  value={config.projectName}
                  onChange={(e) => handleProjectNameChange(e.target.value)}
                  className="bg-transparent text-[11px] font-mono font-medium text-[var(--text-primary)] focus:outline-none border-none p-0 w-24 lg:w-40 uppercase tracking-widest"
                />
              </div>
            </div>

            <div className="hidden md:block h-6 w-px bg-[var(--border)] mx-2" />
            
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] leading-none mb-1">Output_Res</span>
                <select 
                  value={config.resolution}
                  onChange={(e) => setConfig(prev => ({ ...prev, resolution: e.target.value as any }))}
                  className="bg-transparent text-[11px] font-mono font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer uppercase tracking-widest"
                >
                  <option value="512px" className="bg-[#111]">512PX</option>
                  <option value="720p" className="bg-[#111]">720P</option>
                  <option value="1K" className="bg-[#111]">1080P_1K</option>
                  <option value="2K" className="bg-[#111]">1440P_2K</option>
                  <option value="4K" className="bg-[#111]">2160P_4K</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
            <div className="hidden sm:flex items-center gap-1 bg-black/40 border border-[var(--border)] rounded-sm p-1">
              <button 
                onClick={undo}
                disabled={historyIndex <= 0}
                title="Undo (Ctrl+Z)"
                className="p-1.5 hover:bg-[var(--accent)]/10 rounded-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-20 transition-all"
              >
                <Undo2 size={14} />
              </button>
              <div className="w-px h-3 bg-[var(--border)] mx-1" />
              <button 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                title="Redo (Ctrl+Y)"
                className="p-1.5 hover:bg-[var(--accent)]/10 rounded-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-20 transition-all"
              >
                <Redo2 size={14} />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-3 bg-black/40 border border-[var(--border)] rounded-sm px-3 py-1">
              <button 
                onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))}
                className="p-1 hover:bg-[var(--accent)]/10 rounded-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                title="Zoom Out"
              >
                <Minus size={14} />
              </button>
              
              <input 
                type="range" 
                min="0.1" 
                max="2" 
                step="0.01" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-20 lg:w-32 h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
              />

              <button 
                onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                className="p-1 hover:bg-[var(--accent)]/10 rounded-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                title="Zoom In"
              >
                <Plus size={14} />
              </button>

              <div className="w-px h-3 bg-[var(--border)] mx-1" />

              <span className="text-[10px] font-mono font-bold text-[var(--accent)] min-w-[40px] text-center tracking-tighter">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <button 
              onClick={handleDownload}
              disabled={!selectedOption}
              className="flex items-center gap-3 px-5 py-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 disabled:bg-[var(--border)] disabled:text-white/20 text-black rounded-sm transition-all text-[10px] font-bold uppercase tracking-[0.2em] group shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]"
            >
              <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
              <span className="hidden xs:inline">Finalize_Export</span>
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Stage Area */}
          <div className="flex-1 overflow-auto relative stage-bg p-4 lg:p-12 flex items-center justify-center bg-[var(--bg)]">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(var(--text-primary) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            <div 
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
              className="transition-transform duration-300 ease-out z-10"
            >
              <BannerPreview 
                config={config} 
                selectedOption={selectedOption} 
                isLoading={isGenerating}
                onRemixFold={handleRemixFold}
                isRemixing={isRemixing}
                onDownload={handleDownload}
              />
            </div>

            {/* Floating Zoom Controls */}
            <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 bg-[#111]/80 backdrop-blur-md border border-[var(--border)] rounded-full p-1.5 shadow-2xl lg:hidden">
              <button 
                onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))}
                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-[var(--accent)]/20 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
              >
                <Minus size={14} />
              </button>
              <span className="text-[10px] font-mono font-bold text-[var(--accent)] min-w-[36px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button 
                onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-[var(--accent)]/20 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Variation Gallery - Floating Sidebar Style */}
          <div className="relative z-20">
            <VariationGallery 
              options={options} 
              selectedId={selectedOption?.id} 
              onSelect={setSelectedOption} 
            />
          </div>
        </div>
        
        {/* Overwrite Confirmation Modal */}
        {showOverwriteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Overwrite Project?</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                A project named <span className="text-[var(--accent)] font-bold">"{showOverwriteModal.name}"</span> already exists. 
                Do you want to overwrite it with your current configuration?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowOverwriteModal(null)}
                  className="flex-1 px-4 py-2 bg-[var(--input-bg)] hover:bg-[var(--border)] text-[var(--text-secondary)] rounded-xl transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmOverwrite}
                  className="flex-1 px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white rounded-xl transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  Overwrite
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent)]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent)]/5 blur-[120px] pointer-events-none" />

        {/* Floating Usage Indicator */}
        <div className="fixed bottom-6 left-6 z-[60] hidden lg:block">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-4 bg-[#111]/80 backdrop-blur-xl border border-[var(--border)] rounded-2xl p-3 pr-5 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-r border-[var(--border)] pr-4">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${apiKeyStatus.selected ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {apiKeyStatus.selected ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] leading-none mb-1">API_Status</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${apiKeyStatus.selected ? 'text-green-500' : 'text-red-500'}`}>
                  {apiKeyStatus.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                <Zap size={16} className="animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] leading-none mb-1">Est_Credits</span>
                <span className="text-[11px] font-mono font-bold text-[var(--accent)]">
                  {calculateCredits(config)} <span className="text-[8px] text-[var(--text-secondary)] ml-1">PTS</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
