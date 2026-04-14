import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes for other models (Proxying)
  app.post("/api/generate/openai", async (req, res) => {
    // Placeholder for OpenAI integration
    // In a real app, you'd use the OPENAI_API_KEY here
    res.status(501).json({ error: "OpenAI integration requires API key configuration." });
  });

  app.post("/api/generate/flux", async (req, res) => {
    res.status(501).json({ error: "Flux integration requires API key configuration." });
  });

  app.post("/api/generate/dalle", async (req, res) => {
    res.status(501).json({ error: "DALL-E 3 integration requires API key configuration." });
  });

  app.post("/api/generate/ideogram", async (req, res) => {
    res.status(501).json({ error: "Ideogram integration requires API key configuration." });
  });

  app.post("/api/generate/seedream", async (req, res) => {
    res.status(501).json({ error: "Seedream integration requires API key configuration." });
  });

  app.post("/api/generate/firefly", async (req, res) => {
    const config = req.body;
    
    // Check for real API key
    if (process.env.FIREFLY_API_KEY) {
      // Real Adobe Firefly integration would go here
      // For now, we'll still use the simulation but acknowledge the key
      console.log("Firefly API Key detected, using real engine path (simulated for demo)");
    }

    // Simulation Mode: Returns high-quality placeholder banners to allow UI testing
    // In a production environment, this would be replaced with actual Adobe Firefly API calls
    try {
      const folds = config.folds || 3;
      const promptSeed = encodeURIComponent(config.prompt.substring(0, 20));
      
      const options = Array.from({ length: 4 }).map((_, i) => {
        const id = Math.random().toString(36).substr(2, 9);
        // Use different seeds for each variation and fold to simulate unique generation
        const foldImages = Array.from({ length: folds }).map((_, f) => 
          `https://picsum.photos/seed/${promptSeed}-${i}-${f}/1024/1024`
        );

        return {
          id,
          fullImage: foldImages[0], // Preview uses first fold
          folds: foldImages,
          metadata: {
            model: config.imageModelId,
            layout: 'Firefly Multi-Fold',
            lighting: config.lighting || 'Studio'
          }
        };
      });

      // Simulate network latency for a "real" feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      res.json(options);
    } catch (error) {
      res.status(500).json({ error: "Failed to simulate Firefly generation" });
    }
  });

  app.post("/api/generate/leonardo", async (req, res) => {
    const config = req.body;
    
    // Check for real API key
    if (process.env.LEONARDO_API_KEY) {
      console.log("Leonardo API Key detected, using real engine path (simulated for demo)");
    }

    // Simulation Mode: Returns high-quality placeholder banners
    try {
      const folds = config.folds || 3;
      const promptSeed = encodeURIComponent(config.prompt.substring(0, 20));
      
      const options = Array.from({ length: 4 }).map((_, i) => {
        const id = Math.random().toString(36).substr(2, 9);
        const foldImages = Array.from({ length: folds }).map((_, f) => 
          `https://picsum.photos/seed/leonardo-${promptSeed}-${i}-${f}/1024/1024`
        );

        return {
          id,
          fullImage: foldImages[0],
          folds: foldImages,
          metadata: {
            model: config.imageModelId,
            layout: 'Leonardo Multi-Fold',
            lighting: config.lighting || 'Studio'
          }
        };
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      res.json(options);
    } catch (error) {
      res.status(500).json({ error: "Failed to simulate Leonardo generation" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
