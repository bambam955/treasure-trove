import type { AuctionInfo } from '@shared/auctions.ts';

interface AuctionsListProps {
  auctions: AuctionInfo[];
  isLoading: boolean;
  hasError: boolean;
  emptyMessage: string;
  showExpectedValue?: boolean;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
}

export function AuctionsList({
  auctions,
  isLoading,
  hasError,
  emptyMessage,
  showExpectedValue = false,
  showDelete = false,
  onDelete,
}: AuctionsListProps) {
  if (isLoading) {
    return (
      <div className='d-flex justify-content-center'>
        <div>Loading auctions...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className='alert alert-danger'>
        There was a problem loading or updating auctions. Please try again.
      </div>
    );
  }

  if (!hasError && auctions.length === 0) {
    return <div className='alert alert-info'>{emptyMessage}</div>;
  }

  return (
    <div className='row g-3'>
      {auctions.map((auction) => (
        <div className='col-12 col-md-6' key={auction.id}>
          <div className='card h-100'>
            <div className='card-body d-flex flex-column'>
              <h5 className='card-title'>{auction.title}</h5>
              <p className='card-text flex-grow-1'>{auction.description}</p>

              <p className='card-text mb-1'>
                <strong>Minimum Bid:</strong> {auction.minimumBid.toFixed()}{' '}
                Tokens
              </p>

              {showExpectedValue && auction.expectedValue !== undefined && (
                <p className='card-text mb-1'>
                  <strong>Expected Value:</strong>{' '}
                  {auction.expectedValue.toFixed()} Tokens
                </p>
              )}

              <p className='card-text mb-2'>
                <strong>Ends:</strong>{' '}
                {new Date(auction.endDate).toLocaleString()}
              </p>

              {showDelete && onDelete && (
                <button
                  type='button'
                  className='btn btn-sm btn-outline-danger align-self-end mt-2'
                  onClick={() => onDelete(auction.id)}
                >
                  Delete Auction
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
