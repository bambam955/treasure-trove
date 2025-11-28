import AuctionsService from '../services/auctions.ts';
import { Auction } from '../db/models/auction.ts';

export function startAuctionCloseWorker() {
  // Runs every 10 seconds
  setInterval(async () => {
    try {
      const now = new Date();

      // Find expired auctions that are still active
      const expired = await Auction.find({
        endDate: { $lte: now },
        status: 'active',
      });

      for (const a of expired) {
        await AuctionsService.closeAuction(a._id.toString());
      }
    } catch (err) {
      console.error('Auction close worker error:', err);
    }
  }, 10_000);
}
