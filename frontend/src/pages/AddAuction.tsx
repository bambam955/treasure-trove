import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AuctionsApi from '../api/auctions';
import { jwtDecode } from 'jwt-decode';
import type { TokenPayload } from '@shared/auth.ts';

export function AddAuction() {
  const [token] = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minBid, setMinBid] = useState('');
  const [expectedValue, setExpectedValue] = useState('');
  const [showError, setShowError] = useState(false);

  if (!token) {
    return (
      <div className='vh-100 d-flex flex-column p-2'>
        <Header />
        <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
          <div>Please log in to use the Treasure Trove platform.</div>
        </div>
      </div>
    );
  }

  const isFormValid =
    title.trim() !== '' &&
    description.trim() !== '' &&
    endDate !== '' &&
    minBid.trim() !== '' &&
    expectedValue.trim() !== '';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setShowError(true);
      return;
    }

    setShowError(false);

    try {
      const { sub } = jwtDecode<TokenPayload>(token);

      await AuctionsApi.createAuction(
        {
          title: title.trim(),
          description: description.trim(),
          sellerId: sub,
          minimumBid: Number(minBid),
          endDate: new Date(endDate),
          expectedValue: Number(expectedValue),
        },
        token,
      );

      //clear form after submit
      setTitle('');
      setDescription('');
      setEndDate('');
      setMinBid('');
      setExpectedValue('');

      // go to MyAuctions page after successful creation
      navigate('/my-auctions');
    } catch (error) {
      console.error('Error creating auction:', error);
      setShowError(true);
    }
  };

  return (
    <div className='vh-100 d-flex flex-column p-2'>
      <Header showAddAuctionButton={false} />
      <div className='flex-grow-1 d-flex align-items-start justify-content-center mt-4'>
        <div className='card w-100' style={{ maxWidth: '600px' }}>
          <div className='card-body'>
            <h5 className='card-title mb-3'>Add Auction Item</h5>

            {showError && !isFormValid && (
              <div className='alert alert-danger py-2'>
                Please fill out all fields before submitting.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className='form-label' htmlFor='title'>
                  Item Name
                </label>
                <input
                  id='title'
                  type='text'
                  className='form-control'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label className='form-label' htmlFor='description'>
                  Item Description
                </label>
                <textarea
                  id='description'
                  className='form-control'
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label className='form-label' htmlFor='endDate'>
                  End Date for Auction
                </label>
                <input
                  id='endDate'
                  type='date'
                  className='form-control'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label className='form-label' htmlFor='minBid'>
                  Minimum Auction Bid
                </label>
                <input
                  id='minBid'
                  type='number'
                  min='0'
                  step='0.01'
                  className='form-control'
                  value={minBid}
                  onChange={(e) => setMinBid(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label className='form-label' htmlFor='expectedValue'>
                  Expected Item Value
                </label>
                <input
                  id='expectedValue'
                  type='number'
                  min='0'
                  step='0.01'
                  className='form-control'
                  value={expectedValue}
                  onChange={(e) => setExpectedValue(e.target.value)}
                  required
                />
              </div>

              <button
                type='submit'
                className='btn btn-primary'
                disabled={!isFormValid}
              >
                Submit Auction Item
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
