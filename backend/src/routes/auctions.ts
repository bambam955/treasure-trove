import express from 'express';
import type { Request, Response } from 'express';
import { requireAuth } from '../middleware/jwt.ts';
import AuctionsService from 'src/services/auctions.ts';
import { auctionInfoSchema } from '@shared/auctions.ts';

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

auctionsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const validatedBody = auctionInfoSchema.validateSync(req.body);
    const auction = AuctionsService.createAuction(validatedBody);
    // Use 201 when a POST request successfully creates a new resource on the server.
    return res.status(201).json(auction);
  } catch (error) {
    console.error('Auction creation error:', error);
    return res.status(400).json({
      error: 'Failed to create auction',
    });
  }
});

auctionsRouter.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const validatedBody = auctionInfoSchema.validateSync(req.body);
    const auctionInfo = await AuctionsService.updateAuction(
      req.params.id,
      validatedBody,
    );
    return res.status(200).json(auctionInfo);
  } catch (error) {
    console.error('Error updating auction:', error);
    // Use 400 when there is a bad request for some reason.
    return res.status(400).json({ error: 'failed to update auction ' });
  }
});

export default auctionsRouter;
