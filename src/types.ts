export type ModelProvider = 
  | 'google' 
  | 'openai' 
  | 'flux' 
  | 'ideogram' 
  | 'stability' 
  | 'runway' 
  | 'grok' 
  | 'seedream' 
  | 'mystic';

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
}

export interface BannerConfig {
  folds: number;
  width: number;
  height: number;
  resolution: '1K' | '2K' | '4K';
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
  showGuides: boolean;
  snapToGrid: boolean;
  editingLayerId?: string;
  projectName: string;
  isAutoSaveEnabled: boolean;
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
