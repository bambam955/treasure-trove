import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import UserApi from '../api/users';

export function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // When a user clicks the "Signup" button then we will send an API request
  // to attempt to register the new account.
  const signupMutation = useMutation({
    mutationFn: () => UserApi.signup({ username, password }),
    // If the signup succeeded then take the user to the login page so that they can
    // log in to the platform.
    onSuccess: () => navigate('/login'),
    // make it very obvious something went wrong by showing a browser alert.
    onError: () => alert('Failed to sign up!'),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Link to='/'>Back to main page</Link>
      <hr />
      <br />
      <div>
        <label htmlFor='create-username'> Username: </label>
        <input
          type='text'
          name='create-username'
          id='create-username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-password'> Password: </label>
        <input
          type='text'
          name='create-password'
          id='create-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br />
      <input
        type='submit'
        value={signupMutation.isPending ? 'Signing up...' : 'Sign up'}
        disabled={!username || !password || signupMutation.isPending}
      />
    </form>
  );
}
