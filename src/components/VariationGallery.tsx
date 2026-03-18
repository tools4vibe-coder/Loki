import React from 'react';
import { BannerOption } from '../types';
import { motion } from 'motion/react';

interface VariationGalleryProps {
  options: BannerOption[];
  onSelect: (option: BannerOption) => void;
  selectedId: string | null;
}

export const VariationGallery: React.FC<VariationGalleryProps> = ({ options, onSelect, selectedId }) => {
  if (options.length === 0) return null;

  return (
    <div className="w-full lg:w-48 h-auto lg:h-full border-t lg:border-t-0 lg:border-l border-[var(--border)] bg-[var(--card-bg)]/80 backdrop-blur-xl flex flex-col transition-colors duration-300">
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-widest">Variations</h3>
          <span className="text-[8px] text-[var(--text-secondary)] uppercase tracking-tighter">AI Generated Options</span>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-secondary)] lg:hidden">{options.length} ITEMS</span>
      </div>
      <div className="flex-1 overflow-x-auto lg:overflow-y-auto p-4 flex lg:flex-col gap-4 scrollbar-hide">
        {options.map((option, i) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(option)}
            className={`relative flex-shrink-0 w-32 lg:w-full aspect-[1/3] rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
              selectedId === option.id 
                ? 'border-[var(--accent)] shadow-xl shadow-[var(--accent)]/20 scale-[1.02]' 
                : 'border-[var(--border)] hover:border-[var(--accent)]/50 hover:scale-[1.01]'
            }`}
          >
            <img 
              src={option.fullImage} 
              alt={`Variation ${i + 1}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity ${selectedId === option.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between">
              <span className={`text-[10px] font-bold font-mono ${selectedId === option.id ? 'text-[var(--accent)]' : 'text-white'}`}>#0{i + 1}</span>
              {selectedId === option.id && (
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
