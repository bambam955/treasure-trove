import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { AuctionInfo } from '@shared/auctions.ts';
import AuctionsApi from '../api/auctions.ts';
import { useParams } from 'react-router-dom';
import { UnauthorizedPage } from './Unauthorized.tsx';
import { BaseLayout } from '../layouts/BaseLayout.tsx';
import { RegularUserInfo } from '@shared/users.ts';
import UserApi from '../api/users.ts';

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
    queryFn: () => AuctionsApi.getAuctionInfo(auctionId!, token),
  });
  const auctionInfo: AuctionInfo | undefined = auctionInfoQuery.data;

  // This query is used to fetch information about the seller.
  // Note that the query only works if the auction info comes back OK,
  // which is why we set the "enabled" property.
  const sellerInfoQuery = useQuery<RegularUserInfo>({
    queryKey: ['users', auctionInfo?.sellerId],
    queryFn: () => UserApi.getUserInfo(auctionInfo!.sellerId, token),
    enabled: !!auctionInfo,
  });
  const sellerInfo: RegularUserInfo | undefined = sellerInfoQuery.data;

  // Show basic error UI if a query fails.
  if (!auctionInfo) return <BaseLayout>could not find auction.</BaseLayout>;
  if (!sellerInfo) return <BaseLayout>Could not find user.</BaseLayout>;

  return (
    <BaseLayout>
      <div className='container mt-4'>
        <div className='card'>
          <div className='card-body'>
            <h1 className='card-title'>{auctionInfo.title}</h1>
            <em className='card-text lead'>{auctionInfo.description}</em>
            <hr />
            <div className='row'>
              <div className='col-md-6'>
                <p>
                  <strong>Seller:</strong> {sellerInfo.username}
                </p>
                <p>
                  <strong>Created:</strong>{' '}
                  {auctionInfo.createdDate.toLocaleDateString()}
                </p>
              </div>
              <div className='col-md-6'>
                <p>
                  <strong>Minimum Bid:</strong> {auctionInfo.minimumBid} tokens
                </p>
                <p>
                  <strong>Ends:</strong>{' '}
                  {auctionInfo.endDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
