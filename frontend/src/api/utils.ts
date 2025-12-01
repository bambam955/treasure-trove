import urlJoin from 'url-join';

// Build an API route. Uses VITE_BACKEND_URL if set, otherwise defaults to /api/v1/ for production.
export function apiRoute(endpoint: string): string {
  const base = import.meta.env.VITE_BACKEND_URL ?? '/api/v1/';
  return urlJoin(base, endpoint);
}

// Define the headers used for JWT authentication in the backend.
// This reduces redundant code.
export function jwtHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}
