import normalizeUrl from 'normalize-url';

// Normalize an API route before sending it, just in case there's something wrong with how it was passed.
// This function also makes it so we only have to import the backend URL env variable in one place.
export function apiRoute(endpoint: string): string {
  const base = import.meta.env.VITE_BACKEND_URL ?? '/api/v1/';
  return normalizeUrl(base + endpoint);
}

// Define the headers used for JWT authentication in the backend.
// This reduces redundant code.
export function jwtHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}
