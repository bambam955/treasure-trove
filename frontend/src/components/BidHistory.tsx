import { useState, useEffect } from 'react';
import { AuctionInfo } from '@shared/auctions.ts';
import { findHighestBid } from '@shared/bids.ts';
import { useBidHistory } from '../hooks/useBidHistory';
import { useAuth } from '../contexts/AuthContext';
import { RegularUserInfo } from '@shared/users.ts';

interface BidHistoryProps {
  auctionInfo: AuctionInfo;
  sellerInfo: RegularUserInfo;
  userInfo: RegularUserInfo;
  onBidPlaced?: () => void;
}

export function BidHistory({
  auctionInfo,
  sellerInfo,
  userInfo,
  onBidPlaced,
}: BidHistoryProps) {
  const [, tokenPayload] = useAuth();
  const { bids, placeBid, isConnected } = useBidHistory(auctionInfo.id);
  const [showModal, setShowModal] = useState(false);
  const [expired, setExpired] = useState(false);

  const endTimestamp = new Date(auctionInfo.endDate).getTime();
  const isExpired =
    expired || endTimestamp <= Date.now() || auctionInfo.status === 'closed';

  useEffect(() => {
    if (isExpired) return;

    const timeUntilExpiry = endTimestamp - Date.now();
    if (timeUntilExpiry > 0) {
      const timer = setTimeout(() => setExpired(true), timeUntilExpiry);
      return () => clearTimeout(timer);
    }
  }, [endTimestamp, isExpired]);

  const highestBid = bids.length > 0 ? findHighestBid(bids) : undefined;
  const currHighestBid = highestBid ? highestBid.amount : 0;
  const minNextBid = Math.max(currHighestBid + 1, auctionInfo.minimumBid);

  const userIsLastBidder =
    !!highestBid && highestBid.userId === tokenPayload?.sub;
  const isUsersAuction = sellerInfo.id == userInfo.id;
  const biddingDisabled =
    isExpired ||
    isUsersAuction ||
    userIsLastBidder ||
    minNextBid > userInfo.tokens;

  const handleBidPlaced = () => {
    setShowModal(false);
    onBidPlaced?.();
  };

  return (
    <div className='bid-history'>
      <div className='d-flex align-items-center mb-3'>
        <h4 className='mb-0'>Bidding</h4>
        {!isExpired &&
          (isConnected ? (
            <span className='badge bg-success ms-2'>Live</span>
          ) : (
            <span className='badge bg-warning ms-2'>Connecting...</span>
          ))}
      </div>

      <p className='mb-1'>
        <strong>Starting minimum bid:</strong> {auctionInfo.minimumBid} tokens
      </p>

      <p className='mb-1'>
        <strong>Current highest bid:</strong>{' '}
        {bids.length > 0 ? currHighestBid + ' tokens' : 'No bids yet'}
      </p>

      <p className='mb-1'>
        <strong>Minimum next bid:</strong> {minNextBid} tokens
      </p>

      {!isUsersAuction && (
        <div className='mt-3'>
          {!isExpired ? (
            <button
              className='btn btn-success btn-lg w-100 text-uppercase'
              onClick={() => setShowModal(true)}
              disabled={biddingDisabled || !isConnected}
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

      {bids.length > 0 && (
        <div className='mt-3'>
          <strong>Bid history:</strong>
          <ul className='list-group mt-2'>
            {bids
              .slice()
              .reverse()
              .map((bid) => (
                <li
                  key={bid.id}
                  className='list-group-item d-flex justify-content-between align-items-center'
                >
                  <div>
                    <strong>{bid.username}</strong>
                    <span className='ms-2'>{bid.amount} tokens</span>
                  </div>
                  <small className='text-muted'>
                    {new Date(bid.createdDate).toLocaleTimeString()}
                  </small>
                </li>
              ))}
          </ul>
        </div>
      )}

      <MakeBidModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onBidPlaced={handleBidPlaced}
        minNextBid={minNextBid}
        auctionInfo={auctionInfo}
        placeBid={placeBid}
      />
    </div>
  );
}

interface MakeBidModalProps {
  show: boolean;
  onHide: () => void;
  onBidPlaced: () => void;
  minNextBid: number;
  auctionInfo: AuctionInfo;
  placeBid: (amount: number) => Promise<{ success: boolean; error?: string }>;
}

function MakeBidModal({
  show,
  onHide,
  onBidPlaced,
  minNextBid,
  auctionInfo,
  placeBid,
}: MakeBidModalProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBidValid = bidAmount.trim() !== '' && Number(bidAmount) >= minNextBid;
  const auctionExpired = new Date(auctionInfo.endDate).getTime() <= Date.now();

  useEffect(() => {
    if (show) {
      setBidAmount('');
      setError(null);
    }
  }, [show]);

  const handleSubmit = async () => {
    if (!isBidValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const result = await placeBid(Number(bidAmount));

    setIsSubmitting(false);

    if (result.success) {
      onBidPlaced();
    } else {
      setError(result.error || 'Failed to place bid');
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
              {error && (
                <div className='alert alert-danger' role='alert'>
                  {error}
                </div>
              )}
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
                disabled={!isBidValid || auctionExpired || isSubmitting}
              >
                <strong>
                  {isSubmitting ? 'Submitting...' : 'Submit Bid 🎉'}
                </strong>
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
