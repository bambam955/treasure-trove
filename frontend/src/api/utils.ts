import normalizeUrl from 'normalize-url';

export function apiRoute(endpoint: string): string {
  const raw = import.meta.env.VITE_BACKEND_URL! + endpoint;
  return normalizeUrl(raw);
}

export function jwtHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}
