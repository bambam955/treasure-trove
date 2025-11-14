import express from 'express';
import type { Request, Response } from 'express';
import { requireAuth } from '../middleware/jwt.ts';
import AuctionsService from 'src/services/auctions.ts';

const auctionsRouter = express.Router();

auctionsRouter.get('/', requireAuth, async (_req: Request, res: Response) => {
  try {
    const auctions = await AuctionsService.getAllAuctions();
    res.status(200).json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ error: 'Failed to fetch auctions' });
  }
});

auctionsRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const auctionInfo = await AuctionsService.getAuctionById(req.params.id);
    return res.status(200).json(auctionInfo);
  } catch (error) {
    console.error('Error fetching auction info:', error);
    return res.status(404).json({ error: 'Auction not found ' });
  }
});

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
