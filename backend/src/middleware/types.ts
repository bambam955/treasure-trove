import { type TokenPayload } from 'treasure-trove-shared';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

// Extend Express Request type to include `auth`
export interface AuthenticatedRequest extends Request {
  auth?: TokenPayload;
}

export type AuthenticatedRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => void | Promise<void> | Response | Promise<Response>;

export type MiddlewareArray = (RequestHandler | AuthenticatedRequestHandler)[];
