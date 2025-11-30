import type { AuctionInfo } from '@shared/auctions.ts';
import { Link } from 'react-router-dom';
import { Countdown } from '../components/Countdown.tsx';
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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const filteredAuctions = useMemo(() => {
    let result = auctions;

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
        return sortOrder === 'asc'
          ? aCreated - bCreated // oldest first
          : bCreated - aCreated; // newest first
      }

      const aHasLast = !!a.lastBidDate;
      const bHasLast = !!b.lastBidDate;

      if (aHasLast && !bHasLast) return -1;
      if (!aHasLast && bHasLast) return 1;
      if (!aHasLast && !bHasLast) return 0;

      const aLast = new Date(a.lastBidDate as Date).getTime();
      const bLast = new Date(b.lastBidDate as Date).getTime();
      return sortOrder === 'asc'
        ? aLast - bLast // oldest bid first
        : bLast - aLast; // most recent bid first
    });

    return sorted;
  }, [auctions, searchTerm, sortBy, sortOrder]);

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

        <div className='d-flex gap-2'>
          <select
            className='form-select'
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'created' | 'lastBid')}
          >
            <option value='created'>Created date</option>
            <option value='lastBid'>Last bid date</option>
          </select>

          <select
            className='form-select'
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value='desc'>Newest / Most recent first</option>
            <option value='asc'>Oldest / Least recent first</option>
          </select>
        </div>
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

                  <div className='card-text mb-2'>
                    <strong>Time Left:</strong>{' '}
                    <Countdown endDate={auction.endDate} />
                    {new Date(auction.endDate).toLocaleString()}
                  </div>

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
