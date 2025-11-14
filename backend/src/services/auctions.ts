import {
  AuctionInfo,
  CreateAuctionInfo,
  UpdateAuctionInfo,
} from '@shared/auctions.ts';
import { Auction, AuctionDataType } from '../db/models/auction.ts';

class AuctionsService {
  static async getAllAuctions(): Promise<AuctionInfo[]> {
    const auctions = await Auction.find({});
    return auctions.map((a) =>
      AuctionsService.parseAuctionInfo(a._id.toString(), a),
    );
  }

  static async getAuctionById(auctionId: string): Promise<AuctionInfo> {
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new Error('could not find auction!');
    return this.parseAuctionInfo(auctionId, auction);
  }

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

  static parseAuctionInfo(
    auctionId: string,
    auction: AuctionDataType,
  ): AuctionInfo {
    return {
      id: auctionId,
      title: auction.title,
      description: auction.description,
      sellerId: auction.sellerId.prototype!.toString(),
      minimumBid: auction.minimumBid,
      endDate: auction.endDate,
      buyerId: auction.sellerId.prototype!.toString(),
      expectedValue: auction.expectedValue,
    };
  }
}

export default AuctionsService;
