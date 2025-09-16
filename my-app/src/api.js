// my-app/src/api.js
// Central place to build URLs for REST & Socket.IO.
// In PROD (Vercel), we proxy `/api/*` and `/socket.io/*` to your Render backend.
// In DEV, you can set REACT_APP_API_BASE_URL to talk directly to Render.

const ENV_BASE = process.env.REACT_APP_API_BASE_URL?.trim();

// If you provide REACT_APP_API_BASE_URL, we use it (e.g. local dev).
// Otherwise we default to same-origin proxy: /api + /socket.io (Vercel rewrites).
export const API_BASE = ENV_BASE && ENV_BASE.length ? ENV_BASE.replace(/\/+$/, "") : "";
export const apiUrl = (path) =>
  API_BASE ? `${API_BASE}${path.startsWith("/") ? path : `/${path}`}` : `/api${path.startsWith("/") ? path : `/${path}`}`;

export const SOCKET_URL = API_BASE || undefined;   // undefined = same-origin
export const SOCKET_PATH = "/socket.io";           // keep default socket path
