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

  app.post("/api/generate/ideogram", async (req, res) => {
    res.status(501).json({ error: "Ideogram integration requires API key configuration." });
  });

  app.post("/api/generate/seedream", async (req, res) => {
    res.status(501).json({ error: "Seedream integration requires API key configuration." });
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
