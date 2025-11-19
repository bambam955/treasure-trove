import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BaseLayout } from '../layouts/BaseLayout.tsx';
import { UnauthorizedPage } from './Unauthorized.tsx';

export function Home() {
  const [token] = useAuth();

  if (!token) {
    return <UnauthorizedPage />;
  }

  // Show some very basic content just to verify that the login is working.
  // This will be revised in the future.
  return (
    <BaseLayout>
      <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
        <div>Content coming soon!</div>
        <Link
          className='nav-link text-light'
          to='/auctions/6917c48dbaada0489c34be78'
        >
          My Auction
        </Link>
      </div>
    </BaseLayout>
  );
}
