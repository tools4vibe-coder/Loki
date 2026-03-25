import { AIModel } from "./types";

export const TEXT_MODELS: AIModel[] = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (High Reasoning)', provider: 'google', version: 'Latest', capabilities: ['reasoning', 'detail'] },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite (Fast)', provider: 'google', version: 'Latest', capabilities: ['low-latency', 'fast'] },
];

export const IMAGE_MODELS: AIModel[] = [
  // Google Models
  { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash Image (Standard)', provider: 'google', version: '2.5', capabilities: ['fast', 'efficient', 'free'] },
  { id: 'gemini-3.1-flash-image-preview', name: 'Gemini 3.1 Flash Image (High-Quality)', provider: 'google', version: '3.1', capabilities: ['high-res', 'detail', 'free'] },
  { id: 'gemini-3-pro-image-preview', name: 'Gemini 3 Pro Image (Ultra-Res)', provider: 'google', version: '3.0', capabilities: ['1K/2K/4K', 'pro'] },
  
  // Flux Models
  { id: 'flux-1-pro', name: 'FLUX.1 Pro', provider: 'flux', version: 'v1', capabilities: ['realism', 'detail'] },
  { id: 'flux-2-pro', name: 'FLUX.2 Pro', provider: 'flux', version: 'v2', capabilities: ['next-gen', 'ultra-detail'] },
  
  // Seedream Models
  { id: 'seedream-4.5', name: 'Seedream 4.5', provider: 'seedream', version: '4.5', capabilities: ['artistic', 'vibrant'] },
  { id: 'seedream-5-lite', name: 'Seedream 5 Lite', provider: 'seedream', version: '5.0', capabilities: ['lightweight', 'fast'] },

  // OpenAI Models
  { id: 'dalle-3', name: 'DALL·E 3', provider: 'openai', version: 'v3', capabilities: ['typography', 'high-res'] },
  
  // Ideogram
  { id: 'ideogram-v2', name: 'Ideogram v2', provider: 'ideogram', version: 'v2', capabilities: ['typography', 'design'] },
];

export const MODELS: AIModel[] = [...TEXT_MODELS, ...IMAGE_MODELS];

export const MODES = [
  { id: 'product', name: 'Product Hero', description: 'Focused on product presentation' },
  { id: 'campaign', name: 'Campaign Typography', description: 'Bold text and brand elements' },
  { id: 'minimal', name: 'Minimal', description: 'Clean and spacious' },
  { id: 'futuristic', name: 'Futuristic', description: 'High-tech and neon' },
  { id: 'luxury', name: 'Luxury', description: 'Elegant and premium' },
  { id: 'ecommerce', name: 'E-commerce', description: 'Optimized for sales' },
  { id: 'aplus', name: 'A+ Content', description: 'Enhanced brand content with technical callouts' },
  { id: 'lifestyle', name: 'Lifestyle', description: 'Product in a real-world environment' },
  { id: 'cinematic', name: 'Cinematic', description: 'Dramatic lighting and depth' },
];
