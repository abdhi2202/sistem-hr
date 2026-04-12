export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  dataSource: import.meta.env.VITE_DATA_SOURCE ?? 'mock',
  timeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 10000),
};
