import jwt, { type JwtPayload } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import {
  type RegularUserInfo,
  type CreateBidInfo,
} from 'treasure-trove-shared';
import UsersService from './users.ts';
import BidHistoryService from './bid-history.ts';

declare module 'socket.io' {
  interface Socket {
    auth: JwtPayload;
    user: RegularUserInfo;
  }
}

export function handleSocket(io: Server) {
  io.use((socket, next) => {
    if (!socket.handshake.auth?.token) {
      return next(new Error('Authentication failed: no token provided'));
    }
    jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET as string,
      async (
        err: jwt.VerifyErrors | null,
        decodedToken: string | jwt.JwtPayload | undefined,
      ) => {
        if (err) {
          return next(new Error('Authentication failed: invalid token'));
        }
        socket.auth = decodedToken as JwtPayload;
        socket.user = await UsersService.getUserInfoById(socket.auth.sub!);
        return next();
      },
    );
  });

  io.on('connection', async (socket: Socket) => {
    // Auction room events for real-time bid history
    socket.on('auction.join', (auctionId: string) =>
      BidHistoryService.joinAuctionRoom(io, socket, auctionId),
    );

    socket.on('auction.leave', (auctionId: string) =>
      BidHistoryService.leaveAuctionRoom(socket, auctionId),
    );

    socket.on(
      'bid.place',
      async (
        bidData: Omit<CreateBidInfo, 'userId'>,
        callback: (result: { success: boolean; error?: string }) => void,
      ) => {
        try {
          await BidHistoryService.createAndBroadcastBid(
            io,
            bidData.auctionId,
            bidData.amount,
            socket.user.id,
          );
          callback({ success: true });
        } catch (error) {
          callback({
            success: false,
            error:
              error instanceof Error ? error.message : 'Failed to place bid',
          });
        }
      },
    );

    // User info lookup
    socket.on(
      'user.info',
      async (
        socketId: string,
        callback: (userInfo: RegularUserInfo | null) => void,
      ) => {
        const sockets = await io.in(socketId).fetchSockets();
        if (sockets.length === 0) {
          callback(null);
          return;
        }
        callback((sockets[0] as unknown as Socket).user);
      },
    );
  });
}
