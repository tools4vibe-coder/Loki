import React from 'react';
import { Sidebar } from './components/Sidebar';
import { BannerPreview } from './components/BannerPreview';
import { VariationGallery } from './components/VariationGallery';
import { BannerConfig, BannerOption, GenerationHistoryItem } from './types';
import { AIService } from './services/aiService';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Download, Layout, Undo2, Redo2 } from 'lucide-react';

export default function App() {
  const [config, setConfig] = React.useState<BannerConfig>({
    folds: 4,
    width: 1920,
    height: 700,
    resolution: '1K',
    mode: ['cinematic'],
    prompt: '',
    textModelId: 'gemini-3-flash-preview',
    imageModelId: 'gemini-3-pro-image-preview',
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

  // Load theme and history on mount
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
      alert("Generation failed. Please ensure your API key is configured correctly.");
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
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="text-[10px] font-mono font-bold text-[var(--accent)] min-w-[40px] text-center tracking-tighter">
                {Math.round(zoom * 100)}%
              </span>
              <button 
                onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                <Plus size={12} />
              </button>
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
      </main>
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
