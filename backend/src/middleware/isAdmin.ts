import { expressjwt } from 'express-jwt';
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
  expressjwt({
    secret: process.env.JWT_SECRET!,
    algorithms: ['HS256'],
  }),
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.auth?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  },
];
