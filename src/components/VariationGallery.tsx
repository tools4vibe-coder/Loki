import React from 'react';
import { BannerOption } from '../types';
import { motion } from 'motion/react';
import { Layers, Activity } from 'lucide-react';

interface VariationGalleryProps {
  options: BannerOption[];
  onSelect: (option: BannerOption) => void;
  selectedId: string | null;
}

export const VariationGallery: React.FC<VariationGalleryProps> = ({ options, onSelect, selectedId }) => {
  if (options.length === 0) return null;

  return (
    <div className="w-full lg:w-56 h-auto lg:h-full border-t lg:border-t-0 lg:border-l border-[var(--border)] bg-[#111] flex flex-col transition-colors duration-300">
      <div className="p-4 border-b border-[var(--border)] bg-black/20">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Layers className="w-3 h-3 text-[var(--accent)]" />
            <h3 className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-[0.2em]">Variation_Rack</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-[var(--accent)] animate-pulse" />
            <span className="text-[9px] font-mono text-[var(--accent)]">{options.length}</span>
          </div>
        </div>
        <div className="text-[8px] text-[var(--text-secondary)] uppercase tracking-widest font-mono opacity-50">AI_GENERATED_OUTPUTS</div>
      </div>

      <div className="flex-1 overflow-x-auto lg:overflow-y-auto p-4 flex lg:flex-col gap-6 scrollbar-hide">
        {options.map((option, i) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(option)}
            className="relative flex-shrink-0 w-32 lg:w-full group cursor-pointer"
          >
            {/* Index Label */}
            <div className="flex items-center justify-between mb-2 px-1">
              <span className={`text-[9px] font-mono font-bold tracking-tighter transition-colors ${selectedId === option.id ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>
                VAR_0{i + 1}
              </span>
              {selectedId === option.id && (
                <div className="flex gap-0.5">
                  <div className="w-1 h-1 bg-[var(--accent)] rounded-full shadow-[0_0_5px_var(--accent)]" />
                  <div className="w-1 h-1 bg-[var(--accent)] rounded-full shadow-[0_0_5px_var(--accent)] opacity-50" />
                </div>
              )}
            </div>

            {/* Preview Card */}
            <div className={`relative aspect-[1/3] rounded-sm overflow-hidden border transition-all duration-300 ${
              selectedId === option.id 
                ? 'border-[var(--accent)] shadow-[0_0_30px_rgba(var(--accent-rgb),0.15)] scale-[1.02]' 
                : 'border-[var(--border)] hover:border-[var(--accent)]/40 hover:scale-[1.01]'
            }`}>
              <img 
                src={option.fullImage} 
                alt={`Variation ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${selectedId === option.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              
              {/* Selection Indicator */}
              {selectedId === option.id && (
                <div className="absolute inset-0 border-2 border-[var(--accent)]/20 pointer-events-none" />
              )}
            </div>

            {/* Metadata Footer */}
            <div className="mt-2 px-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[7px] font-mono text-[var(--text-secondary)] uppercase tracking-tighter">98.2% CONF</span>
              <span className="text-[7px] font-mono text-[var(--text-secondary)] uppercase tracking-tighter">1K_SR</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rack Footer */}
      <div className="p-3 border-t border-[var(--border)] bg-black/40">
        <div className="flex items-center justify-between text-[8px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">
          <span>Rack_Status</span>
          <span className="text-[var(--accent)]">Ready</span>
        </div>
      </div>
    </div>
  );
};
