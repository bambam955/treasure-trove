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
      <div>
        Logged in as <User id={sub} />
        <br />
        <button onClick={() => setToken(null)}>Logout</button>
      </div>
    );
  }

  // Otherwise, show signup and login buttons.
  return (
    <div>
      <Link to='/login'>Login</Link> | <Link to='/signup'>Sign Up</Link>
    </div>
  );
}
