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
    <form onSubmit={handleSubmit}>
      <Link to='/'>Back to main page</Link>
      <hr />
      <br />
      <div>
        <label htmlFor='login-username'> Username: </label>
        <input
          type='text'
          name='login-username'
          id='login-username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='login-password'> Password: </label>
        <input
          type='text'
          name='login-password'
          id='login-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br />
      <input
        type='submit'
        value={loginMutation.isPending ? 'Logging in...' : 'Login'}
        disabled={!username || !password || loginMutation.isPending}
      />
    </form>
  );
}
