import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from './User';

// If a user is logged in, then display their username and a Logout button.
// If the user clicks Logout then the JWT token will be cleared.
export function Header({}) {
  const [token, tokenPayload, setToken] = useAuth();
  const navigate = useNavigate();

  // If a user is logged in, then display their username and a Logout button.
  // If the user clicks Logout then the JWT token will be cleared.
  if (token) {
    return (
      <nav
        className='navbar navbar-expand-lg bg-primary p-2'
        data-bs-theme='dark'
      >
        <div className='container-fluid align-items-center'>
          <div className='d-flex align-items-center'>
            <button
              className='btn btn-outline-light btn-sm me-2'
              onClick={() => navigate('/home')}
            >
              Home
            </button>
            <button
              className='btn btn-outline-light btn-sm me-2'
              onClick={() => navigate('/my-auctions')}
            >
              My Auctions
            </button>
            <button
              className='btn btn-outline-light btn-sm me-2'
              onClick={() => navigate('/auctions/add')}
            >
              Add Auction Item
            </button>
          </div>
          <div className='d-flex align-items-center ms-auto'>
            <span className='navbar-text text-light me-3'>
              <User id={tokenPayload!.sub} />
            </span>
            <button
              className='btn btn-outline-light btn-sm'
              onClick={() => setToken(null)}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className='navbar navbar-expand-lg bg-primary' data-bs-theme='white'>
      <div className='container-fluid justify-content-end'>
        <ul className='navbar-nav'>
          <li className='nav-item'>
            <Link className='nav-link text-light' to='/login'>
              Login
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link text-light' to='/signup'>
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
