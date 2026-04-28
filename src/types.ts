declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export type ModelProvider = 
  | 'google' 
  | 'openai' 
  | 'flux' 
  | 'ideogram' 
  | 'stability' 
  | 'runway' 
  | 'grok' 
  | 'seedream' 
  | 'mystic'
  | 'firefly'
  | 'leonardo'
  | 'banana';

export interface AIModel {
  id: string;
  name: string;
  provider: ModelProvider;
  version: string;
  capabilities: string[];
}

export interface BrandPreset {
  id: string;
  name: string;
  colors: string[];
  logo?: string;
  stylePrompt: string;
  negativePrompt?: string;
}

export interface TextLayer {
  id: string;
  text: string;
  type: 'heading' | 'subheading' | 'body';
  fontFamily: 'Playfair Display' | 'Inter' | 'JetBrains Mono' | 'Poppins';
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  color: string;
  textAlign: 'left' | 'center' | 'right';
  position: { x: number; y: number }; // Percentage based (0-100)
  foldIndex?: number; // Optional: bind to a specific fold
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase';
  baselineShift?: number;
  textShadow?: {
    enabled: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  textOutline?: {
    enabled: boolean;
    color: string;
    width: number;
  };
}

export interface BannerConfig {
  folds: number;
  width: number;
  height: number;
  resolution: '512px' | '720p' | '1K' | '2K' | '4K';
  mode: ('product' | 'campaign' | 'minimal' | 'futuristic' | 'luxury' | 'ecommerce' | 'aplus' | 'lifestyle' | 'cinematic')[];
  prompt: string;
  negativePrompt?: string;
  productRef?: {
    image?: string;
    strength: number;
  };
  styleRef?: {
    image?: string;
    strength: number;
  };
  imageRef?: {
    image?: string;
    strength: number;
  };
  textModelId: string;
  imageModelId: string;
  autoBestVersion: boolean;
  compareMode: boolean;
  hybridBlend: boolean;
  brandPresets: BrandPreset[];
  activeBrandId?: string;
  textLayers: TextLayer[];
  aspectRatio: '16:9' | '1:1';
  editingLayerId?: string;
  projectName: string;
  isAutoSaveEnabled: boolean;
  lighting: 'studio' | 'natural' | 'dramatic' | 'high-key' | 'low-key' | 'neon';
  composition: 'rule-of-thirds' | 'centered' | 'minimalist' | 'dynamic' | 'macro';
  colorMood: 'warm' | 'cool' | 'neutral' | 'high-contrast' | 'vintage' | 'vibrant';
  continuityEngine: {
    edgeAlignment: number;
    seamBlending: number;
    depthMapping: number;
  };
}

export interface BannerOption {
  id: string;
  fullImage: string;
  folds: string[];
  metadata: {
    model: string;
    layout: string;
    lighting: string;
  };
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: string;
  config: BannerConfig;
  options: BannerOption[];
  selectedOptionId?: string;
}
