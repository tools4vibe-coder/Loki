import React from 'react';
import { TextLayer } from '../types';
import { X, SlidersHorizontal, Copy, Type as TypeIcon, Palette } from 'lucide-react';

interface AdvancedTextModalProps {
  layer: TextLayer;
  onUpdate: (updates: Partial<TextLayer>) => void;
  onClose: () => void;
}

export const AdvancedTextModal: React.FC<AdvancedTextModalProps> = ({ layer, onUpdate, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in">
      <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-white/5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">Advanced Styling</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-[var(--text-secondary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Typography Section */}
          <section className="space-y-4">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
              <TypeIcon className="w-3 h-3" /> Spacing & Alignment
            </label>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                  <span>Kerning (Letter Spacing)</span>
                  <span className="text-[var(--accent)]">{layer.letterSpacing || 0}px</span>
                </div>
                <input 
                  type="range"
                  min="-10"
                  max="50"
                  step="0.5"
                  value={layer.letterSpacing || 0}
                  onChange={(e) => onUpdate({ letterSpacing: parseFloat(e.target.value) })}
                  className="w-full accent-[var(--accent)]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                  <span>Baseline Shift</span>
                  <span className="text-[var(--accent)]">{layer.baselineShift || 0}px</span>
                </div>
                <input 
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={layer.baselineShift || 0}
                  onChange={(e) => onUpdate({ baselineShift: parseFloat(e.target.value) })}
                  className="w-full accent-[var(--accent)]"
                />
              </div>
            </div>
          </section>

          {/* Text Shadow Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Copy className="w-3 h-3" /> Text Shadow
              </label>
              <button 
                onClick={() => onUpdate({ 
                  textShadow: { 
                    enabled: !layer.textShadow?.enabled,
                    color: layer.textShadow?.color || '#000000',
                    blur: layer.textShadow?.blur || 4,
                    offsetX: layer.textShadow?.offsetX || 2,
                    offsetY: layer.textShadow?.offsetY || 2
                  } 
                })}
                className={`w-8 h-4 rounded-full transition-colors relative ${layer.textShadow?.enabled ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${layer.textShadow?.enabled ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>

            {layer.textShadow?.enabled && (
              <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-[var(--border)] animate-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Blur ({layer.textShadow.blur}px)</label>
                    <input 
                      type="range"
                      min="0"
                      max="20"
                      value={layer.textShadow.blur}
                      onChange={(e) => onUpdate({ textShadow: { ...layer.textShadow!, blur: parseInt(e.target.value) } })}
                      className="w-full accent-[var(--accent)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Color</label>
                    <input 
                      type="color"
                      value={layer.textShadow.color}
                      onChange={(e) => onUpdate({ textShadow: { ...layer.textShadow!, color: e.target.value } })}
                      className="w-full h-8 rounded bg-transparent cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Offset X ({layer.textShadow.offsetX}px)</label>
                    <input 
                      type="range"
                      min="-20"
                      max="20"
                      value={layer.textShadow.offsetX}
                      onChange={(e) => onUpdate({ textShadow: { ...layer.textShadow!, offsetX: parseInt(e.target.value) } })}
                      className="w-full accent-[var(--accent)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Offset Y ({layer.textShadow.offsetY}px)</label>
                    <input 
                      type="range"
                      min="-20"
                      max="20"
                      value={layer.textShadow.offsetY}
                      onChange={(e) => onUpdate({ textShadow: { ...layer.textShadow!, offsetY: parseInt(e.target.value) } })}
                      className="w-full accent-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Text Outline Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-3 h-3" /> Text Outline
              </label>
              <button 
                onClick={() => onUpdate({ 
                  textOutline: { 
                    enabled: !layer.textOutline?.enabled,
                    color: layer.textOutline?.color || '#000000',
                    width: layer.textOutline?.width || 1
                  } 
                })}
                className={`w-8 h-4 rounded-full transition-colors relative ${layer.textOutline?.enabled ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${layer.textOutline?.enabled ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>

            {layer.textOutline?.enabled && (
              <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-[var(--border)] animate-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Width ({layer.textOutline.width}px)</label>
                    <input 
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={layer.textOutline.width}
                      onChange={(e) => onUpdate({ textOutline: { ...layer.textOutline!, width: parseFloat(e.target.value) } })}
                      className="w-full accent-[var(--accent)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase">Color</label>
                    <input 
                      type="color"
                      value={layer.textOutline.color}
                      onChange={(e) => onUpdate({ textOutline: { ...layer.textOutline!, color: e.target.value } })}
                      className="w-full h-8 rounded bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[var(--accent)] text-black font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-[var(--accent)]/90 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
