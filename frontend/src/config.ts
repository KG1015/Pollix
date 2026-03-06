/**
 * In development we use Vite proxy (same origin). In production set VITE_API_URL to your backend URL.
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? "";
