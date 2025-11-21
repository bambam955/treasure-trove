import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { useEffect, useState } from 'react';
import AuctionsApi from '../api/auctions';
import { jwtDecode } from 'jwt-decode';
import type { TokenPayload } from '@shared/auth.ts';
import type { AuctionInfo } from '@shared/auctions.ts';
import { AuctionsList } from '../components/AuctionList';

export function Home() {
  const [token] = useAuth();
  const [auctions, setAuctions] = useState<AuctionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAuctions() {
      if (!token) {
        return;
      }
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

  // If the user goes to this page without being logged in then show an error message.
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

  // Show some very basic content just to verify that the login is working.
  // This will be revised in the future.
  return (
    <div className='vh-100 d-flex flex-column p-2'>
      <Header />
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
    </div>
  );
}
