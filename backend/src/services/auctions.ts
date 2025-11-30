import type {
  AuctionInfo,
  CreateAuctionInfo,
  UpdateAuctionInfo,
} from '@shared/auctions.ts';
import { Auction, type AuctionDataType } from '../db/models/auction.ts';
import { Bid } from '../db/models/bid.ts';
import { User } from '../db/models/user.ts';
import { Types } from 'mongoose';

class AuctionsService {
  // Fetch information about all auctions in the database.
  static async getAllAuctions(): Promise<AuctionInfo[]> {
    const auctions = await Auction.find({});

    const lastBids = await Bid.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$auctionId',
          lastBidDate: { $first: '$createdAt' },
        },
      },
    ]);

    const lastBidMap = new Map<string, Date>();
    for (const b of lastBids) {
      lastBidMap.set(b._id.toString(), b.lastBidDate as Date);
    }
    return auctions.map((a) =>
      this.parseAuctionInfo(
        a._id.toString(),
        a,
        lastBidMap.get(a._id.toString()),
      ),
    );
  }

  // Fetch information about a particular auction.
  static async getAuctionById(auctionId: string): Promise<AuctionInfo> {
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new Error('could not find auction!');

    const lastBid = await Bid.findOne({ auctionId })
      .sort({ createdAt: -1 })
      .exec();

    return this.parseAuctionInfo(
      auctionId,
      auction,
      lastBid ? lastBid.createdAt : undefined,
    );
  }

  // Create a new auction.
  static async createAuction(
    auctionInfo: CreateAuctionInfo,
  ): Promise<AuctionInfo> {
    const auction = new Auction({
      title: auctionInfo.title,
      description: auctionInfo.description,
      sellerId: auctionInfo.sellerId,
      minimumBid: auctionInfo.minimumBid,
      endDate: new Date(auctionInfo.endDate),
      expectedValue: auctionInfo.expectedValue,
    });
    await auction.save();
    return this.parseAuctionInfo(auction._id.toString(), auction);
  }

  // Update information about an existing auction.
  static async updateAuction(
    auctionId: string,
    newAuction: Partial<UpdateAuctionInfo>,
  ): Promise<AuctionInfo> {
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new Error('could not update auction!');
    auction.set(newAuction);
    await auction.save();

    return this.parseAuctionInfo(auctionId, auction);
  }

  // Delete an auction by ID.
  static async deleteAuction(auctionId: string): Promise<void> {
    await Auction.findByIdAndDelete(auctionId);
  }

  // Close an auction, determining the winner if there are any bids.
  static async closeAuction(auctionId: string): Promise<AuctionInfo> {
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new Error('auction not found');

    // Already closed
    if (auction.status !== 'active')
      return this.parseAuctionInfo(auctionId, auction);

    // Fetch bids
    const bids = await Bid.find({ auctionId }).sort({ amount: -1 });

    // No bids
    if (bids.length === 0) {
      auction.status = 'closed';
      await auction.save();
      return this.parseAuctionInfo(auctionId, auction);
    }

    // Highest bid
    const highest = bids[0];

    auction.buyerId = highest.userId;
    auction.finalBidAmount = highest.amount;
    auction.status = 'purchased';
    await auction.save();

    // Winner gets auction in purchased list
    const buyer = await User.findById(highest.userId);
    if (buyer) {
      buyer.purchasedAuctions.push(new Types.ObjectId(auctionId));
      // Subtract cost of auction
      buyer.tokens = Math.max(
        0,
        (buyer.tokens ?? 0) - (auction.finalBidAmount ?? 0),
      );
      // Adjust buyer points based on expected value
      if (auction.finalBidAmount > auction.expectedValue) {
        buyer.points -= 1; // overpaid
      } else {
        buyer.points += 1; // fair or good deal
      }
      await buyer.save();
    }

    return this.parseAuctionInfo(auctionId, auction);
  }

  // This function is used for taking an auction DB document and converting it to
  // a usable interface.
  static parseAuctionInfo(
    auctionId: string,
    auction: AuctionDataType,
    lastBidDate?: Date | undefined,
  ): AuctionInfo {
    return {
      id: auctionId,
      title: auction.title,
      description: auction.description,
      sellerId: auction.sellerId.toString(),
      minimumBid: auction.minimumBid,
      endDate: auction.endDate,
      buyerId: auction.buyerId?.toString(),
      expectedValue: auction.expectedValue,
      createdDate: auction.createdAt,
      lastBidDate,
      status: auction.status,
      finalBidAmount: auction.finalBidAmount,
    };
  }
}

export default AuctionsService;
