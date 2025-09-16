// src/api.js
const RAW_BASE = (process.env.REACT_APP_API_BASE_URL || "").trim();
// remove trailing slashes
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

// Build REST URL
export const apiUrl = (path = "") => {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE) return p;           // same-origin fallback
  return `${API_BASE}${p}`;          // e.g., https://..../api + /users
};

// === Socket.IO config (robust) ===
let socketOrigin;
let socketPath = "/socket.io";

try {
  if (API_BASE) {
    const u = new URL(API_BASE);
    socketOrigin = `${u.protocol}//${u.host}`; // strip any path like /api
    // If API_BASE includes a path (e.g., /api), mount socket under that prefix
    if (u.pathname && u.pathname !== "/") {
      socketPath = `${u.pathname.replace(/\/+$/, "")}/socket.io`; // "/api/socket.io"
    }
  }
} catch {
  // ignore URL parse errors; keep defaults
}

export const SOCKET_URL = socketOrigin || undefined; // undefined => same-origin
export const SOCKET_PATH = socketPath;               // "/socket.io" or "/api/socket.io"
