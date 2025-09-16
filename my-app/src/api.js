// my-app/src/api.js
const ENV_BASE = process.env.REACT_APP_API_BASE_URL?.trim();

export const API_BASE =
  ENV_BASE && ENV_BASE.length ? ENV_BASE.replace(/\/+$/, "") : "";

export const apiUrl = (path = "") =>
  API_BASE
    ? `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`
    : `/api${path.startsWith("/") ? path : `/${path}`}`;

export const SOCKET_URL = API_BASE || undefined; // undefined = same-origin
export const SOCKET_PATH = "/socket.io";
