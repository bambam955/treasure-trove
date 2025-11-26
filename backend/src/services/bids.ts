import {
  findHighestBid,
  type BidInfo,
  type CreateBidInfo,
} from '@shared/bids.ts';
import { Bid, type BidDataType } from '../db/models/bid.ts';
import AuctionsService from './auctions.ts';
import UsersService from './users.ts';

class BidsService {
  // Get all the bids that have been made on a given auction.
  static async getAuctionBids(auctionId: string): Promise<BidInfo[]> {
    const bids = await Bid.find({ auctionId });
    return bids.map((b) => this.parseBidInfo(b._id.toString(), b));
  }

  // Make a new bid on an auction.
  static async createBid(bidInfo: CreateBidInfo): Promise<BidInfo> {
    const auction = await AuctionsService.getAuctionById(bidInfo.auctionId);
    const user = await UsersService.getUserInfoById(bidInfo.userId);

    // Make sure the bid is at least as high as the minimum bid.
    // We can make this preliminary check before going through all of the other bids
    // for a slight performance boost.
    if (bidInfo.amount < auction.minimumBid) {
      throw new Error('bid amount must be at least the minimum bid');
    }
    // Make sure the user has enough tokens to cover the bid.
    if (!user.tokens || user.tokens < bidInfo.amount) {
      throw new Error('user does not have enough tokens to make the bid');
    }
    // If the bid as at least as high as the minimum bid, then make sure it is higher
    // than all other bids that have been made.
    const currHighBid = await this.getCurrentHighestBid(bidInfo.auctionId);
    if (currHighBid && currHighBid.amount >= bidInfo.amount) {
      throw new Error('bid amount must be higher than the previous bid');
    }

    // If the bid amount is valid, then create the new bid.
    const bid = new Bid({
      userId: bidInfo.userId,
      amount: bidInfo.amount,
      auctionId: bidInfo.auctionId,
    });
    await bid.save();
    return this.parseBidInfo(bid._id.toString(), bid);
  }

  // Figure out what the current highest bid is on the given auction.
  private static async getCurrentHighestBid(
    auctionId: string,
  ): Promise<BidInfo | undefined> {
    const bids = await this.getAuctionBids(auctionId);
    if (bids.length === 0) return undefined;

    return findHighestBid(bids);
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
