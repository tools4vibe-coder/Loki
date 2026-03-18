import React from 'react';
import { BannerConfig, BannerOption } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Maximize2, Layers, Grid, Share2, RefreshCw, Loader2, Sparkles } from 'lucide-react';

interface BannerPreviewProps {
  config: BannerConfig;
  selectedOption: BannerOption | null;
  isLoading: boolean;
  isRemixing?: number | null;
  onRemixFold?: (index: number) => void;
}

export const BannerPreview: React.FC<BannerPreviewProps> = ({ 
  config, 
  selectedOption, 
  isLoading,
  isRemixing,
  onRemixFold
}) => {
  const [viewMode, setViewMode] = React.useState<'full' | 'folds'>('full');

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg)]/50 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_70%)] animate-pulse" />
        </div>
        <div className="z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-[var(--accent)] border-r-transparent border-b-[var(--accent)] border-l-transparent rounded-full animate-spin mb-6" />
          <h2 className="text-2xl font-display uppercase tracking-widest text-[var(--accent)]">Seamora Brand Engine</h2>
          <p className="text-[var(--text-secondary)] mt-2 font-mono text-sm">Engineering seamless continuity • Calibrating brand colors • Mapping product USPs</p>
        </div>
      </div>
    );
  }

  if (!selectedOption) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg)]/20 transition-colors duration-300">
        <div className="p-12 border border-dashed border-[var(--border)] rounded-3xl text-center max-w-md bg-[var(--card-bg)]/50 backdrop-blur-sm">
          <div className="w-20 h-20 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-[var(--accent)]" />
          </div>
          <h3 className="text-xl font-display uppercase tracking-widest text-[var(--text-primary)]">Seamora AI Engine</h3>
          <p className="text-[var(--text-secondary)] mt-4 text-sm leading-relaxed">
            Select a product category or enter a custom prompt to generate professional, brand-compliant vertical banners.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="p-3 bg-[var(--input-bg)] rounded-xl border border-[var(--border)] text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter">
              1920x700 Per Fold
            </div>
            <div className="p-3 bg-[var(--input-bg)] rounded-xl border border-[var(--border)] text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter">
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
          outline: isEditing ? '2px solid #3b82f6' : 'none',
          outlineOffset: '4px',
          backgroundColor: isEditing ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          borderRadius: '4px',
          padding: isEditing ? '4px 8px' : '0',
          boxShadow: isEditing ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none',
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
  const foldRatio = config.width / config.height;

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg)]/50 overflow-hidden transition-colors duration-300">
      {/* Toolbar */}
      <div className="h-14 border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-6 bg-[var(--card-bg)]/50 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          <button 
            onClick={() => setViewMode('full')}
            className={`px-3 py-1 rounded-md text-[10px] lg:text-xs font-mono transition-colors whitespace-nowrap ${viewMode === 'full' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            MASTER VIEW
          </button>
          <button 
            onClick={() => setViewMode('folds')}
            className={`px-3 py-1 rounded-md text-[10px] lg:text-xs font-mono transition-colors whitespace-nowrap ${viewMode === 'folds' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            FOLD ANALYSIS
          </button>
        </div>
        
        <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0 ml-4">
          <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" title="Full Screen">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-3 lg:px-4 py-1.5 rounded-full text-[10px] lg:text-xs font-bold transition-all ml-1 lg:ml-2 whitespace-nowrap">
            <Download className="w-3 lg:w-3.5 h-3 lg:h-3.5" />
            <span className="hidden xs:inline">EXPORT 4K</span>
            <span className="xs:hidden">EXPORT</span>
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-12 flex justify-center scroll-smooth">
        <div className="relative w-full" style={{ maxWidth: fullBannerRatio > 1 ? '800px' : '500px' }}>
          {viewMode === 'full' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative shadow-2xl shadow-[var(--accent)]/10 overflow-hidden rounded-sm border border-[var(--border)]"
              style={{ aspectRatio: `${config.width} / ${config.height * config.folds}` }}
            >
              <img 
                src={selectedOption.fullImage} 
                alt="Full Banner" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Text Layers */}
              <div className="absolute inset-0 pointer-events-none">
                {renderTextLayers()}
              </div>
              {/* Fold Indicators */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: config.folds - 1 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-full border-t border-[var(--text-primary)]/20 border-dashed"
                    style={{ top: `${((i + 1) / config.folds) * 100}%` }}
                  />
                ))}
              </div>

              {/* Visual Guides */}
              {config.showGuides && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {/* Vertical Guides */}
                  <div className="absolute inset-y-0 left-1/2 w-px bg-[var(--accent)]/20" />
                  <div className="absolute inset-y-0 left-1/4 w-px bg-[var(--accent)]/10" />
                  <div className="absolute inset-y-0 left-3/4 w-px bg-[var(--accent)]/10" />
                  
                  {/* Horizontal Guides */}
                  <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--accent)]/20" />
                  <div className="absolute inset-x-0 top-1/4 h-px bg-[var(--accent)]/10" />
                  <div className="absolute inset-x-0 top-3/4 h-px bg-[var(--accent)]/10" />

                  {/* Margin Guides (10%) */}
                  <div className="absolute inset-[10%] border border-[var(--accent)]/5 rounded-sm" />
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col gap-6">
              {selectedOption.folds.map((fold, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -left-12 top-0 text-[10px] font-mono text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                    FOLD {String(i + 1).padStart(2, '0')}
                  </div>
                  <div 
                    className="w-full relative rounded-sm border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all cursor-pointer overflow-hidden shadow-lg"
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

                    {/* Visual Guides for Fold */}
                    {config.showGuides && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute inset-y-0 left-1/2 w-px bg-[var(--accent)]/20" />
                        <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--accent)]/20" />
                        <div className="absolute inset-[10%] border border-[var(--accent)]/5 rounded-sm" />
                      </div>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-20">
                    <button 
                      onClick={() => onRemixFold?.(i)}
                      disabled={isRemixing === i}
                      className="bg-black/80 p-1.5 rounded-md text-white hover:bg-[var(--accent)] disabled:opacity-50 backdrop-blur-sm"
                      title="Remix this fold"
                    >
                      {isRemixing === i ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                    </button>
                    <button className="bg-black/80 p-1.5 rounded-md text-white hover:bg-[var(--accent)] backdrop-blur-sm">
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 border-t border-[var(--border)] bg-[var(--bg)]/40 flex items-center justify-between px-6 text-[10px] font-mono text-[var(--text-secondary)]">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            ENGINE: {selectedOption.metadata.model.toUpperCase()}
          </span>
          <span>RESOLUTION: {config.resolution} ({config.width}x{config.height * config.folds})</span>
          <span>FOLDS: {config.folds}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>LATENCY: 4.2s</span>
          <span>CONTINUITY SCORE: 98.4%</span>
        </div>
      </div>
    </div>
  );
};
