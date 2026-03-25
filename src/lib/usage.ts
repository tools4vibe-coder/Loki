import { BannerConfig } from '../types';

export const calculateCredits = (config: BannerConfig): number => {
  let base = 0;
  
  // Resolution cost
  switch (config.resolution) {
    case '512px': base = 1; break;
    case '720p': base = 2; break;
    case '1K': base = 5; break;
    case '2K': base = 10; break;
    case '4K': base = 20; break;
    default: base = 5;
  }
  
  // Folds multiplier
  const foldsMultiplier = config.folds || 1;
  
  // Model multiplier (mock logic)
  const modelMultiplier = config.imageModelId.includes('pro') ? 2 : 1;
  
  // Feature multipliers
  const featureMultiplier = (config.autoBestVersion ? 1.2 : 1) * 
                            (config.compareMode ? 2 : 1) * 
                            (config.hybridBlend ? 1.5 : 1);
  
  return Math.ceil(base * foldsMultiplier * modelMultiplier * featureMultiplier);
};

export const getApiKeyStatus = async (): Promise<{ selected: boolean; label: string }> => {
  if (typeof window === 'undefined') return { selected: false, label: 'Unknown' };
  
  if (window.aistudio?.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    return {
      selected: hasKey,
      label: hasKey ? 'Active (Premium)' : 'Not Selected'
    };
  }
  
  // Fallback for local dev
  return { selected: true, label: 'Local Dev (Free)' };
};
