import type {
  AuctionInfo,
  CreateAuctionInfo,
  UpdateAuctionInfo,
} from '@shared/auctions.ts';
import { Auction, type AuctionDataType } from '../db/models/auction.ts';

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
      endDate: auctionInfo.endDate,
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
    };
  }
}

export default AuctionsService;
