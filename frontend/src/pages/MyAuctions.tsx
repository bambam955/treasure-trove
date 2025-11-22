import { useAuth } from '../contexts/AuthContext';
import AuctionsApi from '../api/auctions';
import { jwtDecode } from 'jwt-decode';
import type { TokenPayload } from '@shared/auth.ts';
import type { AuctionInfo } from '@shared/auctions.ts';
import { useEffect, useState } from 'react';
import { AuctionsList } from '../components/AuctionList';
import { UnauthorizedPage } from './Unauthorized';
import { BaseLayout } from '../layouts/BaseLayout.tsx';

export function MyAuctions() {
  const [token] = useAuth();
  const [auctions, setAuctions] = useState<AuctionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAuctions() {
      if (!token) return;
      let sub: string;
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        sub = decoded.sub;
      } catch (err) {
        console.error('Error decoding token:', err);
        if (!cancelled) {
          setHasError(true);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);

        const allAuctions = await AuctionsApi.getAllAuctions(token);

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
  }, [token]);

  async function handleDelete(id: string) {
    if (!token) return;

    try {
      await AuctionsApi.deleteAuction(id, token);
      setAuctions((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Error deleting auction:', err);
      setHasError(true);
    }
  }

  if (!token) {
    return <UnauthorizedPage />;
  }

  return (
    <BaseLayout>
      <div className='flex-grow-1 d-flex align-items-start justify-content-center mt-4'>
        <div className='w-100' style={{ maxWidth: '900px' }}>
          <h5 className='mb-3'>My Auctions</h5>

          <AuctionsList
            auctions={auctions}
            isLoading={isLoading}
            hasError={hasError}
            emptyMessage="You haven't created any auctions yet."
            showExpectedValue={true}
            showDelete={true}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </BaseLayout>
  );
}
