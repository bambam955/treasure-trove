import type { AuctionInfo } from '@shared/auctions.ts';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

interface AuctionsListProps {
  auctions: AuctionInfo[];
  isLoading: boolean;
  hasError: boolean;
  emptyMessage: string;
  showExpectedValue?: boolean;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
}

type AuctionForList = AuctionInfo & {
  createdDate?: string | Date;
  lastBidDate?: string | Date;
};

export function AuctionsList({
  auctions,
  isLoading,
  hasError,
  emptyMessage,
  showExpectedValue = false,
  showDelete = false,
  onDelete,
}: AuctionsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'created' | 'lastBid'>('created');
  const filteredAuctions = useMemo(() => {
    const list = auctions as AuctionForList[];

    let result = list;

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((auction) =>
        auction.title.toLowerCase().includes(term),
      );
    }

    const sorted = [...result].sort((a, b) => {
      if (sortBy === 'created') {
        const aCreated = a.createdDate ? new Date(a.createdDate).getTime() : 0;
        const bCreated = b.createdDate ? new Date(b.createdDate).getTime() : 0;
        return bCreated - aCreated; // newest first
      }
      const aLast = a.lastBidDate ? new Date(a.lastBidDate).getTime() : 0;
      const bLast = b.lastBidDate ? new Date(b.lastBidDate).getTime() : 0;
      return bLast - aLast; // most recent bid first; no bids go last
    });

    return sorted;
  }, [auctions, searchTerm, sortBy]);

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
    <div>
      <div className='d-flex flex-column flex-md-row align-items-md-center gap-2 mb-3'>
        <input
          type='text'
          className='form-control'
          placeholder='Search by title...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className='form-select'
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'created' | 'lastBid')}
        >
          <option value='created'>Created date (newest first)</option>
          <option value='lastBid'>Last bid date (most recent first)</option>
        </select>
      </div>

      {filteredAuctions.length === 0 ? (
        <div className='alert alert-warning'>
          No auctions match your current search.
        </div>
      ) : (
        <div className='row g-3'>
          {filteredAuctions.map((auction) => (
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

                  <div className='container'>
                    <div className='row justify-content-between mt-2'>
                      <Link
                        className='btn btn-md btn-primary col-md-4'
                        to={'/auctions/' + auction.id}
                      >
                        View Auction
                      </Link>
                      {showDelete && onDelete && (
                        <button
                          type='button'
                          className='btn btn-md btn-outline-danger col-md-3'
                          onClick={() => onDelete(auction.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
