import { TokenPayload } from 'treasure-trove-shared';
import type { Request } from 'express';

// Extend Express Request type to include `auth`
export interface AuthenticatedRequest extends Request {
  auth?: TokenPayload;
}
