import type { BidInfo, CreateBidInfo } from '@shared/bids.ts';
import { Bid, type BidDataType } from '../db/models/bid.ts';

class BidsService {
  // Get all the bids that have been made on a given auction.
  static async getAuctionBids(auctionId: string): Promise<BidInfo[]> {
    const bids = await Bid.find({ auctionId });
    return bids.map((b) => this.parseBidInfo(b._id.toString(), b));
  }

  // Make a new bid on an auction.
  static async createBid(bidInfo: CreateBidInfo): Promise<BidInfo> {
    const bid = new Bid({
      userId: bidInfo.userId,
      amount: bidInfo.amount,
      auctionId: bidInfo.auctionId,
    });
    await bid.save();
    return this.parseBidInfo(bid._id.toString(), bid);
  }

  // This function is used for taking an auction DB document and converting it to
  // a usable interface.
  private static parseBidInfo(bidId: string, bid: BidDataType): BidInfo {
    return {
      id: bidId,
      userId: bid.userId.toString(),
      amount: bid.amount,
      auctionId: bid.auctionId.toString(),
      createdDate: bid.createdAt,
    };
  }
}

export default BidsService;
