import type { Response, NextFunction } from 'express';
import { User } from '../db/models/user.ts';
import { type TokenPayload } from 'treasure-trove-shared';
import { requireAuth } from './jwt.ts';
import type { AuthenticatedRequest } from './types.ts';

async function checkIsLocked(auth: TokenPayload | undefined): Promise<number> {
  // First verify token has proper parameters.
  if (!auth) return 404;
  if (auth!.sub === undefined) return 403;

  // If it does, make sure the user is not locked out of the platform.
  const user = await User.findById(auth!.sub);
  if (!user) return 404;
  if (user.locked) return 403;

  return 200;
}

export const userFullAuth = [
  requireAuth,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const valid = await checkIsLocked(req.auth);
      switch (valid) {
        case 404:
          return res.status(404).json({ error: 'User not found' });
        case 403:
          return res
            .status(403)
            .json({ error: 'Access denied: user is locked out' });
        case 200:
          next();
      }
    } catch (err) {
      console.error('User-lock check failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
];
