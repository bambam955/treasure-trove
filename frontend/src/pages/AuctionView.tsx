import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { AuctionInfo } from '@shared/auctions.ts';
import AuctionsApi from '../api/auctions.ts';
import { useParams } from 'react-router-dom';
import { UnauthorizedPage } from './Unauthorized.tsx';
import { BaseLayout } from '../layouts/BaseLayout.tsx';
import { Countdown } from '../components/Countdown.tsx';
import { FullUserInfo, RegularUserInfo } from '@shared/users.ts';
import UserApi from '../api/users.ts';
import { BidHistory } from '../components/BidHistory.tsx';

export function AuctionView() {
  const [token, tokenPayload] = useAuth();
  const auctionId = useParams()['id'];

  const auctionInfoQuery = useQuery<AuctionInfo>({
    queryKey: ['auctions', auctionId],
    queryFn: () => AuctionsApi.getAuctionInfo(auctionId!, token!),
    enabled: !!token,
  });
  const auctionInfo: AuctionInfo | undefined = auctionInfoQuery.data;

  const sellerInfoQuery = useQuery<RegularUserInfo>({
    queryKey: ['users', auctionInfo?.sellerId],
    queryFn: () => UserApi.getUserInfo(auctionInfo!.sellerId, token!),
    enabled: !!token && !!auctionInfo,
  });
  const sellerInfo: RegularUserInfo | undefined = sellerInfoQuery.data;

  const userInfoQuery = useQuery<RegularUserInfo | FullUserInfo>({
    queryKey: ['users', tokenPayload?.sub],
    queryFn: () => UserApi.getUserInfo(tokenPayload!.sub, token!),
    enabled: !!token && !!tokenPayload && !!auctionInfo && !!sellerInfo,
  });
  const userInfo = userInfoQuery.data;

  if (!token || !tokenPayload) {
    return <UnauthorizedPage />;
  }

  if (!auctionInfo || !sellerInfo || !userInfo) {
    return (
      <BaseLayout>
        <div className='alert alert-danger'>
          There was a problem loading the auction. Please try again.
        </div>
      </BaseLayout>
    );
  }

  const isUsersAuction = sellerInfo.id === userInfo.id;

  return (
    <BaseLayout>
      <div className='container mt-4'>
        <div className='card p-4 mx-4'>
          <div className='card-body'>
            <div className='mb-4'>
              <h1 className='card-title'>{auctionInfo.title}</h1>
            </div>
            <em className='card-text lead'>{auctionInfo.description}</em>
            <hr />
            <div className='row justify-content-between pt-2'>
              <div className='col-md-5'>
                <div className='pb-2'>
                  Posted by
                  <strong className='mx-2'>{sellerInfo.username}</strong>
                  on
                  <strong className='mx-2'>
                    {auctionInfo.createdDate.toLocaleDateString()}
                  </strong>
                </div>
                <div className='mt-3'>
                  <Countdown endDate={auctionInfo.endDate} />
                </div>
              </div>
            </div>

            <hr />
            <BidHistory
              auctionInfo={auctionInfo}
              isUsersAuction={isUsersAuction}
            />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
