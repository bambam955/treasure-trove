import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
//import { useQuery } from '@tanstack/react-query';
import AuctionsApi from '../api/auctions';
import { jwtDecode } from 'jwt-decode';
import type { TokenPayload } from '@shared/auth.ts';
import type { AuctionInfo } from '@shared/auctions.ts';
import { useEffect, useState } from 'react';

export function MyAuctions() {
  const [token] = useAuth();
  const [auctions, setAuctions] = useState<AuctionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!token) {
    return (
      <div className='vh-100 d-flex flex-column p-2'>
        <Header />
        <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
          <div>Please log in to use the Treasure Trove platform.</div>
        </div>
      </div>
    );
  }

  const { sub } = jwtDecode<TokenPayload>(token);

  useEffect(() => {
    let cancelled = false;

    async function loadAuctions() {
      try {
        setIsLoading(true);
        setHasError(false);

        const allAuctions = await AuctionsApi.getAllAuctions(token as string);

        if (!cancelled) {
          const mine = allAuctions.filter(
            (auction) => auction.sellerId === sub,
          );
          setAuctions(mine);
        }
      } catch (err) {
        console.error('Error loading auctions:', err);
        if (!cancelled) {
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAuctions();

    return () => {
      cancelled = true;
    };
  }, [token, sub]);

  async function handleDelete(id: string) {
    try {
      await AuctionsApi.deleteAuction(id, token as string);
      // Remove from UI after successful delete
      setAuctions((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Error deleting auction:', err);
      setHasError(true);
    }
  }

  return (
    <div className='vh-100 d-flex flex-column p-2'>
      <Header showMyAuctionButton={false} />
      <div className='flex-grow-1 d-flex align-items-start justify-content-center mt-4'>
        <div className='w-100' style={{ maxWidth: '900px' }}>
          <h5 className='mb-3'>My Auctions</h5>

          {isLoading && (
            <div className='d-flex justify-content-center'>
              <div>Loading your auctions...</div>
            </div>
          )}

          {hasError && !isLoading && (
            <div className='alert alert-danger'>
              There was a problem loading or updating your auctions. Please try
              again.
            </div>
          )}

          {!isLoading && !hasError && auctions.length === 0 && (
            <div className='alert alert-info'>
              You haven&apos;t created any auctions yet.
            </div>
          )}

          {!isLoading && !hasError && auctions.length > 0 && (
            <div className='row g-3'>
              {auctions.map((auction) => (
                <div className='col-12 col-md-6' key={auction.id}>
                  <div className='card h-100'>
                    <div className='card-body d-flex flex-column'>
                      <h5 className='card-title'>{auction.title}</h5>
                      <p className='card-text flex-grow-1'>
                        {auction.description}
                      </p>
                      <p className='card-text mb-1'>
                        <strong>Minimum Bid:</strong>{' '}
                        {auction.minimumBid.toFixed()} Tokens
                      </p>
                      {auction.expectedValue !== undefined && (
                        <p className='card-text mb-1'>
                          <strong>Expected Value:</strong>{' '}
                          {auction.expectedValue.toFixed()} Tokens
                        </p>
                      )}
                      <p className='card-text mb-2'>
                        <strong>Ends:</strong>{' '}
                        {new Date(auction.endDate).toLocaleString()}
                      </p>

                      <button
                        type='button'
                        className='btn btn-sm btn-outline-danger align-self-end mt-2'
                        onClick={() => handleDelete(auction.id)}
                      >
                        Delete Auction
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
