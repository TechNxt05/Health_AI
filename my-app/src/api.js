export const API_BASE = process.env.REACT_APP_API_BASE || "/api";
export const apiUrl = (path) => (path.startsWith("/") ? `${API_BASE}${path}` : `${API_BASE}/${path}`);
