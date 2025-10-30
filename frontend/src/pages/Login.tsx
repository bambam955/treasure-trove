import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import UserApi, { AuthInfo } from '../api/users';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [, setToken] = useAuth();

  // When a user clicks the "Login" button then we will send an API request
  // to attempt to register the new account.
  const loginMutation = useMutation({
    mutationFn: () => UserApi.login({ username, password }),
    // If the login succeeds, the JWT token from the backend will be contained in the
    // response payload, so we can save it for the user to do other things in the app.
    onSuccess: (data: AuthInfo) => {
      setToken(data.token);
      navigate('/');
    },
    // make it very obvious something went wrong by showing a browser alert.
    onError: () => alert('Failed to log in!'),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-body-tertiary" data-bs-theme="white" >
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded shadow bg-dark text-light"
        style={{ width: '22rem' }}
      >
      <div className="text-center mb-3">
       <Link to="/" className="text-decoration-none text-primary">
          Back to main page
        </Link>
      </div>
      <hr />
      <br />
      <div className="mb-3">
          <label htmlFor="login-username" className="form-label fw-semibold text-pink">
            Username:
          </label>
          <input
            type="text"
            name="login-username"
            id="login-username"
            className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <br />
      <div className="mb-3">
          <label htmlFor="login-password" className="form-label fw-semibold text-pink">
            Password:
          </label>
          <input
            type="text"
            name="login-password"
            id="login-password"
            className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br />
      <input
        type='submit'
        value={loginMutation.isPending ? 'Logging in...' : 'Login'}
        disabled={!username || !password || loginMutation.isPending}
        className="btn btn-primary w-100"
      />
    </form>
    </div>
  );
}
