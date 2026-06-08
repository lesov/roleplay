import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gameData } from "./src/gameData.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const publicDir = resolve(__dirname, "public");
const port = Number.parseInt(process.env.PORT || "3000", 10);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

function send(req, res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, {
    "content-type": contentType,
    "cache-control": "no-store"
  });
  res.end(req.method === "HEAD" ? undefined : body);
}

function staticPathFor(urlPath) {
  const cleanPath = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = cleanPath === "/" ? "/index.html" : cleanPath;
  const filePath = resolve(join(publicDir, requestedPath));

  if (!filePath.startsWith(publicDir)) {
    return null;
  }

  return filePath;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (req.method !== "GET" && req.method !== "HEAD") {
      send(req, res, 405, "Method not allowed");
      return;
    }

    if (url.pathname === "/api/game-data") {
      send(req, res, 200, JSON.stringify(gameData), "application/json; charset=utf-8");
      return;
    }

    const filePath = staticPathFor(url.pathname);
    if (!filePath) {
      send(req, res, 403, "Forbidden");
      return;
    }

    const body = await readFile(filePath);
    send(req, res, 200, body, contentTypes[extname(filePath)] || "application/octet-stream");
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "EISDIR") {
      send(req, res, 404, "Not found");
      return;
    }

    console.error(error);
    send(req, res, 500, "Internal server error");
  }
});

server.listen(port, () => {
  console.log(`Forgotten Realms adventure listening on http://localhost:${port}`);
});
