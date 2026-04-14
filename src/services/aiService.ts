import { GoogleGenAI } from "@google/genai";
import { BannerConfig, BannerOption } from "../types";

export class AIService {
  private static instance: AIService;
  
  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private getGeminiAI() {
    // Use the user-selected API key if available, otherwise fall back to the environment key
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    
    // Vertex AI configuration (Google Cloud)
    const projectId = (import.meta as any).env.VITE_PROJECT_ID;
    const location = (import.meta as any).env.VITE_LOCATION || 'us-central1';

    // Heuristic: Vertex AI keys often start with 'AQ.'
    const isVertexKey = apiKey?.startsWith('AQ.');

    if (projectId) {
      // Initialize for Vertex AI
      console.log(`Initializing AI Service with Vertex AI (Project: ${projectId}, Location: ${location})`);
      return new GoogleGenAI({ 
        project: projectId, 
        location,
        apiKey: apiKey
      });
    }

    if (isVertexKey && !projectId) {
      console.warn("Vertex AI key detected but VITE_PROJECT_ID is missing. Falling back to Google AI (Gemini API), which may cause 403 errors.");
    }

    // Fallback to Google AI (Gemini API)
    if (!apiKey) throw new Error("API Key is not configured. Please select an API key in the settings.");
    return new GoogleGenAI({ apiKey });
  }

  private async withRetry<T>(fn: () => Promise<T>, maxRetries: number = 3, initialDelay: number = 2000): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        // Check if it's a rate limit error (429)
        const isRateLimit = error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429;
        
