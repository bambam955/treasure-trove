import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { AuctionInfo } from '@shared/auctions.ts';
import AuctionsApi from '../api/auctions.ts';
import { useParams } from 'react-router-dom';
import { UnauthorizedPage } from './Unauthorized.tsx';
import { BaseLayout } from '../layouts/BaseLayout.tsx';

export function AuctionView() {
  const [token] = useAuth();

  // If the user goes to this page without being logged in then show an error message.
  if (!token) {
    return <UnauthorizedPage />;
  }

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

  return <BaseLayout>{JSON.stringify(auctionInfo)}</BaseLayout>;
}
