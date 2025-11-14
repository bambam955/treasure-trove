import express from 'express';
import type { Request, Response } from 'express';
import { requireAuth } from '../middleware/jwt.ts';

const auctionsRouter = express.Router();

auctionsRouter.get('/', requireAuth, async (_req: Request, res: Response) => {
  res.status(200);
});

auctionsRouter.get(
  '/:id',
  requireAuth,
  async (_req: Request, res: Response) => {
    res.status(200);
  },
);

auctionsRouter.post('/', requireAuth, async (_req: Request, res: Response) => {
  res.status(200);
});

auctionsRouter.put(
  '/:id',
  requireAuth,
  async (_req: Request, res: Response) => {
    res.status(200);
  },
);

export default auctionsRouter;
