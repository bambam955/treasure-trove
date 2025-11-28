import type {
  AuctionInfo,
  CreateAuctionInfo,
  UpdateAuctionInfo,
} from '@shared/auctions.ts';
import { Auction, type AuctionDataType } from '../db/models/auction.ts';
import { Bid } from '../db/models/bid.ts';
import { User } from '../db/models/user.ts';
import mongoose from 'mongoose';

class AuctionsService {
  // Fetch information about all auctions in the database.
  static async getAllAuctions(): Promise<AuctionInfo[]> {
    const auctions = await Auction.find({});
    return auctions.map((a) => this.parseAuctionInfo(a._id.toString(), a));
  }

  // Fetch information about a particular auction.
  static async getAuctionById(auctionId: string): Promise<AuctionInfo> {
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new Error('could not find auction!');
    return this.parseAuctionInfo(auctionId, auction);
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

  // This function is used for taking an auction DB document and converting it to
  // a usable interface.
  static parseAuctionInfo(
    auctionId: string,
    auction: AuctionDataType,
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
      status: auction.status,
      finalBidAmount: auction.finalBidAmount,
    };
  }
  // Close an auction, determining the winner if there are any bids.
  static async closeAuction(auctionId: string): Promise<void> {
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new Error('auction not found');

    // Already closed
    if (auction.status !== 'active') return;

    // Fetch bids 
    const bids = await Bid.find({ auctionId }).sort({ amount: -1 });

    // No bids 
    if (bids.length === 0) {
      auction.status = 'closed';
      await auction.save();
      await Auction.findByIdAndDelete(auctionId);
      return;
    }

    // Highest bid
    const highest = bids[0];

    auction.buyerId = highest.userId;      
    auction.finalBidAmount = highest.amount;
    auction.status = 'closed';
    await auction.save();

    // Winner gets auction in purchased list
    const buyer = await User.findById(highest.userId);
    if (buyer) {
      buyer.purchasedAuctions.push(new mongoose.Types.ObjectId(auctionId));
      // Adjust buyer points based on expected value
      if (auction.finalBidAmount > auction.expectedValue) {
        buyer.points -= 1; // overpaid
      } else {
        buyer.points += 1; // fair or good deal
      }
      await buyer.save();
    }
  }
}

export default AuctionsService;
