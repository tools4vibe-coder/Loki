import React from 'react';
import { BannerConfig, ModelProvider, AIModel, TextLayer } from '../types';
import { MODELS, MODES, TEXT_MODELS, IMAGE_MODELS } from '../constants';
import { AIService } from '../services/aiService';
import { 
  Settings, 
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
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  config: BannerConfig;
  setConfig: React.Dispatch<React.SetStateAction<BannerConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
  savedProjects: Record<string, BannerConfig>;
  onLoadProject: (name: string) => void;
  onDeleteProject: (name: string) => void;
  onProjectNameChange: (name: string) => void;
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
}

const TextLayerEditor: React.FC<TextLayerEditorProps> = ({ layer, index, updateTextLayer, removeTextLayer, updateConfig, folds, brandColors = [] }) => {
  return (
    <div className="bg-[var(--input-bg)] border border-[var(--border)] rounded-xl p-4 space-y-4 group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-[var(--text-secondary)]">{layer.type.toUpperCase()} {String(index + 1).padStart(2, '0')}</span>
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
              // Simple snapping logic if needed, but we'll handle it in the parent if snapToGrid is on
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
  onProjectNameChange,
  onClose,
  theme,
  onToggleTheme
}) => {
  const [activeTab, setActiveTab] = React.useState<'model' | 'layout' | 'assets' | 'typography' | 'layers' | 'settings'>('model');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = React.useState<'product' | 'style' | 'image' | null>(null);
  const [draggingType, setDraggingType] = React.useState<'product' | 'style' | 'image' | null>(null);
  const [isDescribing, setIsDescribing] = React.useState(false);

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
      letterSpacing: type === 'heading' ? 2 : 0
    };
    updateConfig({ textLayers: [...config.textLayers, newLayer] });
  };

  const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    let finalUpdates = { ...updates };
    
    // Apply snapping if position is being updated and snapToGrid is enabled
    if (config.snapToGrid && updates.position) {
      const snapPoints = [0, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100];
      const snapThreshold = 2;
      
      const snap = (val: number) => {
        const closest = snapPoints.reduce((prev, curr) => 
          Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
        );
        return Math.abs(closest - val) <= snapThreshold ? closest : val;
      };

      finalUpdates.position = {
        x: updates.position.x !== undefined ? snap(updates.position.x) : config.textLayers.find(l => l.id === id)!.position.x,
        y: updates.position.y !== undefined ? snap(updates.position.y) : config.textLayers.find(l => l.id === id)!.position.y,
      };
    }

    updateConfig({
      textLayers: config.textLayers.map(layer => layer.id === id ? { ...layer, ...finalUpdates } : layer)
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
        <div>
          <h1 className="text-lg font-display uppercase tracking-tighter leading-none text-[var(--text-primary)]">
            Seamora <span className="text-[var(--accent)]">AI</span>
          </h1>
          <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-1 uppercase tracking-widest">Brand Design Engine v5.0</p>
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
      <div className="flex items-center justify-between px-2 py-4 border-b border-[var(--border)]">
        {[
          { id: 'model', icon: Sparkles, label: 'AI' },
          { id: 'layout', icon: Layout, label: 'Layout' },
          { id: 'assets', icon: Image, label: 'Assets' },
          { id: 'typography', icon: Type, label: 'Text' },
          { id: 'layers', icon: Layers, label: 'Layers' },
          { id: 'settings', icon: Settings, label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
              activeTab === tab.id 
                ? 'text-[var(--accent)] bg-[var(--accent-glow)] shadow-[0_0_15px_var(--accent-glow)]' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-glow)]'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-[9px] font-medium uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
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

            {/* Mode */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Visual Mode (Multi-Select)</label>
              <div className="grid grid-cols-1 gap-2">
                {MODES.map(mode => {
                  const isActive = config.mode.includes(mode.id as any);
                  return (
                    <button 
                      key={mode.id}
                      onClick={() => {
                        const newModes = isActive
                          ? config.mode.filter(m => m !== mode.id)
                          : [...config.mode, mode.id as any];
                        // Ensure at least one mode is selected
                        if (newModes.length > 0) {
                          updateConfig({ mode: newModes });
                        }
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${isActive ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-[var(--card-bg)]/50 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30'}`}
                    >
                      <span className="text-xs font-medium">{mode.name}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]" />}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-8">
            {/* Layout Presets */}
            <section className="space-y-4">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Layout Presets</label>
              <div className="space-y-3">
                <button 
                  onClick={() => updateConfig({ aspectRatio: '16:9', width: 1920, height: 700 })}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${config.aspectRatio === '16:9' ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-[var(--card-bg)]/50 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30'}`}
                >
                  <div className={`p-3 rounded-xl ${config.aspectRatio === '16:9' ? 'bg-[var(--accent)]/20' : 'bg-[var(--input-bg)]'}`}>
                    <RectangleHorizontal className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-[var(--text-primary)]">Vertical Continuity</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Optimized for web banners & A+ content (16:9 folds)</p>
                  </div>
                </button>

                <button 
                  onClick={() => updateConfig({ aspectRatio: '1:1', width: 1080, height: 1080 })}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${config.aspectRatio === '1:1' ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-[var(--card-bg)]/50 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30'}`}
                >
                  <div className={`p-3 rounded-xl ${config.aspectRatio === '1:1' ? 'bg-[var(--accent)]/20' : 'bg-[var(--input-bg)]'}`}>
                    <Square className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-[var(--text-primary)]">Square Continuity</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Optimized for social media stacks (1:1 folds)</p>
                  </div>
                </button>
              </div>
            </section>

            {/* Custom Dimensions */}
            <section className="space-y-4">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Custom Dimensions (Per Fold)</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">Width</span>
                  <input 
                    type="number"
                    value={config.width}
                    onChange={(e) => updateConfig({ width: parseInt(e.target.value) })}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent)]/50 text-[var(--text-primary)]"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">Height</span>
                  <input 
                    type="number"
                    value={config.height}
                    onChange={(e) => updateConfig({ height: parseInt(e.target.value) })}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent)]/50 text-[var(--text-primary)]"
                  />
                </div>
              </div>
            </section>

            {/* Folds */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Vertical Folds</label>
                <span className="text-[var(--accent)] font-mono text-xs">{config.folds}</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="8" 
                step="1"
                value={config.folds}
                onChange={(e) => updateConfig({ folds: parseInt(e.target.value) })}
                className="w-full accent-[var(--accent)]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                <span>4 FOLDS</span>
                <span>8 FOLDS</span>
              </div>
            </section>

            {/* Resolution */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Output Resolution</label>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as const).map(res => (
                  <button 
                    key={res}
                    onClick={() => updateConfig({ resolution: res })}
                    className={`py-2 rounded-lg border text-[10px] font-bold transition-all ${config.resolution === res ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)]'}`}
                  >
                    {res}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-[var(--text-secondary)] italic">4K uses AI super-resolution pipeline</p>
            </section>

            {/* Continuity Engine */}
            <section className="p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/10 space-y-3">
              <div className="flex items-center gap-2 text-[var(--accent)]">
                <Settings className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Continuity Engine</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                  <span>Edge Alignment</span>
                  <span className="text-[var(--accent)]">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                  <span>Seam Blending</span>
                  <span className="text-[var(--accent)]">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                  <span>Depth Mapping</span>
                  <span className="text-[var(--accent)]">ACTIVE</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-8">
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
                        <img src={brand.logo} className="w-6 h-6 object-contain rounded bg-[var(--text-primary)]/10 p-0.5" alt={brand.name} referrerPolicy="no-referrer" />
                      ) : (
                        <div className="flex gap-0.5">
                          {brand.colors.map((c, i) => (
                            <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      )}
                      <span className="text-xs font-medium">{brand.name}</span>
                    </div>
                    {config.activeBrandId === brand.id ? (
                      <Check className="w-3 h-3 text-[var(--accent)]" />
                    ) : (
                      <PlusCircle className="w-3 h-3 text-[var(--text-secondary)]/50 group-hover:text-[var(--text-secondary)]" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Product Reference */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Package className="w-3 h-3" /> Product Reference
              </label>
              <div 
                onClick={() => handleFileClick('product')}
                onDragOver={(e) => handleDragOver(e, 'product')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'product')}
                className={`relative aspect-[3/2] rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden ${draggingType === 'product' ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] hover:border-[var(--accent)]/30'}`}
              >
                {config.productRef?.image ? (
                  <>
                    <img src={config.productRef.image} className="w-full h-full object-cover" alt="Product Ref" />
                    <button 
                      onClick={(e) => handleDelete(e, 'product')}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                    <span className="text-[8px] text-[var(--text-secondary)] mt-1">Upload Product</span>
                  </>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] uppercase">
                  <span>Product Strength</span>
                  <span>{config.productRef?.strength}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={config.productRef?.strength}
                  onChange={(e) => updateConfig({ productRef: { ...config.productRef, strength: parseInt(e.target.value) } })}
                  className="w-full h-1 accent-[var(--accent)] bg-[var(--input-bg)] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </section>

            {/* Style Reference */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-3 h-3" /> Style Reference
              </label>
              <div 
                onClick={() => handleFileClick('style')}
                onDragOver={(e) => handleDragOver(e, 'style')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'style')}
                className={`relative aspect-[21/9] rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden ${draggingType === 'style' ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] hover:border-[var(--accent)]/30'}`}
              >
                {config.styleRef?.image ? (
                  <>
                    <img src={config.styleRef.image} className="w-full h-full object-cover" alt="Style Ref" />
                    <button 
                      onClick={(e) => handleDelete(e, 'style')}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                    <span className="text-[8px] text-[var(--text-secondary)] mt-1">Upload Moodboard</span>
                  </>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] uppercase">
                  <span>Style Strength</span>
                  <span>{config.styleRef?.strength}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={config.styleRef?.strength}
                  onChange={(e) => updateConfig({ styleRef: { ...config.styleRef, strength: parseInt(e.target.value) } })}
                  className="w-full h-1 accent-[var(--accent)] bg-[var(--input-bg)] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </section>

            {/* Image Reference */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-3 h-3" /> Image Reference
              </label>
              <div 
                onClick={() => handleFileClick('image')}
                onDragOver={(e) => handleDragOver(e, 'image')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'image')}
                className={`relative aspect-[21/9] rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden ${draggingType === 'image' ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] hover:border-[var(--accent)]/30'}`}
              >
                {config.imageRef?.image ? (
                  <>
                    <img src={config.imageRef.image} className="w-full h-full object-cover" alt="Image Ref" />
                    <button 
                      onClick={(e) => handleDelete(e, 'image')}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                    <span className="text-[8px] text-[var(--text-secondary)] mt-1">Upload Reference</span>
                  </>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] uppercase">
                  <span>Ref Strength</span>
                  <span>{config.imageRef?.strength}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={config.imageRef?.strength}
                  onChange={(e) => updateConfig({ imageRef: { ...config.imageRef, strength: parseInt(e.target.value) } })}
                  className="w-full h-1 accent-[var(--accent)] bg-[var(--input-bg)] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-8">
            {/* Precision Controls */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Precision Controls</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => updateConfig({ showGuides: !config.showGuides })}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-[10px] font-bold transition-all ${config.showGuides ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)]'}`}
                >
                  <Grid className="w-3 h-3" />
                  SHOW GUIDES
                </button>
                <button 
                  onClick={() => updateConfig({ snapToGrid: !config.snapToGrid })}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-[10px] font-bold transition-all ${config.snapToGrid ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)]'}`}
                >
                  <Zap className="w-3 h-3" />
                  SNAP TO GRID
                </button>
              </div>
            </section>

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
                    onClick={() => updateConfig({ editingLayerId: layer.id })}
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

        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Project Management */}
            <section className="space-y-4">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <FolderOpen className="w-3 h-3" /> Project Management
              </label>
              
              <div className="bg-[var(--card-bg)]/50 border border-[var(--border)] rounded-2xl p-4 space-y-4">
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

              {/* Saved Projects List */}
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

            {/* Canvas Settings */}
            <section className="space-y-4">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Grid className="w-3 h-3" /> Canvas Settings
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--card-bg)]/50 border border-[var(--border)] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                      <Grid size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[var(--text-primary)]">Snap to Grid</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">Align layers automatically</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateConfig({ snapToGrid: !config.snapToGrid })}
                    className={`w-10 h-5 rounded-full transition-colors relative ${config.snapToGrid ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.snapToGrid ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[var(--card-bg)]/50 border border-[var(--border)] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                      <Maximize2 size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[var(--text-primary)]">Show Guides</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">Display layout markers</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateConfig({ showGuides: !config.showGuides })}
                    className={`w-10 h-5 rounded-full transition-colors relative ${config.showGuides ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.showGuides ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-6 border-t border-[var(--border)] bg-[var(--card-bg)]/40">
        <button 
          onClick={onGenerate}
          disabled={!isGenerating && !config.prompt}
          className={`w-full font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 group ${
            isGenerating 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
              : 'bg-[var(--accent)] hover:bg-[var(--accent)]/90 disabled:bg-[var(--border)] disabled:text-[var(--text-secondary)]/40 text-white shadow-[var(--accent)]/20'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
              <span>STOP GENERATING</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>GENERATE BANNERS</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
