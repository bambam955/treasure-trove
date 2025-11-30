import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuctionInfo } from '@shared/auctions.ts';
import AuctionsApi from '../api/auctions.ts';
import { useParams } from 'react-router-dom';
import { UnauthorizedPage } from './Unauthorized.tsx';
import { BaseLayout } from '../layouts/BaseLayout.tsx';
import { Countdown } from '../components/Countdown.tsx';
import { FullUserInfo, RegularUserInfo } from '@shared/users.ts';
import UserApi from '../api/users.ts';
import { BidInfo, CreateBidInfo, findHighestBid } from '@shared/bids.ts';

export function AuctionView() {
  const [token, tokenPayload] = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [expired, setExpired] = useState(false);
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

  // This query is used to fetch the current bidding history.
  const bidHistoryQuery = useQuery<BidInfo[]>({
    queryKey: ['auctions', auctionId, 'bids'],
    queryFn: () => AuctionsApi.getAuctionBids(auctionId!, token!),
    enabled: !!auctionInfo && !!sellerInfo,
  });
  const bidHistory: BidInfo[] | undefined = bidHistoryQuery.data;

  const userInfoQuery = useQuery<RegularUserInfo | FullUserInfo>({
    queryKey: ['users', tokenPayload!.sub],
    queryFn: () => UserApi.getUserInfo(tokenPayload!.sub, token!),
    enabled: !!auctionInfo && !!sellerInfo && !!bidHistory,
  });
  const userInfo = userInfoQuery.data;

  // If the user goes to this page without being logged in then show an error message.
  if (!token) {
    return <UnauthorizedPage />;
  }

  // Show basic error UI if a query fails.
  if (!auctionInfo || !sellerInfo || !bidHistory || !userInfo) {
    return (
      <BaseLayout>
        <div className='alert alert-danger'>
          There was a problem loading the auction. Please try again.
        </div>
      </BaseLayout>
    );
  }

  // If no bids have been made then this just gets set to 0.
  // The minimum bid for the auction will be saved as minNextBid.
  const highestBid =
    bidHistory.length > 0 ? findHighestBid(bidHistory) : undefined;
  const currHighestBid = highestBid ? highestBid.amount : 0;
  const minNextBid = Math.max(currHighestBid + 1, auctionInfo.minimumBid);

  // We do not want users to be able to make bids on their own auctions.
  const isUsersAuction = sellerInfo.id === userInfo.id;
  const endTimestamp = new Date(auctionInfo.endDate).getTime();
  const isExpired =
    expired || endTimestamp <= Date.now() || auctionInfo.status === 'closed';

  const userIsLastBidder = !!highestBid && highestBid.userId === userInfo.id;
  const biddingDisabled = isExpired || isUsersAuction || userIsLastBidder;

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
                  <Countdown
                    endDate={auctionInfo.endDate}
                    onExpire={() => setExpired(true)}
                  />
                  {isExpired && (
                    <div className='mt-2 badge bg-danger text-light fs-6'>
                      Auction Closed
                    </div>
                  )}
                </div>
              </div>
              <div className='col-md-6'>
                {!isUsersAuction && (
                  <div className='w-100'>
                    {!biddingDisabled ? (
                      <button
                        className='btn btn-success btn-lg w-100 text-uppercase'
                        onClick={() => setShowModal(true)}
                        disabled={
                          biddingDisabled || userInfo.tokens! <= minNextBid
                        }
                      >
                        <strong>Make Bid</strong>
                      </button>
                    ) : (
                      <button
                        className='btn btn-secondary btn-lg w-100 text-uppercase'
                        disabled
                      >
                        <strong>Auction Closed</strong>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <hr />
            <div className='mt-3'>
              <h4>Bidding</h4>

              <p className='mb-1'>
                <strong>Starting minimum bid:</strong> {auctionInfo.minimumBid}{' '}
                tokens
              </p>

              <p className='mb-1'>
                <strong>Current highest bid:</strong>{' '}
                {bidHistory.length > 0
                  ? currHighestBid + ' tokens'
                  : 'No bids yet'}
              </p>

              <p className='mb-1'>
                <strong>Minimum next bid:</strong> {minNextBid} tokens
              </p>
            </div>
          </div>
        </div>
      </div>

      <MakeBidModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          bidHistoryQuery.refetch();
        }}
        minNextBid={minNextBid}
        auctionInfo={auctionInfo}
      />
    </BaseLayout>
  );
}

interface MakeBidModalProps {
  show: boolean;
  onHide: () => void;
  minNextBid: number;
  auctionInfo: AuctionInfo;
}

function MakeBidModal({
  show,
  onHide,
  minNextBid,
  auctionInfo,
}: MakeBidModalProps) {
  const [token, tokenPayload] = useAuth();
  const [bidAmount, setBidAmount] = useState('');

  // Used to disable the button until the bid amount is valid.
  const isBidValid = bidAmount.trim() !== '' && Number(bidAmount) >= minNextBid;
  const auctionExpired = new Date(auctionInfo.endDate).getTime() <= Date.now();

  // Clear bid amount when modal opens.
  // Without this, you can enter a value, close the modal,
  // then open it again, and the previous value will still be there.
  useEffect(() => {
    if (show) {
      setBidAmount('');
    }
  }, [show]);

  const handleSubmit = async () => {
    if (bidAmount.trim() === '') {
      return;
    }

    const bid: CreateBidInfo = {
      userId: tokenPayload!.sub,
      amount: Number(bidAmount),
      auctionId: auctionInfo.id,
    };

    try {
      await AuctionsApi.makeBid(bid.auctionId, bid, token!);
      onHide();
    } catch (error) {
      // TODO: show errors in UI
      console.error('Bid failed:', error);
    }
  };

  return (
    <>
      <div
        className={`modal fade ${show ? 'show' : ''}`}
        style={{ display: show ? 'block' : 'none' }}
        tabIndex={-1}
        role='dialog'
        aria-labelledby='bidModalLabel'
        aria-hidden={!show}
      >
        <div className='modal-dialog modal-dialog-centered' role='document'>
          <div className='modal-content px-2'>
            <div className='modal-header'>
              <h4 className='modal-title' id='bidModalLabel'>
                Place Your Bid
              </h4>
              <button
                type='button'
                className='btn-close'
                onClick={onHide}
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              <div className='mb-3'>
                <label htmlFor='currentBid' className='form-label'>
                  Current Minimum Bid
                </label>
                <div className='form-control-plaintext'>
                  {minNextBid} tokens
                </div>
              </div>
              <div className='mb-3'>
                <label htmlFor='bidAmount' className='form-label'>
                  Your Bid Amount
                </label>
                <input
                  type='number'
                  className='form-control'
                  id='bidAmount'
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder='Enter your bid amount'
                  min={minNextBid}
                  step='1'
                />
              </div>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={onHide}
              >
                Cancel
              </button>
              <button
                type='button'
                className='btn btn-success'
                onClick={handleSubmit}
                disabled={!isBidValid || auctionExpired}
              >
                <strong>Submit Bid 🎉</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
      {show && (
        <div
          className='modal-backdrop fade show'
          onClick={onHide}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onHide();
            }
          }}
          role='button'
          tabIndex={0}
          aria-label='Close modal'
        ></div>
      )}
    </>
  );
}
