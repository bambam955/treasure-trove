import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuctionInfo } from '@shared/auctions.ts';
import AuctionsApi from '../api/auctions.ts';
import { useParams } from 'react-router-dom';
import { UnauthorizedPage } from './Unauthorized.tsx';
import { BaseLayout } from '../layouts/BaseLayout.tsx';
import { Countdown } from '../components/Countdown.tsx';
import { RegularUserInfo } from '@shared/users.ts';
import UserApi from '../api/users.ts';

export function AuctionView() {
  const [token] = useAuth();
  const [showModal, setShowModal] = useState(false);

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

  // If the user goes to this page without being logged in then show an error message.
  if (!token) {
    return <UnauthorizedPage />;
  }

  // Show basic error UI if a query fails.
  if (!auctionInfo) return <BaseLayout>could not find auction.</BaseLayout>;
  if (!sellerInfo) return <BaseLayout>Could not find user.</BaseLayout>;

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
              <div className='col-md-6'>
                <div className='w-100 me-6'>
                  <button
                    className='btn btn-success btn-lg w-100 text-uppercase'
                    onClick={() => setShowModal(true)}
                  >
                    <strong>Make Bid</strong>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MakeBidModal
        show={showModal}
        onHide={() => setShowModal(false)}
        auctionInfo={auctionInfo}
      />
    </BaseLayout>
  );
}

interface MakeBidModalProps {
  show: boolean;
  onHide: () => void;
  auctionInfo: AuctionInfo;
}

function MakeBidModal({ show, onHide, auctionInfo }: MakeBidModalProps) {
  const [bidAmount, setBidAmount] = useState('');
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
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='bidModalLabel'>
                Place Your Bid
              </h5>
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
                  ${auctionInfo.minimumBid.toFixed(2)}
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
                  min={auctionInfo.minimumBid}
                  step='0.01'
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
              <button type='button' className='btn btn-success'>
                Submit Bid
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal backdrop */}
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
