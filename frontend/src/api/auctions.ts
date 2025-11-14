/// <reference types="vite/client" />

import { apiRoute, jwtHeaders } from './utils';
import { AuctionInfo } from '@shared/auctions.ts';

class AuctionsApi {
  // TODO: get all auctions, get one auction
  static async getAllAuctions(token: string): Promise<AuctionInfo[]> {
    const res = await fetch(apiRoute('auctions'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
    });
    if (!res.ok) throw new Error('failed to fetch auctions');
    return await res.json();
  }

  static async getAuctionInfo(id: string, token: string): Promise<AuctionInfo> {
    const res = await fetch(apiRoute(`auctions/${id}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
    });
    if (!res.ok) throw new Error('failed to fetch auction');
    return await res.json();
  }

  static async createAuction(
    auctionInfo: AuctionInfo,
    token: string,
  ): Promise<AuctionInfo> {
    const res = await fetch(apiRoute('auctions'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...jwtHeaders(token) },
      body: JSON.stringify(auctionInfo),
    });
    if (!res.ok) throw new Error('failed to create auction');
    return await res.json();
  }

  static async updateAuction(
    id: string,
    auction: Partial<AuctionInfo>,
    token: string,
  ): Promise<AuctionInfo> {
    const res = await fetch(apiRoute(`auctions/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
      body: JSON.stringify(auction),
    });
    if (!res.ok) throw new Error('failed to update auction');
    return await res.json();
  }
}

export default AuctionsApi;
