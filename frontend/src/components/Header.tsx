import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { User } from './User';

// The backend encodes the user ID in the JWT token.
interface JwtPayload {
  sub: string;
}

export function Header() {
  const [token, setToken] = useAuth();

  // If a user is logged in, then display their username and a Logout button.
  // If the user clicks Logout then the JWT token will be cleared.
  if (token) {
    const { sub } = jwtDecode<JwtPayload>(token);
    return (
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid justify-content-end align-items-center">
          <span className="navbar-text text-light me-3">
            Logged in as <User id={sub} />
          </span>
          <button
        className="btn btn-outline-light btn-sm"
        onClick={() => setToken(null)}
      >
        Logout
      </button>
    </div>
  </nav>
);
}

  // Otherwise, show signup and login buttons.
  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="white">
      <div className="container-fluid justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link text-light" to="/login">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-light" to="/signup">
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
