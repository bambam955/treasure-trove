import express from 'express';
import type { Request, Response } from 'express';
import { requireAuth } from '../middleware/jwt.ts';
import AuctionsService from '../services/auctions.ts';
import {
  createAuctionSchema,
  createBidSchema,
  updateAuctionSchema,
} from 'treasure-trove-shared';
import BidsService from '../services/bids.ts';

const auctionsRouter = express.Router();

// GET information about all auctions.
auctionsRouter.get('/', requireAuth, async (_req: Request, res: Response) => {
  try {
    const auctions = await AuctionsService.getAllAuctions();
    res.status(200).json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ error: 'Failed to fetch auctions' });
  }
});

// GET information about the auction with the given ID.
auctionsRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const auctionInfo = await AuctionsService.getAuctionById(req.params.id);
    return res.status(200).json(auctionInfo);
  } catch (error) {
    console.error('Error fetching auction info:', error);
    return res.status(404).json({ error: 'Auction not found' });
  }
});

// POST endpoint to create a new auction.
auctionsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const validatedBody = createAuctionSchema.validateSync(req.body);
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

// PUT endpoint to update information about an existing auction.
auctionsRouter.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const validatedBody = updateAuctionSchema.validateSync(req.body);
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

// GET all the bids associated with a given auction.
auctionsRouter.get(
  '/:id/bids',
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const bidsInfo = await BidsService.getAuctionBids(req.params.id);
      return res.status(200).json(bidsInfo);
    } catch (error) {
      console.error('Error fetching auction bids:', error);
      return res.status(404).json({ error: "Auction's bids not found" });
    }
  },
);

// POST endpoint to create a new bid for the given auction.
auctionsRouter.post(
  '/:id/bids',
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const validatedBody = createBidSchema.validateSync(req.body);
      const bid = await BidsService.createBid(validatedBody);
      // Use 201 when a POST request successfully creates a new resource on the server.
      return res.status(201).json(bid);
    } catch (error) {
      console.error('Auction creation error:', error);
      return res.status(400).json({
        error: 'Failed to create auction',
      });
    }
  },
);

export default auctionsRouter;
