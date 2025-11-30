/// <reference types="vite/client" />

import { BidInfo, bidInfoSchema, CreateBidInfo } from '@shared/bids.ts';
import { apiRoute, jwtHeaders } from './utils';
import {
  AuctionInfo,
  auctionInfoSchema,
  CreateAuctionInfo,
  UpdateAuctionInfo,
} from '@shared/auctions.ts';
import { queryClient } from './queryClient';

class AuctionsApi {
  // Retrieve information about all auctions.
  static async getAllAuctions(token: string): Promise<AuctionInfo[]> {
    const res = await fetch(apiRoute('auctions'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
    });

    if (!res.ok) throw new Error('failed to fetch auctions');

    // Use the defined schema to validate the response.
    // This also takes care of converting the date strings to Date objects.
    const rawBody: AuctionInfo[] = await res.json();
    const body = rawBody.map((a) => auctionInfoSchema.validateSync(a));
    return body;
  }

  // Retrieve information about a specific auction.
  static async getAuctionInfo(id: string, token: string): Promise<AuctionInfo> {
    const res = await fetch(apiRoute(`auctions/${id}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
    });

    if (!res.ok) throw new Error('failed to fetch auction');

    // Use the defined schema to validate the response.
    // This also takes care of converting the date strings to a Date.
    const rawBody = await res.json();
    const body = auctionInfoSchema.validateSync(rawBody);
    return body;
  }

  // Create a new auction.
  // If successful, the information about the new auction will be returned.
  static async createAuction(
    createAuctionInfo: CreateAuctionInfo,
    token: string,
  ): Promise<AuctionInfo> {
    const res = await fetch(apiRoute('auctions'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...jwtHeaders(token) },
      body: JSON.stringify(createAuctionInfo),
    });
    if (!res.ok) throw new Error('failed to create auction');
    const rawBody = await res.json();
    const body = auctionInfoSchema.validateSync(rawBody);
    return body;
  }

  // Update information about an existing auction.
  // If successful, the auction's updated information will be returned.
  static async updateAuction(
    id: string,
    auctionInfo: Partial<UpdateAuctionInfo>,
    token: string,
  ): Promise<AuctionInfo> {
    const res = await fetch(apiRoute(`auctions/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
      body: JSON.stringify(auctionInfo),
    });
    if (!res.ok) throw new Error('failed to update auction');
    const rawBody = await res.json();
    const body = auctionInfoSchema.validateSync(rawBody);
    return body;
  }

  // Delete an existing auction.
  static async deleteAuction(id: string, token: string): Promise<void> {
    const res = await fetch(apiRoute(`auctions/${id}`), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
    });

    if (!res.ok) {
      throw new Error('failed to delete auction');
    }
  }

  // Get the bidding history for the given auction.
  static async getAuctionBids(id: string, token: string): Promise<BidInfo[]> {
    const res = await fetch(apiRoute(`auctions/${id}/bids`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
    });
    if (!res.ok) throw new Error('failed to fetch auction bids');
    const rawBody: BidInfo[] = await res.json();
    const body = rawBody.map((a) => bidInfoSchema.validateSync(a));
    return body;
  }

  // Make a bid on an auction.
  static async makeBid(
    auctionId: string,
    newBid: CreateBidInfo,
    token: string,
  ): Promise<BidInfo> {
    const res = await fetch(apiRoute(`auctions/${auctionId}/bids`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
      body: JSON.stringify(newBid),
    });
    if (!res.ok) throw new Error('failed to make bid');
    const rawBody: BidInfo = await res.json();
    const body = bidInfoSchema.validateSync(rawBody);
    queryClient.invalidateQueries({ queryKey: ['users'] });
    return body;
  }

  // Close
  static async closeAuction(id: string, token: string): Promise<AuctionInfo> {
    const res = await fetch(apiRoute(`auctions/${id}/close`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...jwtHeaders(token) },
    });

    const rawBody = await res.json();
    const body = auctionInfoSchema.validateSync(rawBody);
    // refresh of user info
    queryClient.invalidateQueries({ queryKey: ['users', id] });

    return body;
  }
}

export default AuctionsApi;
