import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';

export function Home() {
  const [token] = useAuth();

  // If the user goes to this page without being logged in then show an error message.
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

  // Show some very basic content just to verify that the login is working.
  // This will be revised in the future.
  return (
    <div className='vh-100 d-flex flex-column p-2'>
      <Header />
      <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
        <div>Content coming soon!</div>
      </div>
    </div>
  );
}
