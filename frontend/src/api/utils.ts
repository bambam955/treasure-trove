import urlJoin from 'url-join';

// Build an API route. Uses VITE_BACKEND_URL as the base of the route.
export function apiRoute(endpoint: string): string {
  const base = import.meta.env.VITE_BACKEND_URL!;
  return urlJoin(base, endpoint);
}

// Define the headers used for JWT authentication in the backend.
// This reduces redundant code.
export function jwtHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}
