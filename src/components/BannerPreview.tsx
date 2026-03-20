import React from 'react';
import { BannerConfig, BannerOption } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Maximize2, Layers, Grid, Share2, RefreshCw, Loader2, Sparkles, Ruler, Crosshair, Box } from 'lucide-react';

interface BannerPreviewProps {
  config: BannerConfig;
  selectedOption: BannerOption | null;
  isLoading: boolean;
  isRemixing?: number | null;
  onRemixFold?: (index: number) => void;
  onDownload?: () => void;
}

export const BannerPreview: React.FC<BannerPreviewProps> = ({ 
  config, 
  selectedOption, 
  isLoading,
  isRemixing,
  onRemixFold,
  onDownload
}) => {
  const [viewMode, setViewMode] = React.useState<'full' | 'folds'>('full');
  const [showOverlays, setShowOverlays] = React.useState(true);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_70%)] animate-pulse" />
        </div>
        <div className="z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-[var(--accent)] border-r-transparent border-b-[var(--accent)] border-l-transparent rounded-full animate-spin mb-6" />
          <h2 className="text-2xl font-display uppercase tracking-widest text-[var(--accent)]">Seamora Brand Engine</h2>
          <p className="text-[var(--text-secondary)] mt-2 font-mono text-[10px] uppercase tracking-widest">Engineering seamless continuity • Calibrating brand colors</p>
          <div className="mt-8 flex gap-2">
            <div className="w-1 h-1 bg-[var(--accent)] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-[var(--accent)] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 bg-[var(--accent)] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!selectedOption) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--text-secondary) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="p-12 border border-[var(--border)] rounded-sm text-center max-w-md bg-[#111] shadow-2xl relative z-10">
          <div className="absolute -top-px -left-px w-4 h-4 border-t border-l border-[var(--accent)]" />
          <div className="absolute -top-px -right-px w-4 h-4 border-t border-r border-[var(--accent)]" />
          <div className="absolute -bottom-px -left-px w-4 h-4 border-b border-l border-[var(--accent)]" />
          <div className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-[var(--accent)]" />

          <div className="w-20 h-20 bg-[var(--accent)]/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--accent)]/20">
            <Sparkles className="w-10 h-10 text-[var(--accent)]" />
          </div>
          <h3 className="text-xl font-display uppercase tracking-[0.2em] text-[var(--text-primary)]">Seamora AI Engine</h3>
          <p className="text-[var(--text-secondary)] mt-4 text-[11px] leading-relaxed font-mono uppercase tracking-wider opacity-60">
            Select a product category or enter a custom prompt to generate professional, brand-compliant vertical banners.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="p-3 bg-black/40 rounded-sm border border-[var(--border)] text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">
              1920x700 Per Fold
            </div>
            <div className="p-3 bg-black/40 rounded-sm border border-[var(--border)] text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">
              Seamless Continuity
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTextLayers = (foldIndex?: number) => {
    return config.textLayers
      .filter(layer => foldIndex === undefined || layer.foldIndex === foldIndex)
      .map(layer => {
        const isEditing = config.editingLayerId === layer.id;
        const style: React.CSSProperties = {
          position: 'absolute',
          left: `${layer.position.x}%`,
          top: `${layer.position.y}%`,
          transform: layer.textAlign === 'center' ? 'translate(-50%, -50%)' : layer.textAlign === 'right' ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
          fontFamily: layer.fontFamily,
          fontSize: `${layer.fontSize}px`,
          fontWeight: layer.fontWeight,
          fontStyle: layer.fontStyle,
          color: layer.color,
          textAlign: layer.textAlign,
          textTransform: layer.textTransform,
          letterSpacing: `${layer.letterSpacing || 0}px`,
          lineHeight: layer.lineHeight,
          whiteSpace: 'nowrap',
          textShadow: isEditing ? 'none' : '0 2px 10px rgba(0,0,0,0.5)',
          zIndex: isEditing ? 50 : 10,
          transition: 'all 0.2s ease',
          outline: isEditing ? '1px solid var(--accent)' : 'none',
          outlineOffset: '4px',
          backgroundColor: isEditing ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
          borderRadius: '2px',
          padding: isEditing ? '4px 8px' : '0',
          pointerEvents: 'none'
        };
        return (
          <div key={layer.id} style={style}>
            {layer.text}
          </div>
        );
      });
  };

  const fullBannerRatio = config.width / (config.height * config.folds);

  return (
    <div className="flex-1 flex flex-col bg-[#080808] overflow-hidden transition-colors duration-300">
      {/* Toolbar */}
      <div className="h-14 border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-6 bg-[#111] overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-md border border-[var(--border)]">
          <button 
            onClick={() => setViewMode('full')}
            className={`px-4 py-1.5 rounded text-[10px] font-mono tracking-widest transition-all ${viewMode === 'full' ? 'bg-[var(--accent)] text-black font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'}`}
          >
            MASTER VIEW
          </button>
          <button 
            onClick={() => setViewMode('folds')}
            className={`px-4 py-1.5 rounded text-[10px] font-mono tracking-widest transition-all ${viewMode === 'folds' ? 'bg-[var(--accent)] text-black font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'}`}
          >
            FOLD ANALYSIS
          </button>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <button 
            onClick={() => setShowOverlays(!showOverlays)}
            className={`p-2 rounded transition-colors ${showOverlays ? 'text-[var(--accent)] bg-[var(--accent)]/10' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            title="Toggle Overlays"
          >
            <Ruler className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-[var(--border)] mx-2" />
          <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" title="Full Screen">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onDownload}
            className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black px-4 py-1.5 rounded-sm text-[10px] font-bold transition-all ml-2 whitespace-nowrap tracking-widest uppercase"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">EXPORT {config.resolution}</span>
            <span className="xs:hidden">EXPORT</span>
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-16 flex justify-center scroll-smooth relative">
        {/* Background Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(var(--text-secondary) 1px, transparent 1px), linear-gradient(90deg, var(--text-secondary) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

        <div className="relative w-full" style={{ maxWidth: fullBannerRatio > 1 ? '800px' : '500px' }}>
          {viewMode === 'full' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-visible rounded-sm border border-[var(--border)] flex flex-col bg-black"
              style={{ aspectRatio: `${config.width} / ${config.height * config.folds}` }}
            >
              {/* Crop Marks */}
              {showOverlays && (
                <>
                  <div className="absolute -top-8 -left-8 w-16 h-16 border-t border-l border-[var(--text-secondary)]/30 pointer-events-none" />
                  <div className="absolute -top-8 -right-8 w-16 h-16 border-t border-r border-[var(--text-secondary)]/30 pointer-events-none" />
                  <div className="absolute -bottom-8 -left-8 w-16 h-16 border-b border-l border-[var(--text-secondary)]/30 pointer-events-none" />
                  <div className="absolute -bottom-8 -right-8 w-16 h-16 border-b border-r border-[var(--text-secondary)]/30 pointer-events-none" />
                  
                  {/* Dimension Labels */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                    W: {config.width}PX
                  </div>
                  <div className="absolute top-1/2 -right-12 -translate-y-1/2 rotate-90 text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-[0.2em] whitespace-nowrap">
                    H: {config.height * config.folds}PX
                  </div>
                </>
              )}

              {selectedOption.folds.map((fold, i) => (
                <div key={i} className="relative w-full" style={{ height: `${100 / config.folds}%` }}>
                  <img 
                    src={fold} 
                    alt={`Fold ${i + 1}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Fold-Specific Text Layers */}
                  <div className="absolute inset-0 pointer-events-none">
                    {renderTextLayers(i)}
                  </div>
                  
                  {/* Fold Label Overlay */}
                  {showOverlays && (
                    <div className="absolute top-4 left-4 text-[8px] font-mono text-white/30 tracking-widest pointer-events-none">
                      FOLD_0{i + 1}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Fold Indicators */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: config.folds - 1 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-full border-t border-[var(--accent)]/30 border-dashed z-20"
                    style={{ top: `${((i + 1) / config.folds) * 100}%` }}
                  >
                    {showOverlays && (
                      <div className="absolute right-4 -top-2 text-[8px] font-mono text-[var(--accent)]/50 bg-black px-1">
                        SEAM_LINE
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-12">
              {selectedOption.folds.map((fold, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative"
                >
                  {/* Fold Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[10px] font-mono text-[var(--text-secondary)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-colors bg-black">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-[var(--text-primary)] uppercase tracking-widest">Fold Analysis</div>
                        <div className="text-[8px] font-mono text-[var(--text-secondary)] uppercase tracking-tighter">Segment 0{i + 1} • {config.width}x{config.height}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onRemixFold?.(i)}
                        disabled={isRemixing === i}
                        className="bg-[#1a1a1a] p-2 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] disabled:opacity-50 transition-all"
                        title="Remix this fold"
                      >
                        {isRemixing === i ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = fold;
                          link.download = `fold_${i + 1}.png`;
                          link.click();
                        }}
                        className="bg-[#1a1a1a] p-2 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
                        title="Download segment"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div 
                    className="w-full relative rounded-sm border border-[var(--border)] group-hover:border-[var(--accent)]/30 transition-all overflow-hidden shadow-2xl bg-black"
                    style={{ aspectRatio: `${config.width} / ${config.height}` }}
                  >
                    <img 
                      src={fold} 
                      alt={`Fold ${i + 1}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Fold-Specific Text Layers */}
                    <div className="absolute inset-0 pointer-events-none">
                      {renderTextLayers(i)}
                    </div>

                    {/* Technical Overlays */}
                    {showOverlays && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full border-l border-white/5 border-dashed" />
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px border-t border-white/5 border-dashed" />
                        <div className="absolute top-4 right-4">
                          <Crosshair className="w-4 h-4 text-white/10" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Continuity Bridge Visual */}
                  {i < selectedOption.folds.length - 1 && (
                    <div className="h-12 flex items-center justify-center relative">
                      <div className="w-px h-full bg-gradient-to-b from-[var(--accent)]/20 to-transparent" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#080808] px-3 py-1 border border-[var(--border)] rounded-full flex items-center gap-2">
                        <Box className="w-3 h-3 text-[var(--accent)]" />
                        <span className="text-[8px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">Continuity Link</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 border-t border-[var(--border)] bg-[#111] flex items-center justify-between px-6 text-[9px] font-mono text-[var(--text-secondary)]">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            <span className="text-[var(--text-primary)]">SYSTEM_ACTIVE</span>
          </span>
          <span className="opacity-50">|</span>
          <span>ENGINE: {selectedOption.metadata.model.toUpperCase()}</span>
          <span>RESOLUTION: {config.resolution}</span>
          <span>FOLDS: {config.folds}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="opacity-50">LATENCY:</span>
            <span className="text-[var(--accent)]">4.2S</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-50">CONTINUITY:</span>
            <span className="text-[var(--accent)]">98.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
