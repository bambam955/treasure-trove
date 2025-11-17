import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { AuctionInfo } from '@shared/auctions.ts';
import AuctionsApi from 'src/api/auctions';

interface AuctionViewProps {
  auctionId: string;
}

export function AuctionView({ auctionId }: AuctionViewProps) {
  const [token] = useAuth();

  // This is the query used to fetch the basic information about the auction.
  // It does not include bidding history.
  const auctionInfoQuery = useQuery<AuctionInfo>({
    // Fetched info will be cached by auction ID.
    queryKey: ['auctions', auctionId],
    // Fetch the auction info via the API.
    queryFn: () => AuctionsApi.getAuctionInfo(auctionId, token!),
  });

  const auctionInfo: AuctionInfo | undefined = auctionInfoQuery.data;

  return (
    <div className='border rounded py-2 px-3 d-flex align-items-center justify-content-between bg-secondary'>
      {JSON.stringify(auctionInfo)}
    </div>
  );
}
