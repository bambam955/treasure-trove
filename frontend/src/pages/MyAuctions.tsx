import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export function MyAuctions() {
  const [token] = useAuth();

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

  return (
    <div className='vh-100 d-flex flex-column p-2'>
      <Header showMyAuctionButton={false} />
      <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
        <div>Content coming soon!</div>
      </div>
    </div>
  );
}
