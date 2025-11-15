/// <reference types="vite/client" />

import { apiRoute, jwtHeaders } from './utils';
import {
  AuctionInfo,
  auctionInfoSchema,
  CreateAuctionInfo,
  UpdateAuctionInfo,
} from '@shared/auctions.ts';

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
    return await res.json();
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
    return await res.json();
  }
}

export default AuctionsApi;
