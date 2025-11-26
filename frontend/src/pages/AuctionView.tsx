import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { AuctionInfo } from '@shared/auctions.ts';
import AuctionsApi from '../api/auctions.ts';
import { useParams } from 'react-router-dom';
import { UnauthorizedPage } from './Unauthorized.tsx';
import { BaseLayout } from '../layouts/BaseLayout.tsx';
import { Countdown } from '../components/Countdown.tsx';
import { RegularUserInfo } from '@shared/users.ts';
import UserApi from '../api/users.ts';
import { BidInfo, CreateBidInfo } from '@shared/bids.ts';

export function AuctionView() {
  const [token] = useAuth();
  const queryClient = useQueryClient();
  const [bidAmount, setBidAmount] = useState<number | ''>(''); // input state
  const [bidError, setBidError] = useState<string | null>(null);

  const auctionId = useParams()['id'];

  // This is the query used to fetch the basic information about the auction.
  // It does not include bidding history.
  const auctionInfoQuery = useQuery<AuctionInfo>({
    // Fetched info will be cached by auction ID.
    queryKey: ['auctions', auctionId],
    // Fetch the auction info via the API.
    queryFn: () => AuctionsApi.getAuctionInfo(auctionId!, token!),
  });
  const auctionInfo: AuctionInfo | undefined = auctionInfoQuery.data;

  // This query is used to fetch information about the seller.
  // Note that the query only works if the auction info comes back OK,
  // which is why we set the "enabled" property.
  const sellerInfoQuery = useQuery<RegularUserInfo>({
    queryKey: ['users', auctionInfo?.sellerId],
    queryFn: () => UserApi.getUserInfo(auctionInfo!.sellerId, token!),
    enabled: !!auctionInfo,
  });
  const sellerInfo: RegularUserInfo | undefined = sellerInfoQuery.data;

  let currentUserId: string | null = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserId = payload.sub as string;
    } catch (err) {
      console.error('Failed to decode token in AuctionView:', err);
      currentUserId = null;
    }
  }

  const bidsQuery = useQuery<BidInfo[]>({
    queryKey: ['auctions', auctionId, 'bids'],
    queryFn: () => AuctionsApi.getAuctionBids(auctionId!, token!),
    enabled: !!auctionId && !!token,
  });

  const bids = bidsQuery.data ?? [];

  const lastBid: BidInfo | undefined =
    bids.length > 0
      ? bids.reduce(
          (latest, b) =>
            new Date(b.createdDate).getTime() >
            new Date(latest.createdDate).getTime()
              ? b
              : latest,
          bids[0],
        )
      : undefined;

  const userIsLastBidder =
    !!currentUserId && !!lastBid && lastBid.userId === currentUserId;

  const highestBidderQuery = useQuery<RegularUserInfo>({
    queryKey: ['users', lastBid?.userId],
    queryFn: () => UserApi.getUserInfo(lastBid!.userId, token!),
    enabled: !!lastBid && !!token,
  });
  const highestBidder = highestBidderQuery.data;

  const userIsSeller =
    !!currentUserId && !!auctionInfo && currentUserId === auctionInfo.sellerId;
  const auctionEnded =
    auctionInfo && new Date(auctionInfo.endDate).getTime() <= Date.now();

  const baseMin = auctionInfo?.minimumBid ?? 0;
  const clientMinBid =
    lastBid && lastBid.amount >= baseMin ? lastBid.amount + 1 : baseMin;

  const placeBidMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!token || !auctionId) {
        throw new Error('Not authenticated or missing auction id');
      }

      const payload: CreateBidInfo = {
        auctionId,
        amount,
        userId: currentUserId!, // shared type usually includes this
      };

      return AuctionsApi.makeBid(auctionId, payload, token);
    },
    onSuccess: () => {
      setBidError(null);
      setBidAmount('');
      // Refresh bids & auction info so UI updates
      queryClient.invalidateQueries({
        queryKey: ['auctions', auctionId, 'bids'],
      });
      queryClient.invalidateQueries({ queryKey: ['auctions', auctionId] });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : 'Failed to place bid. Try again.';
      setBidError(msg);
    },
  });

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount === '') return;

    // simple client-side validation
    if (bidAmount < clientMinBid) {
      setBidError(
        `Bid must be at least ${clientMinBid} tokens (current required minimum).`,
      );
      return;
    }

    setBidError(null);
    placeBidMutation.mutate(bidAmount);
  };

  // If the user goes to this page without being logged in then show an error message.
  if (!token) {
    return <UnauthorizedPage />;
  }

  // Show basic error UI if a query fails.
  if (!auctionInfo) return <BaseLayout>could not find auction.</BaseLayout>;
  if (!sellerInfo) return <BaseLayout>Could not find user.</BaseLayout>;

  return (
    <BaseLayout>
      <div className='container mt-4 mx-6'>
        <div className='card p-2'>
          <div className='card-body'>
            <div className='mb-4'>
              <h1 className='card-title'>{auctionInfo.title}</h1>
            </div>
            <em className='card-text lead'>{auctionInfo.description}</em>
            <hr />
            <div className='col mb-3'>
              <div className='py-2'>
                Posted by
                <strong className='mx-2'>{sellerInfo.username}</strong>
                on
                <strong className='mx-2'>
                  {new Date(auctionInfo.createdDate).toLocaleDateString()}
                </strong>
              </div>
              <div className='col-md-4 '>
                <Countdown endDate={auctionInfo.endDate} />
              </div>
            </div>

            <hr />
            <div className='mt-3'>
              <h4>Bidding</h4>

              <p className='mb-1'>
                <strong>Minimum bid:</strong> {auctionInfo.minimumBid} tokens
              </p>

              {lastBid ? (
                <p className='mb-1'>
                  <strong>Current highest bid:</strong> {lastBid.amount} tokens
                  {highestBidder && (
                    <>
                      {' '}
                      by <strong>{highestBidder.username}</strong>
                    </>
                  )}
                </p>
              ) : (
                <p className='mb-1'>
                  <strong>No bids yet.</strong> Be the first!
                </p>
              )}

              {auctionEnded && (
                <p className='text-danger mb-2'>
                  This auction has ended. No further bids can be placed.
                </p>
              )}

              <form
                className='row g-2 align-items-center mt-2'
                onSubmit={handlePlaceBid}
              >
                <div className='col-auto'>
                  <label htmlFor='bidAmount' className='col-form-label'>
                    Your bid:
                  </label>
                </div>
                <div className='col-auto'>
                  <input
                    id='bidAmount'
                    type='number'
                    className='form-control'
                    min={clientMinBid}
                    value={bidAmount}
                    onChange={(e) =>
                      setBidAmount(
                        e.target.value === '' ? '' : Number(e.target.value),
                      )
                    }
                    disabled={
                      placeBidMutation.isPending ||
                      userIsLastBidder ||
                      auctionEnded ||
                      userIsSeller
                    }
                  />
                </div>
                <div className='col-auto'>
                  <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={
                      bidAmount === '' ||
                      placeBidMutation.isPending ||
                      userIsLastBidder ||
                      auctionEnded ||
                      userIsSeller
                    }
                  >
                    {placeBidMutation.isPending ? 'Placing bid...' : 'Make bid'}
                  </button>
                </div>
              </form>

              {userIsLastBidder && !auctionEnded && (
                <div className='text-danger mt-2'>
                  You already placed the last bid on this auction.
                </div>
              )}
              {userIsSeller && !auctionEnded && (
                <div className='text-danger mt-2'>
                  You are the seller of this auction and cannot bid on it.
                </div>
              )}

              {bidError && <div className='text-danger mt-2'>{bidError}</div>}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
