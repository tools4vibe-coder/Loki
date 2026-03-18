import React from 'react';
import { Sidebar } from './components/Sidebar';
import { BannerPreview } from './components/BannerPreview';
import { VariationGallery } from './components/VariationGallery';
import { BannerConfig, BannerOption } from './types';
import { AIService } from './services/aiService';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Download, Layout } from 'lucide-react';

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
          
          Product Knowledge & Visual Guidelines:
          1. FANS: Focus on "Active BLDC Technology" (energy saving), "SilentPro" (low noise), "Duratech" (long life), and "Anti-Dust" features. Visuals should show superior air delivery and premium finishes like wood or metallic.
          2. KITCHEN APPLIANCES: 
             - Chimneys: Highlight "Intelligent Auto Clean", "Gesture Control", and high suction power.
             - Mixer Grinders: Emphasize "MaxiGrind Technology" and durable motors.
             - Hobs/Cooktops: Sleek glass surfaces, "Smart On" safety features.
          3. LIGHTING: "Star Lord" LED panels, high brightness, flicker-free, energy efficient.
          4. WATER HEATERS: "Solarium" series, rapid heating, corrosion resistance, sleek vertical/horizontal designs.
          5. PUMPS: "Mini Champ", high pressure, reliable performance for residential and agricultural use.

          Composition: Use clean, high-key lighting. Lifestyle folds should feature modern, aspirational Indian home interiors (living rooms, kitchens, bathrooms). Product folds should be on minimalist white or light blue gradients with technical callouts and subtle iconography for USPs.
        `,
        negativePrompt: 'cluttered, messy, unprofessional, low quality, neon colors, aggressive, chaotic, rustic, vintage, blurred details, unrealistic textures, poor lighting, western-only aesthetics, dark and dingy spaces, low resolution, distorted logos.'
      }
    ],
    activeBrandId: 'brand-crompton',
    textLayers: [],
    aspectRatio: '16:9',
    showGuides: true,
    snapToGrid: true,
    productRef: { strength: 80 },
    styleRef: { strength: 50 },
    imageRef: { strength: 50 },
    projectName: 'Crompton Brand Engine',
    isAutoSaveEnabled: true
  });

  const [options, setOptions] = React.useState<BannerOption[]>([]);
  const [selectedOption, setSelectedOption] = React.useState<BannerOption | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isRemixing, setIsRemixing] = React.useState<number | null>(null);
  const [zoom, setZoom] = React.useState(1);
  const [savedProjects, setSavedProjects] = React.useState<Record<string, BannerConfig>>({});
  const [showOverwriteModal, setShowOverwriteModal] = React.useState<{ name: string; config: BannerConfig } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  // Load theme on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
    localStorage.setItem('app_theme', newTheme);
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
        setSelectedOption(results[0]);
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
          onClose={() => setIsSidebarOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </motion.div>
      
      <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        {/* Top Toolbar */}
        <header className="h-14 border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-6 bg-[var(--card-bg)]/80 backdrop-blur-xl z-20 transition-colors duration-300">
          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[var(--accent)]/10 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              <Layout size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[var(--input-bg)] rounded-lg border border-[var(--border)]">
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Project</span>
              <input 
                type="text"
                value={config.projectName}
                onChange={(e) => handleProjectNameChange(e.target.value)}
                className="bg-transparent text-xs font-medium text-[var(--text-primary)] focus:outline-none border-none p-0 w-24 lg:w-32"
              />
            </div>
            <div className="hidden md:block h-4 w-px bg-[var(--border)]" />
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest px-2">Res</span>
              <select 
                value={config.resolution}
                onChange={(e) => setConfig(prev => ({ ...prev, resolution: e.target.value as any }))}
                className="bg-transparent text-xs font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer"
              >
                <option value="1K" className="bg-[var(--card-bg)]">1K</option>
                <option value="2K" className="bg-[var(--card-bg)]">2K</option>
                <option value="4K" className="bg-[var(--card-bg)]">4K</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="flex items-center gap-1 lg:gap-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-1">
              <button 
                onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))}
                className="p-1 lg:p-1.5 hover:bg-[var(--accent)]/10 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Minus size={14} />
              </button>
              <div className="px-1 lg:px-2 min-w-[40px] lg:min-w-[48px] text-center">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] font-mono uppercase tracking-widest">{Math.round(zoom * 100)}%</span>
              </div>
              <button 
                onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                className="p-1 lg:p-1.5 hover:bg-[var(--accent)]/10 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="hidden sm:block h-4 w-px bg-[var(--border)]" />
            <button className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest group shadow-lg shadow-[var(--accent)]/20">
              <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
              <span className="hidden xs:inline">Export</span>
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
