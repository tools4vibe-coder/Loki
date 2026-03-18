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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    return new GoogleGenAI({ apiKey });
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
    else if (ratio <= 2.0) aspectRatio = "16:9";
    else if (ratio <= 6.0) aspectRatio = "4:1";
    else aspectRatio = "8:1";

    const options: BannerOption[] = [];
    
    // Generate 4 variations as requested
    for (let i = 0; i < 4; i++) {
      if (signal?.aborted) break;
      
      let variationPrompt = `${brandPrompt}${config.prompt}. Variation ${i + 1}. Style: ${config.mode.join(', ')}. High resolution, professional design, seamless vertical continuity.`;
      
      if (config.hybridBlend) {
        variationPrompt += " HYBRID BLEND MODE: Combine the hyper-realistic textures of Flux with the artistic composition of DALL-E 3 and the lighting precision of Midjourney. Create a synthesized output that blends these model strengths.";
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
          // It's a URL, we'll just mention it in the prompt for now as fetching might be complex here
          // or we could try to fetch it. For simplicity, let's just mention it.
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
        parts.push({ text: `Use this as product reference with ${config.productRef.strength}% strength.` });
      }
      
      if (config.styleRef?.image) {
        parts.push({
          inlineData: {
            data: config.styleRef.image.split(',')[1],
            mimeType: "image/png"
          }
        });
        parts.push({ text: `Use this as style reference with ${config.styleRef.strength}% strength.` });
      }

      if (config.imageRef?.image) {
        parts.push({
          inlineData: {
            data: config.imageRef.image.split(',')[1],
            mimeType: "image/png"
          }
        });
        parts.push({ text: `Use this as image composition reference with ${config.imageRef.strength}% strength.` });
      }

      try {
        const response = await ai.models.generateContent({
          model: modelId,
          contents: {
            parts
          },
          config: {
            imageConfig: {
              aspectRatio,
              imageSize: config.resolution === '4K' ? '4K' : config.resolution === '2K' ? '2K' : '1K'
            }
          }
        });

        let base64Data = "";
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            base64Data = part.inlineData.data;
            break;
          }
        }

        if (base64Data) {
          const fullImage = `data:image/png;base64,${base64Data}`;
          // In a real app, we'd slice the image here. 
          // For now, we'll use the same image for all folds to demonstrate the UI
          const folds = Array(config.folds).fill(fullImage); 
          
          options.push({
            id: Math.random().toString(36).substr(2, 9),
            fullImage,
            folds,
            metadata: {
              model: config.imageModelId,
              layout: 'Vertical Stack',
              lighting: config.mode.includes('cinematic') ? 'Dramatic' : 'Studio'
            }
          });
        }
      } catch (error) {
        console.error("Error generating variation", i, error);
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

    const remixPrompt = `${brandPrompt}REMIX FOLD ${foldIndex + 1}. Original Prompt: ${config.prompt}. 
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
      const response = await ai.models.generateContent({
        model: modelId,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: foldAspectRatio,
            imageSize: config.resolution === '4K' ? '4K' : config.resolution === '2K' ? '2K' : '1K'
          }
        }
      });

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
    const response = await fetch(`/api/generate/${config.imageModelId.split('-')[0]}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Generation failed");
    }
    
    return response.json();
  }
}
