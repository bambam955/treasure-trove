import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import AuctionsApi from '../api/auctions';
import type { AuctionInfo } from '@shared/auctions.ts';
import { AuctionsList } from '../components/AuctionList';
import { UnauthorizedPage } from './Unauthorized.tsx';
import { BaseLayout } from '../layouts/BaseLayout.tsx';

export function Home() {
  const [token, tokenPayload] = useAuth();
  const [auctions, setAuctions] = useState<AuctionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!token || !tokenPayload) return; // No need to load if not logged in
    let cancelled = false;

    async function loadAuctions() {
      try {
        const sub = tokenPayload!.sub;
        setIsLoading(true);
        setHasError(false);

        const allAuctions = await AuctionsApi.getAllAuctions(token!);

        if (!cancelled) {
          // Show only other users' auctions on the Home page
          const others = allAuctions.filter(
            (auction) => auction.sellerId !== sub,
          );
          setAuctions(others);
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
  }, [token]);

  if (!token) {
    return <UnauthorizedPage />;
  }

  // Show some very basic content just to verify that the login is working.
  // This will be revised in the future.
  return (
    <BaseLayout>
      <div className='flex-grow-1 d-flex align-items-start justify-content-center mt-4'>
        <div className='w-100' style={{ maxWidth: '900px' }}>
          <h5 className='mb-3'>Available Auctions</h5>

          <AuctionsList
            auctions={auctions}
            isLoading={isLoading}
            hasError={hasError}
            emptyMessage='There are currently no auctions from other users.'
            showExpectedValue={false}
            showDelete={false}
          />
        </div>
      </div>
    </BaseLayout>
  );
}
