// This interface defines the data encoded in JWT tokens.
export interface TokenPayload {
  sub: string; // User ID
  role: string; // User's RBAC role
}
