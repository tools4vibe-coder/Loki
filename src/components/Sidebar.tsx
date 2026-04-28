import React from 'react';
import { BannerConfig, ModelProvider, AIModel, TextLayer, GenerationHistoryItem } from '../types';
import { MODELS, MODES, TEXT_MODELS, IMAGE_MODELS } from '../constants';
import { AIService } from '../services/aiService';
import { AdvancedTextModal } from './AdvancedTextModal';
import { calculateCredits, getApiKeyStatus } from '../lib/usage';
import { 
  Settings, 
  Monitor,
  Cpu, 
  Image as ImageIcon, 
  User, 
  Zap, 
  ChevronDown, 
  Plus,
  Info,
  Grid,
  Trash2,
  Sparkles,
  NotebookPen,
  Eraser,
  Package,
  Palette,
  Layers,
  Loader2,
  Check,
  PlusCircle,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
  Italic,
  RectangleHorizontal,
  Square,
  Layout,
  SlidersHorizontal,
  Image,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Maximize2,
  MousePointer2,
  Bold,
  Save,
  FolderOpen,
  History,
  ClipboardCheck,
  Sun,
  Moon,
  Focus,
  Droplets,
  Layout as LayoutIcon,
} from 'lucide-react';

interface SidebarProps {
  config: BannerConfig;
  setConfig: React.Dispatch<React.SetStateAction<BannerConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
  savedProjects: Record<string, BannerConfig>;
  onLoadProject: (name: string) => void;
  onDeleteProject: (name: string) => void;
  onSaveProject: () => void;
  onProjectNameChange: (name: string) => void;
  generationHistory: GenerationHistoryItem[];
  onLoadHistoryItem: (item: GenerationHistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
  onClose?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

interface TextLayerEditorProps {
  layer: TextLayer;
  index: number;
  updateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  removeTextLayer: (id: string) => void;
  updateConfig: (updates: Partial<BannerConfig>) => void;
  folds: number;
  brandColors?: string[];
  onOpenAdvanced: (layer: TextLayer) => void;
}

const TextLayerEditor: React.FC<TextLayerEditorProps> = ({ layer, index, updateTextLayer, removeTextLayer, updateConfig, folds, brandColors = [], onOpenAdvanced }) => {
  return (
    <div className="bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-4 space-y-4 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[var(--text-secondary)]">{layer.type.toUpperCase()} {String(index + 1).padStart(2, '0')}</span>
          <button 
            onClick={() => onOpenAdvanced(layer)}
            className="p-1 hover:bg-[var(--accent)]/10 rounded text-[var(--accent)] transition-colors"
            title="Advanced Styling"
          >
            <SlidersHorizontal className="w-3 h-3" />
          </button>
        </div>
        <button 
          onClick={() => removeTextLayer(layer.id)}
          className="text-[var(--text-secondary)] hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <input 
        type="text"
        value={layer.text}
        onFocus={() => updateConfig({ editingLayerId: layer.id })}
        onBlur={() => updateConfig({ editingLayerId: undefined })}
        onChange={(e) => updateTextLayer(layer.id, { text: e.target.value })}
        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]/50 text-[var(--text-primary)]"
        placeholder="Enter text..."
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Font Family</label>
          <select 
            value={layer.fontFamily}
            onChange={(e) => updateTextLayer(layer.id, { fontFamily: e.target.value as any })}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs focus:outline-none text-[var(--text-primary)]"
          >
            <option value="Playfair Display" className="bg-[var(--card-bg)]">Playfair Display</option>
            <option value="Poppins" className="bg-[var(--card-bg)]">Poppins</option>
            <option value="Inter" className="bg-[var(--card-bg)]">Inter</option>
            <option value="JetBrains Mono" className="bg-[var(--card-bg)]">JetBrains Mono</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Alignment</label>
          <div className="flex bg-[var(--bg)] rounded-lg p-0.5 border border-[var(--border)]">
            <button 
              onClick={() => updateTextLayer(layer.id, { textAlign: 'left' })}
              className={`flex-1 flex justify-center py-1 rounded ${layer.textAlign === 'left' ? 'bg-[var(--accent-glow)] text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            >
              <AlignLeft className="w-3 h-3" />
            </button>
            <button 
              onClick={() => updateTextLayer(layer.id, { textAlign: 'center' })}
              className={`flex-1 flex justify-center py-1 rounded ${layer.textAlign === 'center' ? 'bg-[var(--accent-glow)] text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button 
              onClick={() => updateTextLayer(layer.id, { textAlign: 'right' })}
              className={`flex-1 flex justify-center py-1 rounded ${layer.textAlign === 'right' ? 'bg-[var(--accent-glow)] text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            >
              <AlignRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Weight</label>
          <select 
            value={layer.fontWeight}
            onChange={(e) => updateTextLayer(layer.id, { fontWeight: parseInt(e.target.value) })}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs focus:outline-none text-[var(--text-primary)]"
          >
            <option value="100" className="bg-[var(--card-bg)]">Thin</option>
            <option value="400" className="bg-[var(--card-bg)]">Regular</option>
            <option value="500" className="bg-[var(--card-bg)]">Medium</option>
            <option value="600" className="bg-[var(--card-bg)]">Semi-Bold</option>
            <option value="700" className="bg-[var(--card-bg)]">Bold</option>
            <option value="800" className="bg-[var(--card-bg)]">Extra-Bold</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Style</label>
          <button 
            onClick={() => updateTextLayer(layer.id, { fontStyle: layer.fontStyle === 'italic' ? 'normal' : 'italic' })}
            className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-lg border transition-all ${layer.fontStyle === 'italic' ? 'bg-[var(--accent-glow)] border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-secondary)]'}`}
          >
            <Italic className="w-3 h-3" />
            <span className="text-xs">Italic</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Size ({layer.fontSize}px)</label>
          <input 
            type="range"
            min="12"
            max="120"
            value={layer.fontSize}
            onChange={(e) => updateTextLayer(layer.id, { fontSize: parseInt(e.target.value) })}
            className="w-full accent-[var(--accent)]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Line Height ({layer.lineHeight || 1.2})</label>
          <input 
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={layer.lineHeight || 1.2}
            onChange={(e) => updateTextLayer(layer.id, { lineHeight: parseFloat(e.target.value) })}
            className="w-full accent-[var(--accent)]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Fold Binding</label>
          <select 
            value={layer.foldIndex ?? ''}
            onChange={(e) => updateTextLayer(layer.id, { foldIndex: e.target.value === '' ? undefined : parseInt(e.target.value) })}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs focus:outline-none text-[var(--text-primary)]"
          >
            <option value="" className="bg-[var(--card-bg)]">Full Banner</option>
            {Array.from({ length: folds }).map((_, i) => (
              <option key={i} value={i} className="bg-[var(--card-bg)]">Fold {i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Letter Spacing ({layer.letterSpacing || 0}px)</label>
          <input 
            type="range"
            min="-5"
            max="20"
            step="0.5"
            value={layer.letterSpacing || 0}
            onChange={(e) => updateTextLayer(layer.id, { letterSpacing: parseFloat(e.target.value) })}
            className="w-full accent-[var(--accent)]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Transform</label>
          <div className="flex bg-[var(--bg)] rounded-lg p-0.5 border border-[var(--border)]">
            <button 
              onClick={() => updateTextLayer(layer.id, { textTransform: 'none' })}
              className={`flex-1 text-[10px] py-1 rounded ${layer.textTransform === 'none' || !layer.textTransform ? 'bg-[var(--accent-glow)] text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            >
              Abc
            </button>
            <button 
              onClick={() => updateTextLayer(layer.id, { textTransform: 'uppercase' })}
              className={`flex-1 text-[10px] py-1 rounded ${layer.textTransform === 'uppercase' ? 'bg-[var(--accent-glow)] text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            >
              ABC
            </button>
            <button 
              onClick={() => updateTextLayer(layer.id, { textTransform: 'lowercase' })}
              className={`flex-1 text-[10px] py-1 rounded ${layer.textTransform === 'lowercase' ? 'bg-[var(--accent-glow)] text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            >
              abc
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Color Selection</label>
        <div className="flex items-center gap-3">
          <div className="relative group/color">
            <input 
              type="color"
              value={layer.color}
              onChange={(e) => updateTextLayer(layer.id, { color: e.target.value })}
              className="w-10 h-10 rounded-xl bg-[var(--bg)] border border-[var(--border)] cursor-pointer appearance-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-xl transition-transform hover:scale-105"
            />
          </div>
          <div className="flex-1 space-y-2">
            <input 
              type="text"
              value={layer.color}
              onChange={(e) => updateTextLayer(layer.id, { color: e.target.value })}
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[var(--accent)]/50 text-[var(--text-primary)]"
              placeholder="#FFFFFF"
            />
            <div className="flex flex-wrap gap-1.5">
              {brandColors.map((c, i) => (
                <button 
                  key={i}
                  onClick={() => updateTextLayer(layer.id, { color: c })}
                  className={`w-5 h-5 rounded-full border border-[var(--border)] transition-transform hover:scale-110 ${layer.color === c ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--card-bg)]' : ''}`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              {['#FFFFFF', '#000000', '#3b82f6', '#f59e0b', '#ef4444', '#10b981'].map((c) => (
                <button 
                  key={c}
                  onClick={() => updateTextLayer(layer.id, { color: c })}
                  className={`w-5 h-5 rounded-full border border-[var(--border)] transition-transform hover:scale-110 ${layer.color === c ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--card-bg)]' : ''}`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Position X</label>
            <input 
              type="number"
              min="0"
              max="100"
              value={layer.position.x}
              onFocus={() => updateConfig({ editingLayerId: layer.id })}
              onBlur={() => updateConfig({ editingLayerId: undefined })}
              onChange={(e) => {
                let val = parseInt(e.target.value);
                if (isNaN(val)) val = 0;
                updateTextLayer(layer.id, { position: { ...layer.position, x: Math.min(100, Math.max(0, val)) } });
              }}
              className="w-10 bg-[var(--bg)] border border-[var(--border)] rounded px-1 py-0.5 text-[10px] text-[var(--text-secondary)] focus:outline-none"
            />
          </div>
          <input 
            type="range"
            min="0"
            max="100"
            value={layer.position.x}
            onFocus={() => updateConfig({ editingLayerId: layer.id })}
            onBlur={() => updateConfig({ editingLayerId: undefined })}
            onChange={(e) => {
              let val = parseInt(e.target.value);
              // Simple snapping logic if needed
              updateTextLayer(layer.id, { position: { ...layer.position, x: val } });
            }}
            className="w-full accent-[var(--accent)]"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Position Y</label>
            <input 
              type="number"
              min="0"
              max="100"
              value={layer.position.y}
              onFocus={() => updateConfig({ editingLayerId: layer.id })}
              onBlur={() => updateConfig({ editingLayerId: undefined })}
              onChange={(e) => {
                let val = parseInt(e.target.value);
                if (isNaN(val)) val = 0;
                updateTextLayer(layer.id, { position: { ...layer.position, y: Math.min(100, Math.max(0, val)) } });
              }}
              className="w-10 bg-[var(--bg)] border border-[var(--border)] rounded px-1 py-0.5 text-[10px] text-[var(--text-secondary)] focus:outline-none"
            />
          </div>
          <input 
            type="range"
            min="0"
            max="100"
            value={layer.position.y}
            onFocus={() => updateConfig({ editingLayerId: layer.id })}
            onBlur={() => updateConfig({ editingLayerId: undefined })}
            onChange={(e) => {
              let val = parseInt(e.target.value);
              updateTextLayer(layer.id, { position: { ...layer.position, y: val } });
            }}
            className="w-full accent-[var(--accent)]"
          />
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  config, 
  setConfig, 
  onGenerate, 
  isGenerating,
  savedProjects,
  onLoadProject,
  onDeleteProject,
  onSaveProject,
  onProjectNameChange,
  generationHistory,
  onLoadHistoryItem,
  onDeleteHistoryItem,
  onClearHistory,
  onClose,
  theme,
  onToggleTheme
}) => {
  const [activeTab, setActiveTab] = React.useState<'model' | 'layout' | 'assets' | 'typography' | 'layers' | 'history' | 'settings' | 'check'>('model');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const [isDraggingTabs, setIsDraggingTabs] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [uploadType, setUploadType] = React.useState<'product' | 'style' | 'image' | null>(null);
  const [draggingType, setDraggingType] = React.useState<'product' | 'style' | 'image' | null>(null);
  const [isDescribing, setIsDescribing] = React.useState(false);
  const [advancedLayer, setAdvancedLayer] = React.useState<TextLayer | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = React.useState<{ selected: boolean; label: string }>({ selected: false, label: 'Checking...' });

  React.useEffect(() => {
    const checkKey = async () => {
      const status = await getApiKeyStatus();
      setApiKeyStatus(status);
    };
    checkKey();
  }, [activeTab]);

  const updateConfig = (updates: Partial<BannerConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const addTextLayer = (type: 'heading' | 'subheading' | 'body' = 'heading') => {
    const newLayer: TextLayer = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: type === 'heading' ? 'NEW HEADLINE' : type === 'subheading' ? 'Sub-heading text' : 'Body text...',
      fontFamily: type === 'heading' ? 'Playfair Display' : 'Poppins',
      fontSize: type === 'heading' ? 48 : type === 'subheading' ? 24 : 16,
      fontWeight: type === 'heading' ? 700 : 400,
      fontStyle: 'normal',
      color: '#FFFFFF',
      textAlign: 'center',
      position: { x: 50, y: type === 'heading' ? 20 : type === 'subheading' ? 30 : 40 },
      textTransform: type === 'heading' ? 'uppercase' : 'none',
      letterSpacing: type === 'heading' ? 2 : 0,
      baselineShift: 0,
      textShadow: { enabled: false, color: '#000000', blur: 4, offsetX: 2, offsetY: 2 },
      textOutline: { enabled: false, color: '#000000', width: 1 }
    };
    updateConfig({ textLayers: [...config.textLayers, newLayer] });
  };

  const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    updateConfig({
      textLayers: config.textLayers.map(layer => layer.id === id ? { ...layer, ...updates } : layer)
    });
  };

  const removeTextLayer = (id: string) => {
    updateConfig({
      textLayers: config.textLayers.filter(layer => layer.id !== id)
    });
  };

  const handleFileClick = (type: 'product' | 'style' | 'image') => {
    setUploadType(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadType) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (uploadType === 'product') {
        updateConfig({ productRef: { ...config.productRef, image: base64, strength: config.productRef?.strength ?? 80 } });
      } else if (uploadType === 'style') {
        updateConfig({ styleRef: { ...config.styleRef, image: base64, strength: config.styleRef?.strength ?? 50 } });
      } else if (uploadType === 'image') {
        updateConfig({ imageRef: { ...config.imageRef, image: base64, strength: config.imageRef?.strength ?? 50 } });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (e: React.MouseEvent, type: 'product' | 'style' | 'image') => {
    e.stopPropagation();
    if (type === 'product') {
      updateConfig({ productRef: { ...config.productRef, image: undefined } });
    } else if (type === 'style') {
      updateConfig({ styleRef: { ...config.styleRef, image: undefined } });
    } else if (type === 'image') {
      updateConfig({ imageRef: { ...config.imageRef, image: undefined } });
    }
  };

  const handleDragOver = (e: React.DragEvent, type: 'product' | 'style' | 'image') => {
    e.preventDefault();
    setDraggingType(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingType(null);
  };

  const handleDrop = (e: React.DragEvent, type: 'product' | 'style' | 'image') => {
    e.preventDefault();
    setDraggingType(null);
    
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'product') {
        updateConfig({ productRef: { ...config.productRef, image: base64, strength: config.productRef?.strength ?? 80 } });
      } else if (type === 'style') {
        updateConfig({ styleRef: { ...config.styleRef, image: base64, strength: config.styleRef?.strength ?? 50 } });
      } else if (type === 'image') {
        updateConfig({ imageRef: { ...config.imageRef, image: base64, strength: config.imageRef?.strength ?? 50 } });
      }
    };
    reader.readAsDataURL(file);
  };

  const activeBrandColors = config.activeBrandId 
    ? config.brandPresets.find(b => b.id === config.activeBrandId)?.colors 
    : [];

  const handleTabsMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    setIsDraggingTabs(true);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeft(tabsRef.current.scrollLeft);
  };

  const handleTabsMouseLeave = () => {
    setIsDraggingTabs(false);
  };

  const handleTabsMouseUp = () => {
    setIsDraggingTabs(false);
  };

  const handleTabsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingTabs || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed
    tabsRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-80 h-full border-r border-[var(--border)] flex flex-col bg-[var(--card-bg)] transition-colors duration-300">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      {/* Header */}
      <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--accent)] blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-8 h-8 bg-gradient-to-br from-[var(--accent)] to-[#60a5fa] rounded-lg flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)]">
                <Sparkles size={18} className="text-black fill-current" />
              </div>
            </div>
            <h1 className="text-[20px] font-['Verdana'] not-italic font-normal bg-black uppercase tracking-[-0.05em] leading-none text-[var(--text-primary)]">
              SEAMORA<span className="text-[var(--accent)] font-bold">.AI</span>
            </h1>
          </div>
          <p className="text-[8px] font-mono text-[var(--text-secondary)] mt-2 uppercase tracking-[0.3em] opacity-60">Brand Design Engine v5.0</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleTheme}
            className="p-2 hover:bg-[var(--accent-glow)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-[var(--accent-glow)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Layout size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="relative border-b border-[var(--border)] bg-[var(--card-bg)]/40 backdrop-blur-md sticky top-0 z-20">
        <div 
          ref={tabsRef}
          onMouseDown={handleTabsMouseDown}
          onMouseLeave={handleTabsMouseLeave}
          onMouseUp={handleTabsMouseUp}
          onMouseMove={handleTabsMouseMove}
          className={`flex items-center gap-1.5 px-3 py-2.5 overflow-x-auto scroll-smooth custom-scrollbar-h ${isDraggingTabs ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
        >
          {[
            { id: 'model', icon: Sparkles, label: 'AI' },
            { id: 'layout', icon: Layout, label: 'Layout' },
            { id: 'assets', icon: Image, label: 'Assets' },
            { id: 'typography', icon: Type, label: 'Text' },
            { id: 'layers', icon: Layers, label: 'Layers' },
            { id: 'check', icon: ClipboardCheck, label: 'Check' },
            { id: 'history', icon: History, label: 'History' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 flex flex-col items-center justify-center gap-1.5 min-w-[64px] py-2 rounded-xl transition-all duration-300 relative group ${
                activeTab === tab.id 
                  ? 'text-[var(--accent)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-[var(--accent-glow)] rounded-xl border border-[var(--accent)]/20 shadow-[0_0_15px_var(--accent-glow)] animate-in fade-in zoom-in duration-300" />
              )}
              <tab.icon 
                size={16} 
                className={`relative z-10 transition-transform duration-300 ${
                  activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'
                }`} 
              />
              <span className="relative z-10 text-[12px] font-sans font-bold uppercase tracking-[0.1em] leading-[15px]">
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
              )}
            </button>
          ))}
        </div>
        {/* Edge Fades */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--card-bg)] to-transparent pointer-events-none z-10 opacity-80" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--card-bg)] to-transparent pointer-events-none z-10 opacity-80" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === 'model' && (
          <div className="space-y-6">
            {/* Product SKU Knowledge */}
            <section className="space-y-4">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Package className="w-3 h-3" /> Product SKU Knowledge
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'fans', name: 'Fans', prompt: 'Premium ceiling fan with BLDC technology, SilentPro low noise, Duratech long life, Anti-Dust finish, superior air delivery.' },
                  { id: 'kitchen', name: 'Kitchen', prompt: 'Modern kitchen chimney with Intelligent Auto Clean, Gesture Control, high suction power, sleek glass finish.' },
                  { id: 'lighting', name: 'Lighting', prompt: 'Star Lord LED panel, high brightness, flicker-free, energy efficient, clean white aesthetic.' },
                  { id: 'water', name: 'Water Heaters', prompt: 'Solarium water heater, rapid heating, corrosion resistance, sleek design, home comfort.' },
                  { id: 'pumps', name: 'Pumps', prompt: 'Mini Champ residential pump, high pressure, reliable performance, engineering excellence.' },
                  { id: 'mixers', name: 'Mixers', prompt: 'Mixer grinder with MaxiGrind Technology, durable motor, premium build, versatile kitchen use.' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => updateConfig({ prompt: cat.prompt })}
                    className="flex items-center gap-2 px-3 py-2.5 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all text-left"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-50 shadow-[0_0_5px_var(--accent-glow)]" />
                    {cat.name.toUpperCase()}
                  </button>
                ))}
              </div>
            </section>

            {/* Model Selection */}
            <section className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-3 h-3" /> Text Reasoning Engine
                </label>
                <div className="relative">
                  <select 
                    value={config.textModelId}
                    onChange={(e) => updateConfig({ textModelId: e.target.value as any })}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]"
                  >
                    {TEXT_MODELS.map(model => (
                      <option key={model.id} value={model.id} className="bg-[var(--card-bg)]">{model.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" /> Visual Generation Engine
                </label>
                <div className="relative">
                  <select 
                    value={config.imageModelId}
                    onChange={(e) => updateConfig({ imageModelId: e.target.value as any })}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]"
                  >
                    {IMAGE_MODELS.map(model => (
                      <option key={model.id} value={model.id} className="bg-[var(--card-bg)]">{model.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => updateConfig({ autoBestVersion: !config.autoBestVersion })}
                  className={`px-3 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${config.autoBestVersion ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)]'}`}
                >
                  Auto-Best
                </button>
                <button 
                  onClick={() => updateConfig({ compareMode: !config.compareMode })}
                  className={`px-3 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${config.compareMode ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)]'}`}
                >
                  Compare
                </button>
                <button 
                  onClick={() => updateConfig({ hybridBlend: !config.hybridBlend })}
                  className={`px-3 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${config.hybridBlend ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)]'}`}
                >
                  Hybrid
                </button>
              </div>
            </section>

            {/* Prompt */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" /> Creative Prompt
              </label>
              <div className="relative group">
                <textarea 
                  value={config.prompt}
                  onChange={(e) => updateConfig({ prompt: e.target.value })}
                  placeholder="Describe your banner vision..."
                  className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-4 py-3 pb-10 text-sm min-h-[120px] focus:outline-none focus:border-[var(--accent)]/50 transition-colors resize-none text-[var(--text-primary)]"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-[var(--card-bg)]/90 backdrop-blur-sm p-1 rounded-md border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    type="file"
                    id="describe-image"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setIsDescribing(true);
                        try {
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const base64 = reader.result as string;
                            const aiService = AIService.getInstance();
                            const description = await aiService.describeImage(base64, config.textModelId);
                            updateConfig({ prompt: description });
                          };
                          reader.readAsDataURL(file);
                        } catch (error) {
                          console.error('Description failed:', error);
                        } finally {
                          setIsDescribing(false);
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => document.getElementById('describe-image')?.click()}
                    disabled={isDescribing}
                    title="Upload image to describe"
                    className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded transition-all disabled:opacity-50"
                  >
                    {isDescribing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    onClick={() => {/* TODO: Implement Prompt Editor Modal */}}
                    title="Open Prompt Editor"
                    className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded transition-all"
                  >
                    <NotebookPen className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-3 bg-[var(--border)] mx-0.5" />
                  <button 
                    onClick={() => updateConfig({ prompt: '' })}
                    title="Clear Prompt"
                    className="p-1.5 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* Visual Mode */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Grid className="w-3 h-3" /> Visual Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MODES.map(mode => {
                  const isActive = config.mode.includes(mode.id as any);
                  return (
                    <button 
                      key={mode.id}
                      onClick={() => {
                        const newModes = isActive
                          ? config.mode.filter(m => m !== mode.id)
                          : [...config.mode, mode.id as any];
                        if (newModes.length > 0) updateConfig({ mode: newModes });
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${isActive ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-[var(--card-bg)]/50 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30'}`}
                    >
                      <span className="text-[10px] font-medium">{mode.name}</span>
                      {isActive && <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Precision Controls */}
            <section className="p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/10 space-y-4">
              <div className="flex items-center gap-2 text-[var(--accent)]">
                <Focus className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Precision Controls</span>
              </div>

              <div className="space-y-4">
                {/* Lighting */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] uppercase tracking-tighter">
                    <div className="flex items-center gap-1.5">
                      <Sun className="w-3 h-3" />
                      <span>Lighting Style</span>
                    </div>
                  </div>
                  <select 
                    value={config.lighting}
                    onChange={(e) => updateConfig({ lighting: e.target.value as any })}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[10px] font-mono uppercase focus:outline-none focus:border-[var(--accent)]/50 text-[var(--text-primary)] appearance-none cursor-pointer"
                  >
                    <option value="studio">Studio (Clean)</option>
                    <option value="natural">Natural (Soft)</option>
                    <option value="dramatic">Dramatic (High Contrast)</option>
                    <option value="high-key">High-Key (Bright)</option>
                    <option value="low-key">Low-Key (Moody)</option>
                    <option value="neon">Neon (Cyberpunk)</option>
                  </select>
                </div>

                {/* Composition */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] uppercase tracking-tighter">
                    <div className="flex items-center gap-1.5">
                      <LayoutIcon className="w-3 h-3" />
                      <span>Composition</span>
                    </div>
                  </div>
                  <select 
                    value={config.composition}
                    onChange={(e) => updateConfig({ composition: e.target.value as any })}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[10px] font-mono uppercase focus:outline-none focus:border-[var(--accent)]/50 text-[var(--text-primary)] appearance-none cursor-pointer"
                  >
                    <option value="rule-of-thirds">Rule of Thirds</option>
                    <option value="centered">Centered</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="dynamic">Dynamic (Action)</option>
                    <option value="macro">Macro (Close-up)</option>
                  </select>
                </div>

                {/* Color Mood */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] uppercase tracking-tighter">
                    <div className="flex items-center gap-1.5">
                      <Droplets className="w-3 h-3" />
                      <span>Color Mood</span>
                    </div>
                  </div>
                  <select 
                    value={config.colorMood}
                    onChange={(e) => updateConfig({ colorMood: e.target.value as any })}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[10px] font-mono uppercase focus:outline-none focus:border-[var(--accent)]/50 text-[var(--text-primary)] appearance-none cursor-pointer"
                  >
                    <option value="warm">Warm (Inviting)</option>
                    <option value="cool">Cool (Modern)</option>
                    <option value="neutral">Neutral (True)</option>
                    <option value="high-contrast">High Contrast</option>
                    <option value="vintage">Vintage (Film)</option>
                    <option value="vibrant">Vibrant (Pop)</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-6">
            {/* Layout Presets */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <LayoutIcon className="w-3 h-3" /> Layout Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => updateConfig({ aspectRatio: '16:9', width: 1920, height: 700 })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center ${config.aspectRatio === '16:9' ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-[var(--card-bg)]/50 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30'}`}
                >
                  <RectangleHorizontal className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Vertical</span>
                </button>

                <button 
                  onClick={() => updateConfig({ aspectRatio: '1:1', width: 1080, height: 1080 })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center ${config.aspectRatio === '1:1' ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-[var(--card-bg)]/50 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30'}`}
                >
                  <Square className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Square</span>
                </button>
              </div>
            </section>

            {/* Precision Dimensions */}
            <section className="p-4 rounded-xl bg-[var(--card-bg)]/30 border border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Precision Dimensions</label>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)] text-[9px] font-mono">
                  <div className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
                  LIVE
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-tighter">Width (px)</span>
                  <div className="relative">
                    <input 
                      type="number"
                      value={config.width}
                      onChange={(e) => updateConfig({ width: parseInt(e.target.value) })}
                      className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[11px] font-mono focus:outline-none focus:border-[var(--accent)]/50 text-[var(--text-primary)]"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-4 border-r border-[var(--border)]" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-tighter">Height (px)</span>
                  <div className="relative">
                    <input 
                      type="number"
                      value={config.height}
                      onChange={(e) => updateConfig({ height: parseInt(e.target.value) })}
                      className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[11px] font-mono focus:outline-none focus:border-[var(--accent)]/50 text-[var(--text-primary)]"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-4 border-r border-[var(--border)]" />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)]/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-tighter">Fold Count</span>
                  <span className="text-[var(--accent)] font-mono text-xs">{config.folds}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="8" 
                  step="1"
                  value={config.folds}
                  onChange={(e) => updateConfig({ folds: parseInt(e.target.value) })}
                  className="w-full accent-[var(--accent)] h-1.5 bg-[var(--input-bg)] rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-1 text-[8px] font-mono text-[var(--text-secondary)] opacity-50">
                  <span>MIN: 1</span>
                  <span>MAX: 8</span>
                </div>
              </div>
            </section>

            {/* Continuity Engine */}
            <section className="p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/10 space-y-4 relative overflow-hidden">
              {/* Hardware-style background pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--accent) 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-[var(--accent)]">
                  <Settings className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Continuity Engine v2.4</span>
                </div>
                <div className="px-1.5 py-0.5 rounded border border-[var(--accent)]/30 text-[var(--accent)] text-[8px] font-mono uppercase">
                  Active
                </div>
              </div>
              
              <div className="space-y-5 relative z-10">
                {[
                  { label: 'Edge Alignment', key: 'edgeAlignment' },
                  { label: 'Seam Blending', key: 'seamBlending' },
                  { label: 'Depth Mapping', key: 'depthMapping' }
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <div className="flex items-center justify-between text-[9px] text-[var(--text-secondary)] font-mono uppercase tracking-tighter">
                      <span>{item.label}</span>
                      <span className="text-[var(--accent)]">{(config.continuityEngine as any)[item.key]}%</span>
                    </div>
                    <div className="relative h-1.5 bg-[var(--input-bg)] rounded-full overflow-hidden border border-[var(--border)]/30">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--accent)]/40 to-[var(--accent)] transition-all duration-300"
                        style={{ width: `${(config.continuityEngine as any)[item.key]}%` }}
                      />
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={(config.continuityEngine as any)[item.key]}
                        onChange={(e) => updateConfig({ 
                          continuityEngine: { ...config.continuityEngine, [item.key]: parseInt(e.target.value) } 
                        })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-[8px] font-mono text-[var(--text-secondary)] uppercase tracking-widest opacity-50 relative z-10">
                <span>Sync: Enabled</span>
                <span>Buffer: 256ms</span>
              </div>
            </section>

            {/* Output Resolution */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Monitor className="w-3 h-3" /> Output Resolution
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(['512px', '720p', '1K', '2K', '4K'] as const).map(res => (
                  <button 
                    key={res}
                    onClick={() => updateConfig({ resolution: res })}
                    className={`py-2 rounded-lg border text-[10px] font-bold transition-all ${config.resolution === res ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30'}`}
                  >
                    {res}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-[var(--card-bg)]/50 border border-dashed border-[var(--border)]">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                <p className="text-[9px] text-[var(--text-secondary)]">AI Super-Resolution pipeline active for 4K exports</p>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-6">
            {/* Brand Presets */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-3 h-3" /> Brand Presets
              </label>
              <div className="grid grid-cols-1 gap-2">
                {config.brandPresets.map(brand => (
                  <button 
                    key={brand.id}
                    onClick={() => updateConfig({ activeBrandId: config.activeBrandId === brand.id ? undefined : brand.id })}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left group ${config.activeBrandId === brand.id ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-[var(--card-bg)]/50 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30'}`}
                  >
                    <div className="flex items-center gap-3">
                      {brand.logo ? (
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1 overflow-hidden">
                          <img src={brand.logo} className="w-full h-full object-contain" alt={brand.name} referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <div className="flex -space-x-1">
                          {brand.colors.map((c, i) => (
                            <div key={i} className="w-4 h-4 rounded-full border-2 border-[var(--card-bg)]" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-tight text-[var(--text-primary)]">{brand.name}</span>
                        <span className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest">Active Preset</span>
                      </div>
                    </div>
                    {config.activeBrandId === brand.id ? (
                      <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <PlusCircle className="w-4 h-4 text-[var(--text-secondary)]/50 group-hover:text-[var(--text-secondary)]" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Reference Assets */}
            <section className="space-y-4">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-3 h-3" /> Reference Assets
              </label>
              
              <div className="space-y-4">
                {[
                  { id: 'product', label: 'Product Ref', icon: Package, aspect: 'aspect-[3/2]', key: 'productRef' },
                  { id: 'style', label: 'Style Ref', icon: Palette, aspect: 'aspect-[21/9]', key: 'styleRef' },
                  { id: 'image', label: 'Image Ref', icon: Layers, aspect: 'aspect-[21/9]', key: 'imageRef' }
                ].map((ref) => (
                  <div key={ref.id} className="p-3 rounded-xl bg-[var(--card-bg)]/30 border border-[var(--border)] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <ref.icon className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{ref.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {ref.id === 'style' && (config as any)[ref.key]?.image && (
                          <button 
                            onClick={async () => {
                              setIsDescribing(true);
                              try {
                                const description = await AIService.getInstance().describeImage((config as any)[ref.key].image, config.textModelId);
                                updateConfig({ prompt: `${config.prompt} Style: ${description}` });
                              } catch (e) {
                                console.error(e);
                              } finally {
                                setIsDescribing(false);
                              }
                            }}
                            disabled={isDescribing}
                            className="text-[9px] font-bold text-[var(--accent)] hover:text-[var(--accent)]/80 uppercase tracking-widest transition-colors flex items-center gap-1"
                          >
                            {isDescribing ? <Loader2 className="w-2 h-2 animate-spin" /> : <Sparkles className="w-2 h-2" />}
                            Describe
                          </button>
                        )}
                        {(config as any)[ref.key]?.image && (
                          <button 
                            onClick={(e) => handleDelete(e, ref.id as any)}
                            className="text-[9px] font-bold text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div 
                      onClick={() => handleFileClick(ref.id as any)}
                      onDragOver={(e) => handleDragOver(e, ref.id as any)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, ref.id as any)}
                      className={`relative ${ref.aspect} rounded-lg border border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden ${draggingType === ref.id ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] hover:border-[var(--accent)]/30'}`}
                    >
                      {(config as any)[ref.key]?.image ? (
                        <img src={(config as any)[ref.key].image} className="w-full h-full object-cover" alt={ref.label} />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Plus className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                          <span className="text-[8px] text-[var(--text-secondary)] uppercase tracking-widest">Upload</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-mono text-[var(--text-secondary)] uppercase">
                        <span>Influence Strength</span>
                        <span className="text-[var(--accent)]">{(config as any)[ref.key]?.strength}%</span>
                      </div>
                      <div className="relative h-1 bg-[var(--input-bg)] rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-[var(--accent)] transition-all"
                          style={{ width: `${(config as any)[ref.key]?.strength}%` }}
                        />
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={(config as any)[ref.key]?.strength}
                          onChange={(e) => updateConfig({ [ref.key]: { ...(config as any)[ref.key], strength: parseInt(e.target.value) } })}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-8">
            {/* Headings Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                  <Type className="w-3 h-3" /> Headings
                </label>
                <button 
                  onClick={() => addTextLayer('heading')}
                  className="flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
                >
                  <Plus className="w-3 h-3" /> ADD HEADING
                </button>
              </div>
              <div className="space-y-4">
                {config.textLayers.filter(l => l.type === 'heading').map((layer, index) => (
                  <TextLayerEditor 
                    key={layer.id} 
                    layer={layer} 
                    index={index} 
                    updateTextLayer={updateTextLayer} 
                    removeTextLayer={removeTextLayer}
                    updateConfig={updateConfig}
                    folds={config.folds}
                    brandColors={activeBrandColors}
                    onOpenAdvanced={(l) => setAdvancedLayer(l)}
                  />
                ))}
              </div>
            </section>

            {/* Sub-headings Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                  <Type className="w-3 h-3" /> Sub-headings
                </label>
                <button 
                  onClick={() => addTextLayer('subheading')}
                  className="flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
                >
                  <Plus className="w-3 h-3" /> ADD SUB-HEADING
                </button>
              </div>
              <div className="space-y-4">
                {config.textLayers.filter(l => l.type === 'subheading').map((layer, index) => (
                  <TextLayerEditor 
                    key={layer.id} 
                    layer={layer} 
                    index={index} 
                    updateTextLayer={updateTextLayer} 
                    removeTextLayer={removeTextLayer}
                    updateConfig={updateConfig}
                    folds={config.folds}
                    brandColors={activeBrandColors}
                    onOpenAdvanced={(l) => setAdvancedLayer(l)}
                  />
                ))}
              </div>
            </section>

            {/* Body Text Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                  <Type className="w-3 h-3" /> Body Text
                </label>
                <button 
                  onClick={() => addTextLayer('body')}
                  className="flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
                >
                  <Plus className="w-3 h-3" /> ADD BODY
                </button>
              </div>
              <div className="space-y-4">
                {config.textLayers.filter(l => l.type === 'body').map((layer, index) => (
                  <TextLayerEditor 
                    key={layer.id} 
                    layer={layer} 
                    index={index} 
                    updateTextLayer={updateTextLayer} 
                    removeTextLayer={removeTextLayer}
                    updateConfig={updateConfig}
                    folds={config.folds}
                    brandColors={activeBrandColors}
                    onOpenAdvanced={(l) => setAdvancedLayer(l)}
                  />
                ))}
              </div>
            </section>

            {config.textLayers.length === 0 && (
              <div className="py-12 border border-dashed border-[var(--border)] rounded-2xl text-center">
                <Type className="w-8 h-8 text-[var(--text-secondary)]/30 mx-auto mb-3" />
                <p className="text-xs text-[var(--text-secondary)]">No text layers added yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-6">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Layer Stack
                </label>
                <div className="flex items-center gap-2">
                  {config.textLayers.length > 0 && (
                    <button 
                      onClick={() => {
                        if (confirm('Are you sure you want to clear all text layers?')) {
                          setConfig(prev => ({ ...prev, textLayers: [] }));
                        }
                      }}
                      className="text-[9px] font-bold text-red-400/60 hover:text-red-400 uppercase tracking-widest transition-colors mr-2"
                    >
                      Clear All
                    </button>
                  )}
                  <button className="p-1.5 hover:bg-[var(--accent)]/10 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <Eye size={14} />
                  </button>
                  <button className="p-1.5 hover:bg-[var(--accent)]/10 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <Lock size={14} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {config.textLayers.map((layer) => (
                  <div 
                    key={layer.id}
                    onClick={() => {
                      updateConfig({ editingLayerId: layer.id });
                      setActiveTab('typography');
                    }}
                    className={`group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      config.editingLayerId === layer.id 
                        ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30' 
                        : 'bg-[var(--card-bg)]/50 border-[var(--border)] hover:border-[var(--accent)]/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      layer.type === 'heading' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' :
                      layer.type === 'subheading' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' :
                      'bg-[var(--accent)]/10 text-[var(--accent)] opacity-80'
                    }`}>
                      {layer.type === 'heading' ? 'H' : layer.type === 'subheading' ? 'S' : 'B'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[var(--text-primary)] truncate">{layer.text}</p>
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">Fold {layer.foldIndex + 1}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeTextLayer(layer.id); }}
                        className="p-1.5 hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 rounded-md transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {config.textLayers.length === 0 && (
                  <div className="py-12 border border-dashed border-[var(--border)] rounded-2xl text-center">
                    <Layers className="w-8 h-8 text-[var(--text-secondary)]/30 mx-auto mb-3" />
                    <p className="text-xs text-[var(--text-secondary)]">No layers to display.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'check' && (
          <div className="space-y-6">
            <section className="space-y-4">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <ClipboardCheck className="w-3 h-3" /> Parameter Validation
              </label>
              
              <div className="space-y-3">
                {/* Prompt Check */}
                <div className={`p-4 rounded-xl border transition-all ${config.prompt.length > 10 ? 'bg-green-500/5 border-green-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-wider">Prompt Analysis</span>
                     {config.prompt.length > 10 ? <Check className="w-3 h-3 text-green-500" /> : <Info className="w-3 h-3 text-yellow-500" />}
                   </div>
                   <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                     {config.prompt.length === 0 ? 'No prompt provided. Generation will fail.' : 
                      config.prompt.length < 20 ? 'Prompt is quite short. Results might be unpredictable.' : 
                      'Prompt length is optimal for detailed generation.'}
                   </p>
                </div>

                {/* Continuity Check */}
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]/50">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-wider">Continuity Engine</span>
                     <Check className="w-3 h-3 text-green-500" />
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="text-[8px] text-[var(--text-secondary)] uppercase">Alignment</div>
                        <div className="text-[10px] font-mono text-[var(--accent)]">{config.continuityEngine.edgeAlignment}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[8px] text-[var(--text-secondary)] uppercase">Blending</div>
                        <div className="text-[10px] font-mono text-[var(--accent)]">{config.continuityEngine.seamBlending}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[8px] text-[var(--text-secondary)] uppercase">Depth</div>
                        <div className="text-[10px] font-mono text-[var(--accent)]">{config.continuityEngine.depthMapping}%</div>
                      </div>
                   </div>
                </div>

                {/* Layers Check */}
                <div className={`p-4 rounded-xl border transition-all ${config.textLayers.length > 0 ? 'bg-green-500/5 border-green-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-wider">Typography Layers</span>
                     {config.textLayers.length > 0 ? <Check className="w-3 h-3 text-green-500" /> : <Info className="w-3 h-3 text-blue-500" />}
                   </div>
                   <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                     {config.textLayers.length === 0 ? 'No text layers added. Banner will be background-only.' : 
                      `${config.textLayers.length} text layers configured across ${config.folds} folds.`}
                   </p>
                </div>

                {/* Technical Specs */}
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]/50">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-wider">Technical Summary</span>
                     <Check className="w-3 h-3 text-green-500" />
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-[var(--text-secondary)]">RESOLUTION</span>
                        <span className="text-[var(--text-primary)]">{config.resolution}</span>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-[var(--text-secondary)]">TOTAL WIDTH</span>
                        <span className="text-[var(--text-primary)]">{config.width * config.folds}PX</span>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-[var(--text-secondary)]">ASPECT RATIO</span>
                        <span className="text-[var(--text-primary)]">{config.aspectRatio}</span>
                      </div>
                   </div>
                </div>

                {/* Usage & Credits */}
                <div className="p-4 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5">
                   <div className="flex items-center justify-between mb-3">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">Usage & Credits</span>
                     <Zap className="w-3 h-3 text-[var(--accent)] animate-pulse" />
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">Estimated Credits</span>
                        <span className="text-sm font-bold text-[var(--accent)] font-mono">{calculateCredits(config)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">API Key Status</span>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${apiKeyStatus.selected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${apiKeyStatus.selected ? 'text-green-500' : 'text-red-500'}`}>
                            {apiKeyStatus.label}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-[var(--accent)]/10">
                        <p className="text-[8px] text-[var(--text-secondary)] uppercase tracking-wider leading-relaxed">
                          * Credits are calculated based on resolution, fold count, and selected AI models. 
                          Premium models consume 2x credits.
                        </p>
                      </div>
                   </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                  <History className="w-3 h-3" /> Generation History
                </label>
                {generationHistory.length > 0 && (
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all generation history?')) {
                        onClearHistory();
                      }
                    }}
                    className="text-[9px] font-bold text-red-400/60 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {generationHistory.length > 0 ? (
                  generationHistory.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-3 space-y-3 group hover:border-[var(--accent)]/50 transition-all cursor-pointer"
                      onClick={() => onLoadHistoryItem(item)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-[var(--text-secondary)]">
                          {new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteHistoryItem(item.id);
                          }}
                          className="text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                        {item.options[0]?.folds.map((fold, i) => (
                          <img 
                            key={i}
                            src={fold}
                            alt={`Fold ${i + 1}`}
                            className="w-12 h-8 object-cover rounded-md border border-[var(--border)] flex-shrink-0"
                          />
                        ))}
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] text-[var(--text-primary)] font-medium line-clamp-1 truncate">
                          {item.config.prompt}
                        </p>
                        <div className="flex items-center gap-2 text-[8px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">
                          <span>{item.config.folds} Folds</span>
                          <span>•</span>
                          <span>{item.config.resolution}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center border border-dashed border-[var(--border)] rounded-2xl">
                    <History className="w-8 h-8 text-[var(--text-secondary)]/20 mx-auto mb-3" />
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">No history yet</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Project Management */}
            <section className="space-y-4">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <FolderOpen className="w-3 h-3" /> Project Management
              </label>
              
              <div className="bg-[var(--card-bg)]/50 border border-[var(--border)] rounded-2xl p-4 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-[var(--text-secondary)]/60 uppercase">Project Name</label>
                    <input 
                      type="text"
                      value={config.projectName}
                      onChange={(e) => onProjectNameChange(e.target.value)}
                      className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]/50 text-[var(--text-primary)]"
                      placeholder="Enter project name..."
                    />
                  </div>
                  <button 
                    onClick={onSaveProject}
                    className="w-full py-2.5 bg-[var(--accent)] text-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_var(--accent-glow)] group"
                  >
                    <Save size={14} className="group-hover:scale-110 transition-transform" />
                    Save Project
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--bg)]/40 rounded-xl border border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.isAutoSaveEnabled ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-[var(--input-bg)] text-[var(--text-secondary)]'}`}>
                      <Save size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">Auto-save</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">Changes saved instantly</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateConfig({ isAutoSaveEnabled: !config.isAutoSaveEnabled })}
                    className={`w-10 h-5 rounded-full transition-colors relative ${config.isAutoSaveEnabled ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.isAutoSaveEnabled ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </section>

            {/* Generation Parameters */}
            <section className="space-y-4">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" /> Generation Parameters
              </label>
              
              <div className="bg-[var(--card-bg)]/50 border border-[var(--border)] rounded-2xl p-4 space-y-3">
                {[
                  { id: 'autoBestVersion', label: 'Auto Best Version', desc: 'Selects the highest quality output automatically', icon: Sparkles },
                  { id: 'compareMode', label: 'Compare Mode', desc: 'Generate multiple variations for comparison', icon: Grid },
                  { id: 'hybridBlend', label: 'Hybrid Blend', desc: 'Mixes multiple generation styles for unique results', icon: Droplets },
                ].map((param) => (
                  <div key={param.id} className="flex items-center justify-between p-3 bg-[var(--bg)]/40 rounded-xl border border-[var(--border)]">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${(config as any)[param.id] ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-[var(--input-bg)] text-[var(--text-secondary)]'}`}>
                        <param.icon size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{param.label}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">{param.desc}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => updateConfig({ [param.id]: !(config as any)[param.id] })}
                      className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${ (config as any)[param.id] ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${ (config as any)[param.id] ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Saved Projects List */}
            <section className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-[var(--text-secondary)]/60 uppercase px-1">Saved Projects</label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {Object.keys(savedProjects).length > 0 ? (
                    Object.keys(savedProjects).map(name => (
                      <div 
                        key={name}
                        className={`flex items-center justify-between p-2 rounded-lg border transition-all group ${name === config.projectName ? 'bg-[var(--accent)]/5 border-[var(--accent)]/20' : 'bg-[var(--card-bg)]/20 border-[var(--border)] hover:border-[var(--accent)]/30'}`}
                      >
                        <button 
                          onClick={() => onLoadProject(name)}
                          className="flex-1 text-left"
                        >
                          <p className={`text-xs font-medium ${name === config.projectName ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>{name}</p>
                          <p className="text-[9px] text-[var(--text-secondary)]/60 font-mono">
                            {new Date().toLocaleDateString()}
                          </p>
                        </button>
                        <button 
                          onClick={() => onDeleteProject(name)}
                          className="p-1.5 text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center border border-dashed border-[var(--border)] rounded-xl">
                      <History className="w-6 h-6 text-[var(--text-secondary)]/30 mx-auto mb-2" />
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">No saved projects</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Action Area */}
      <div className="p-6 border-t border-[var(--border)] bg-[var(--card-bg)]/40 space-y-4">
        {!isGenerating && (
          <button 
            onClick={() => setActiveTab('check')}
            className={`w-full py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)]/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/30 transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest ${activeTab === 'check' ? 'border-[var(--accent)]/50 text-[var(--accent)] bg-[var(--accent)]/5' : ''}`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            Check Parameters
          </button>
        )}
        <button 
          onClick={onGenerate}
          disabled={!isGenerating && !config.prompt}
          className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden border border-white/10 ${
            isGenerating 
              ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]' 
              : 'bg-gradient-to-r from-[var(--accent)] to-[#60a5fa] text-black shadow-[0_0_30px_var(--accent-glow)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:hover:scale-100 animate-pulse-glow'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin" />
              <span className="relative z-10 uppercase tracking-[0.2em] text-[10px] font-black">Stop_Generation</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform relative z-10" />
              <span className="relative z-10 uppercase tracking-[0.2em] text-[10px] font-black">Generate_Banner</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </>
          )}
        </button>

        {/* System Status Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]/30 text-[8px] font-mono text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_5px_var(--accent)]" />
            <span>System_Ready</span>
          </div>
          <span>v4.2.0_Premium</span>
        </div>
      </div>

      {advancedLayer && (
        <AdvancedTextModal 
          layer={advancedLayer}
          onUpdate={(updates) => {
            updateTextLayer(advancedLayer.id, updates);
            setAdvancedLayer(prev => prev ? { ...prev, ...updates } : null);
          }}
          onClose={() => setAdvancedLayer(null)}
        />
      )}
    </div>
  );
};
