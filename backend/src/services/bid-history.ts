import { Server, Socket } from 'socket.io';
import { type BidInfo } from 'treasure-trove-shared';
import BidsService from './bids.ts';
import UsersService from './users.ts';

interface BidWithUsername extends BidInfo {
  username: string;
}

interface BidMessage {
  auctionId: string;
  bid: BidWithUsername;
  replayed?: boolean;
}

class BidHistoryService {
  private static async enrichBidWithUsername(
    bid: BidInfo,
  ): Promise<BidWithUsername> {
    const user = await UsersService.getUserInfoById(bid.userId);
    return { ...bid, username: user.username ?? 'Unknown' };
  }

  static sendBidToClient(socket: Socket, bidMessage: BidMessage) {
    socket.emit('bid.new', bidMessage);
  }

  static broadcastBidToAuction(io: Server, bidMessage: BidMessage) {
    io.to(`auction:${bidMessage.auctionId}`).emit('bid.new', bidMessage);
  }

  static async joinAuctionRoom(_io: Server, socket: Socket, auctionId: string) {
    const room = `auction:${auctionId}`;
    socket.join(room);

    const bids = await BidsService.getAuctionBids(auctionId);
    const enrichedBids = await Promise.all(
      bids.map((bid) => this.enrichBidWithUsername(bid)),
    );
    enrichedBids.forEach((bid) =>
      this.sendBidToClient(socket, { auctionId, bid, replayed: true }),
    );
  }

  static async createAndBroadcastBid(
    io: Server,
    auctionId: string,
    amount: number,
    userId: string,
  ): Promise<BidWithUsername> {
    const bid = await BidsService.createBid({ auctionId, amount, userId });
    const enrichedBid = await this.enrichBidWithUsername(bid);
    this.broadcastBidToAuction(io, { auctionId, bid: enrichedBid });
    return enrichedBid;
  }

  static leaveAuctionRoom(socket: Socket, auctionId: string) {
    socket.leave(`auction:${auctionId}`);
  }
}

export default BidHistoryService;
