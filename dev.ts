import { serve } from "bun";
import fs from "fs";

console.log("Starting server...");

serve({
  port: 2020,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = "." + url.pathname;

    try {
        if (fs.statSync(filePath).isDirectory()) {
            filePath = filePath + (filePath.endsWith('/') ? '' : '/') + 'index.html';
        }
    } catch(e) {
        // file doesn't exist, do nothing
    }
    
    const file = Bun.file(filePath);
    
    if (await file.exists()) {
      return new Response(file, {
        headers: {
          "Content-Type": getContentType(filePath),
          "Access-Control-Allow-Origin": "*", // For local development
        }
      });
    }
    
    return new Response("Not Found", { status: 404 });
  },
  error(error) {
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log("Server listening on http://0.0.0.0:2020");

function getContentType(filePath: string): string {
    if (filePath.endsWith(".html")) return "text/html";
    if (filePath.endsWith(".css")) return "text/css";
    if (filePath.endsWith(".js")) return "application/javascript";
    if (filePath.endsWith(".json")) return "application/json";
    if (filePath.endsWith(".png")) return "image/png";
    if (filePath.endsWith(".jpeg") || filePath.endsWith(".jpg")) return "image/jpeg";
    if (filePath.endsWith(".gltf")) return "model/gltf+json";
    if (filePath.endsWith(".bin")) return "application/octet-stream";
    if (filePath.endsWith(".mind")) return "application/octet-stream";
    return "text/plain";
}
