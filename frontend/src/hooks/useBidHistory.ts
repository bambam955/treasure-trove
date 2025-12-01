import { useState, useEffect, useCallback } from 'react';
import { BidInfo } from '@shared/bids.ts';
import { useSocket } from '../contexts/SocketContext';

export interface BidWithUsername extends BidInfo {
  username: string;
}

interface BidMessage {
  auctionId: string;
  bid: BidWithUsername;
  replayed?: boolean;
}

interface PlaceBidResult {
  success: boolean;
  error?: string;
}

interface UseBidHistoryResult {
  bids: BidWithUsername[];
  placeBid: (amount: number) => Promise<PlaceBidResult>;
  isConnected: boolean;
}

export function useBidHistory(auctionId: string): UseBidHistoryResult {
  const { socket, status } = useSocket();
  const [bids, setBids] = useState<BidWithUsername[]>([]);
  const isConnected = status === 'connected';

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    setBids([]);

    socket.emit('auction.join', auctionId);

    const handleNewBid = (message: BidMessage) => {
      if (message.auctionId === auctionId) {
        setBids((prevBids) => {
          if (prevBids.some((b) => b.id === message.bid.id)) {
            return prevBids;
          }
          return [...prevBids, message.bid];
        });
      }
    };

    socket.on('bid.new', handleNewBid);

    return () => {
      socket.off('bid.new', handleNewBid);
      socket.emit('auction.leave', auctionId);
    };
  }, [socket, auctionId, isConnected]);

  const placeBid = useCallback(
    async (amount: number): Promise<PlaceBidResult> => {
      if (!socket || !isConnected) {
        return { success: false, error: 'Not connected to server' };
      }

      return new Promise((resolve) => {
        socket.emit(
          'bid.place',
          { auctionId, amount },
          (result: PlaceBidResult) => {
            resolve(result);
          },
        );
      });
    },
    [socket, auctionId, isConnected],
  );

  return { bids, placeBid, isConnected };
}
