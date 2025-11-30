import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { BaseLayout } from '../layouts/BaseLayout';
import UserApi from '../api/users';
import AuctionsApi from '../api/auctions';
import { UnauthorizedPage } from './Unauthorized';
import { Link } from 'react-router-dom';
import type { AuctionInfo } from '@shared/auctions.ts';

export function PurchasedItems() {
  const [token, tokenPayload] = useAuth();

  if (!token) {
    return <UnauthorizedPage />;
  }

  const userId = tokenPayload!.sub;

  // Load purchased auction IDs
  const purchasedIdsQuery = useQuery<string[]>({
    queryKey: ['purchased', userId],
    queryFn: () => UserApi.getPurchasedAuctions(userId, token),
  });

  // Load auction info for each purchased auction
  const purchasedAuctionsQuery = useQuery<AuctionInfo[]>({
    queryKey: ['purchasedAuctions', purchasedIdsQuery.data],
    enabled: !!purchasedIdsQuery.data,
    queryFn: async () => {
      const ids = purchasedIdsQuery.data!;
      const results: AuctionInfo[] = [];

      for (const id of ids) {
        try {
          const a = await AuctionsApi.getAuctionInfo(id, token);
          results.push(a);
        } catch (err) {
          console.error('Failed to load purchased auction:', id, err);
        }
      }
      return results;
    },
  });

  if (purchasedIdsQuery.isLoading || purchasedAuctionsQuery.isLoading) {
    return (
      <BaseLayout>
        <div className='mt-3 text-center'>Loading purchased items...</div>
      </BaseLayout>
    );
  }

  const purchasedAuctions = purchasedAuctionsQuery.data ?? [];

  if (purchasedAuctions.length === 0) {
    return (
      <BaseLayout>
        <div className='mt-4 alert alert-info'>
          You have not purchased any items yet.
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className='flex-grow-1 d-flex align-items-start justify-content-center mt-4'>
        <div className='w-100' style={{ maxWidth: '900px' }}>
          <h5 className='mb-3'>Purchased Items</h5>

          <div className='row g-3'>
            {purchasedAuctions.map((auction) => {
              const isBuyer = auction.buyerId === userId;
              const finalAmount = auction.finalBidAmount ?? 0;
              const expected = auction.expectedValue ?? 0;
              const overpaid = finalAmount > expected;
              const pointsChange = overpaid ? -1 : +1;

              const feedback = overpaid
                ? 'You overpaid on this item.'
                : 'Great bidding — you got a fair deal!';

              return (
                <div className='col-12' key={auction.id}>
                  <div className='card'>
                    <div className='card-body'>
                      <h5 className='card-title'>{auction.title}</h5>
                      <p className='card-text'>{auction.description}</p>

                      <p className='card-text'>
                        <strong>Final Bid:</strong> {auction.finalBidAmount}{' '}
                        Tokens
                      </p>

                      {isBuyer && (
                        <p className='card-text'>
                          <strong>Expected Value:</strong>{' '}
                          {auction.expectedValue} Tokens
                        </p>
                      )}

                      <p className='card-text'>
                        <strong>Feedback:</strong> {feedback}
                      </p>

                      <p className='card-text'>
                        <strong>Points Earned:</strong>{' '}
                        <span
                          className={
                            pointsChange > 0 ? 'text-success' : 'text-danger'
                          }
                        >
                          {pointsChange > 0 ? '+1' : '-1'}
                        </span>
                      </p>

                      <p className='card-text'>
                        <strong>Purchased On:</strong>{' '}
                        {new Date(auction.createdDate).toLocaleString()}
                      </p>

                      <Link
                        className='btn btn-primary mt-2'
                        to={`/auctions/${auction.id}`}
                      >
                        View Auction
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
