// REST base
const RAW_BASE = (process.env.REACT_APP_API_BASE_URL || "").trim();
export const API_BASE = RAW_BASE.replace(/\/+$/, "");
export const apiUrl = (path = "") => {
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
};

// Socket.IO: always hit /socket.io at the backend origin
let origin;
try {
  if (API_BASE) {
    const u = new URL(API_BASE);
    origin = `${u.protocol}//${u.host}`; // strip any path like /api
  }
} catch {}
export const SOCKET_URL = origin || undefined; // undefined => same-origin
export const SOCKET_PATH = "/socket.io";
