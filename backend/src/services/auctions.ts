import type {
  AuctionInfo,
  CreateAuctionInfo,
  UpdateAuctionInfo,
} from '@shared/auctions.ts';
import { Auction, type AuctionDataType } from '../db/models/auction.ts';
import { Bid } from '../db/models/bid.ts';

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
        lastBidMap.get(a._id.toString()) || null,
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
      lastBid ? lastBid.createdAt : null,
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
    lastBidDate?: Date | null,
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
      lastBidDate: lastBidDate || null,
    };
  }
}

export default AuctionsService;
