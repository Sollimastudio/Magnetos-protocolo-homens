import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Determine the public directory path
  // First, try relative to the server file (dist/index.js -> dist/public)
  let publicPath = path.join(__dirname, "public");
  
  // If that doesn't work, try going up one level then into dist/public
  if (!fs.existsSync(publicPath)) {
    publicPath = path.join(__dirname, "..", "dist", "public");
  }
  
  // Final fallback: check if dist/public exists from root
  if (!fs.existsSync(publicPath)) {
    publicPath = path.resolve(process.cwd(), "dist", "public");
  }

  console.log("📁 Resolved public path:", publicPath);
  console.log("📁 Path exists:", fs.existsSync(publicPath));
  console.log("📁 __dirname:", __dirname);
  console.log("📁 process.cwd():", process.cwd());

  // Serve all static files
  app.use(express.static(publicPath, { maxAge: "1h" }));

  // Catch-all: serve index.html for client-side routing
  app.get("*", (_req, res) => {
    const indexPath = path.join(publicPath, "index.html");
    
    if (!fs.existsSync(indexPath)) {
      console.error("❌ index.html not found at:", indexPath);
      res.status(404).send("index.html not found");
      return;
    }
    
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("❌ Error serving index.html:", err.message);
        res.status(500).send("Error serving page");
      }
    });
  });

  const port = process.env.PORT || 3000;

  app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Server error:", err);
  process.exit(1);
});
