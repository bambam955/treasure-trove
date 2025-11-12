import { type TokenPayload } from 'treasure-trove-shared';
import { User } from '../db/models/user.ts';
import { requireAuth } from './jwt.ts';
import type { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include `auth`
export interface AuthenticatedRequest extends Request {
  auth?: TokenPayload;
}

export async function checkAdmin(
  auth: TokenPayload | undefined,
): Promise<number> {
  // First verify the token has the proper parameters.
  if (!auth) return 404;
  if (auth!.role !== 'admin') return 403;

  // If it does, make sure the token's auth info matches the DB.
  const user = await User.findById(auth!.sub);
  if (!user) return 404;
  if (user.role !== 'admin') return 403;

  return 200;
}

export const isAdmin = [
  // no redundant code...admin is a layer on top of JWT auth
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const valid = await checkAdmin(req.auth);
      switch (valid) {
        case 404:
          return res.status(404).json({ error: 'User not found' });
        case 403:
          return res.status(403).json({ error: 'Access denied: Admins only' });
        case 200:
          next();
      }
    } catch (err) {
      console.error('Admin check failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
];
