import { User } from '../db/models/user.ts';
import { requireAuth } from './jwt.ts';
import type { Request, Response, NextFunction } from 'express';

// Define a type that includes the optional auth object
interface AuthPayload {
  sub?: string;
  role?: string;
}

// Extend Express Request type to include `auth`
interface AuthenticatedRequest extends Request {
  auth?: AuthPayload;
}

export const isAdmin = [
  requireAuth, // calling requiureAuth from jwt.ts to reduce original token redundancy
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth?.sub;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admins only' });
      }

      next();
    } catch (err) {
      console.error('Admin check failed:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
];