        if (isRateLimit && i < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, i);
          console.warn(`Rate limit hit. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
    throw lastError;
  }

  public async generateBanner(config: BannerConfig, signal?: AbortSignal): Promise<BannerOption[]> {
    // For this demo, we'll implement the Gemini path as the primary real integration
    // Other models would be proxied through the server
    
    if (config.imageModelId.startsWith('gemini')) {
      return this.generateWithGemini(config, signal);
    } else {
      // Proxy to server for other models
      return this.proxyGeneration(config);
    }
  }

  public async describeImage(imageBase64: string, textModelId: string): Promise<string> {
    const ai = this.getGeminiAI();
    const response = await ai.models.generateContent({
      model: textModelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64.split(',')[1],
              mimeType: "image/png"
            }
          },
          { text: "Describe this image in detail for an AI image generation prompt. Focus on composition, lighting, style, and key visual elements." }
        ]
      }
    });
    return response.text || "";
  }

  private async generateWithGemini(config: BannerConfig, signal?: AbortSignal): Promise<BannerOption[]> {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    const ai = this.getGeminiAI();
    const modelId = config.imageModelId;
    
    // Brand Preset Integration
    const activeBrand = config.brandPresets.find(b => b.id === config.activeBrandId);
    let brandPrompt = "";
    if (activeBrand) {
      brandPrompt = `BRAND IDENTITY: ${activeBrand.name}. Style: ${activeBrand.stylePrompt}. Colors: ${activeBrand.colors.join(', ')}. `;
      if (activeBrand.negativePrompt) {
        brandPrompt += `Avoid: ${activeBrand.negativePrompt}. `;
      }
    }

    // Calculate aspect ratio for the full banner
    const totalWidth = config.width;
    const totalHeight = config.height * config.folds;
    const ratio = totalWidth / totalHeight;
    
    let aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "1:4" | "1:8" | "4:1" | "8:1" = "1:1";
    
    if (ratio <= 0.15) aspectRatio = "1:8";
    else if (ratio <= 0.35) aspectRatio = "1:4";
    else if (ratio <= 0.7) aspectRatio = "3:4";
    else if (ratio <= 1.2) aspectRatio = "1:1";
    else if (ratio <= 1.5) aspectRatio = "4:3";
    else if (ratio <= 2.8) aspectRatio = "16:9";
    else if (ratio <= 6.0) aspectRatio = "4:1";
    else aspectRatio = "8:1";

    const options: BannerOption[] = [];
    
    // Generate 4 variations as requested
    for (let i = 0; i < 4; i++) {
      if (signal?.aborted) break;
      
      const foldImages: string[] = [];
      
      // Generate each fold individually for true separation and "one visual per fold"
      for (let f = 0; f < config.folds; f++) {
        if (signal?.aborted) break;

        const foldContext = f === 0 
          ? "FOLD 1 (TOP): Create a high-quality lifestyle scene featuring the product in a realistic environment."
          : `FOLD ${f + 1}: Create a distinct visual focusing on a specific feature or technical detail of the product.`;

        const livingThingsConstraint = "STRICT CONSTRAINT: Do not include any humans, animals, or living things in the image. EXCEPTION: You MAY include a human hand specifically if it is interacting with the product, such as a hand using a remote control to switch on a fan or adjust settings. No other body parts or living beings allowed.";

        const continuityParams = `CONTINUITY ENGINE: Edge Alignment: ${config.continuityEngine.edgeAlignment}%, Seam Blending: ${config.continuityEngine.seamBlending}%, Depth Mapping: ${config.continuityEngine.depthMapping}%. Ensure perfect visual flow between folds using these precision parameters.`;

        const styleParams = `LIGHTING: ${config.lighting}, COMPOSITION: ${config.composition}, COLOR MOOD: ${config.colorMood}.`;

        let variationPrompt = `${brandPrompt}${config.prompt}. Variation ${i + 1}, Fold ${f + 1}. ${foldContext} ${livingThingsConstraint} ${continuityParams} ${styleParams} Style: ${config.mode.join(', ')}. High resolution, professional design, clean composition.`;
        
        if (config.hybridBlend) {
          variationPrompt += " HYBRID BLEND MODE: Combine hyper-realistic textures with artistic composition and lighting precision.";
        }

        const parts: any[] = [{ text: variationPrompt }];
        
        // Add Brand Logo if available
        if (activeBrand?.logo) {
          if (activeBrand.logo.startsWith('data:')) {
            parts.push({
              inlineData: {
                data: activeBrand.logo.split(',')[1],
                mimeType: activeBrand.logo.split(';')[0].split(':')[1]
              }
            });
            parts.push({ text: "Incorporate this brand logo naturally into the design." });
          } else {
            parts.push({ text: `Incorporate the brand logo from this URL naturally into the design: ${activeBrand.logo}` });
          }
        }
        
        // Add references if available
        if (config.productRef?.image) {
          parts.push({
            inlineData: {
              data: config.productRef.image.split(',')[1],
              mimeType: "image/png"
            }
          });
          parts.push({ text: `Use this as product reference with ${config.productRef.strength}% strength. Ensure the product is the central focus.` });
        }

        if (config.styleRef?.image) {
          parts.push({
            inlineData: {
              data: config.styleRef.image.split(',')[1],
              mimeType: "image/png"
            }
          });
          parts.push({ text: `Apply the visual style, color palette, and artistic mood from this image as a style reference with ${config.styleRef.strength}% influence.` });
        }

        if (config.imageRef?.image) {
          parts.push({
            inlineData: {
              data: config.imageRef.image.split(',')[1],
              mimeType: "image/png"
            }
          });
          parts.push({ text: `Use this image as a general visual reference for composition and elements with ${config.imageRef.strength}% strength.` });
        }
        
        try {
          // Add a small staggered delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, (i * config.folds + f) * 500));

          const response = await this.withRetry(() => ai.models.generateContent({
            model: modelId,
            contents: { parts },
            config: {
              imageConfig: {
                aspectRatio: "16:9", // Standard for individual folds
                imageSize: config.resolution === '4K' ? '4K' : config.resolution === '2K' ? '2K' : config.resolution === '720p' ? '1K' : config.resolution === '512px' ? '512px' : '1K'
              }
            }
          }));

          let base64Data = "";
          for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              base64Data = part.inlineData.data;
              break;
            }
          }

          if (base64Data) {
            foldImages.push(`data:image/png;base64,${base64Data}`);
          } else {
            throw new Error("No image data received from API");
          }
        } catch (error: any) {
          console.error(`Error generating variation ${i} fold ${f}`, error);
          // Re-throw critical errors so the UI can handle them (e.g., API key issues)
          const errorMessage = error?.message || error?.error?.message || "";
          const errorStatus = error?.status || error?.error?.status || "";
          const errorCode = error?.code || error?.error?.code || 0;
          
          const isCritical = errorMessage.includes('PERMISSION_DENIED') || 
                            errorMessage.includes('403') ||
                            errorMessage.includes('API_KEY_INVALID') ||
                            errorMessage.includes('not found') ||
                            errorStatus === 'PERMISSION_DENIED' ||
                            errorCode === 403;
          
          if (isCritical) {
            const projectId = (import.meta as any).env.VITE_PROJECT_ID;
            const isVertexKey = apiKey?.startsWith('AQ.');
            
            if (isVertexKey && !projectId) {
              throw new Error("403 Permission Denied: Vertex AI key detected but VITE_PROJECT_ID is missing. Please set VITE_PROJECT_ID in your environment variables.");
            }
            
            if (projectId) {
              throw new Error(`403 Permission Denied: Using Vertex AI (Project: ${projectId}). Ensure the 'Vertex AI API' is enabled in your Google Cloud Console and your API key has the necessary permissions.`);
            }
            
            throw error;
          }
          // For non-critical errors, we might want to continue or show a placeholder
        }
      }

      if (foldImages.length > 0) {
        options.push({
          id: Math.random().toString(36).substr(2, 9),
          fullImage: foldImages[0], // Use first fold as preview
          folds: foldImages,
          metadata: {
            model: config.imageModelId,
            layout: 'Individual Folds',
            lighting: config.mode.includes('cinematic') ? 'Dramatic' : 'Studio'
          }
        });
      }
    }

    return options;
  }

  public async remixFold(config: BannerConfig, originalOption: BannerOption, foldIndex: number): Promise<string> {
    const ai = this.getGeminiAI();
    const modelId = config.imageModelId;
    
    const activeBrand = config.brandPresets.find(b => b.id === config.activeBrandId);
    let brandPrompt = activeBrand ? `BRAND IDENTITY: ${activeBrand.name}. Style: ${activeBrand.stylePrompt}. Colors: ${activeBrand.colors.join(', ')}. ` : "";

    // To remix a fold, we provide the adjacent folds as visual context
    const prevFold = foldIndex > 0 ? originalOption.folds[foldIndex - 1] : null;
    const nextFold = foldIndex < originalOption.folds.length - 1 ? originalOption.folds[foldIndex + 1] : null;

    const continuityParams = `CONTINUITY ENGINE: Edge Alignment: ${config.continuityEngine.edgeAlignment}%, Seam Blending: ${config.continuityEngine.seamBlending}%, Depth Mapping: ${config.continuityEngine.depthMapping}%.`;

    const remixPrompt = `${brandPrompt}REMIX FOLD ${foldIndex + 1}. Original Prompt: ${config.prompt}. 
    ${continuityParams}
    Maintain perfect continuity with the provided adjacent folds. 
    Focus on enhancing the specific area of fold ${foldIndex + 1} while keeping the overall composition consistent.`;

    const parts: any[] = [{ text: remixPrompt }];

    // Add Brand Logo if available
    if (activeBrand?.logo) {
      if (activeBrand.logo.startsWith('data:')) {
        parts.push({
          inlineData: {
            data: activeBrand.logo.split(',')[1],
            mimeType: activeBrand.logo.split(';')[0].split(':')[1]
          }
        });
        parts.push({ text: "Incorporate this brand logo naturally into the design." });
      } else {
        parts.push({ text: `Incorporate the brand logo from this URL naturally into the design: ${activeBrand.logo}` });
      }
    }

    if (prevFold) {
      parts.push({
        inlineData: {
          data: prevFold.split(',')[1],
          mimeType: "image/png"
        }
      });
      parts.push({ text: "This is the fold ABOVE. Ensure the top edge of the new fold matches this perfectly." });
    }

    if (nextFold) {
      parts.push({
        inlineData: {
          data: nextFold.split(',')[1],
          mimeType: "image/png"
        }
      });
      parts.push({ text: "This is the fold BELOW. Ensure the bottom edge of the new fold matches this perfectly." });
    }

    // Add current fold as reference but with lower strength (implied by prompt)
    parts.push({
      inlineData: {
        data: originalOption.folds[foldIndex].split(',')[1],
        mimeType: "image/png"
      }
    });
    parts.push({ text: "This is the current fold. Remix it to improve detail and composition while keeping the core elements." });

    // Calculate aspect ratio for the single fold
    const foldRatio = config.width / config.height;
    let foldAspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "1:4" | "1:8" | "4:1" | "8:1" = "1:1";
    
    if (foldRatio <= 0.15) foldAspectRatio = "1:8";
    else if (foldRatio <= 0.35) foldAspectRatio = "1:4";
    else if (foldRatio <= 0.7) foldAspectRatio = "3:4";
    else if (foldRatio <= 1.2) foldAspectRatio = "1:1";
    else if (foldRatio <= 1.5) foldAspectRatio = "4:3";
    else if (foldRatio <= 2.0) foldAspectRatio = "16:9";
    else if (foldRatio <= 6.0) foldAspectRatio = "4:1";
    else foldAspectRatio = "8:1";

    try {
      const response = await this.withRetry(() => ai.models.generateContent({
        model: modelId,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: foldAspectRatio,
            imageSize: config.resolution === '4K' ? '4K' : config.resolution === '2K' ? '2K' : config.resolution === '720p' ? '1K' : config.resolution === '512px' ? '512px' : '1K'
          }
        }
      }));

      let base64Data = "";
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64Data = part.inlineData.data;
          break;
        }
      }

      return base64Data ? `data:image/png;base64,${base64Data}` : originalOption.folds[foldIndex];
    } catch (error) {
      console.error("Error remixing fold", foldIndex, error);
      return originalOption.folds[foldIndex];
    }
  }

  private async proxyGeneration(config: BannerConfig): Promise<BannerOption[]> {
    // Placeholder for server-side proxy
    const modelPrefix = config.imageModelId.split('-')[0];
    const response = await fetch(`/api/generate/${modelPrefix}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    
    let data: any;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response as JSON", text);
        throw new Error(`Invalid response from server: ${text.substring(0, 100)}`);
      }
    }
    
    if (!response.ok) {
      throw new Error(data?.error || `Generation failed with status ${response.status}`);
    }
    
    if (!data) {
      throw new Error("Empty response from generation server");
    }
    
    return data;
  }
}
