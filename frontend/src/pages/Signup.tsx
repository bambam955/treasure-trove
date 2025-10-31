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
    <div
      className='d-flex justify-content-center align-items-center vh-100 bg-body-tertiary'
      data-bs-theme='dark'
    >
      <form
        onSubmit={handleSubmit}
        className='p-4 rounded shadow bg-dark text-light'
        style={{ width: '22rem' }}
      >
        <div className='text-center mb-3'>
          <Link to='/' className='text-decoration-none text-primary'>
            Back to main page
          </Link>
        </div>
        <hr />
        <br />
        <div className='mb-3'>
          <label
            htmlFor='signup-username'
            className='form-label fw-semibold text-pink'
          >
            Username:
          </label>
          <input
            type='text'
            name='create-username'
            id='create-username'
            className='form-control'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <br />
        <div className='mb-3'>
          <label
            htmlFor='signup-password'
            className='form-label fw-semibold text-pink'
          >
            Password:
          </label>
          <input
            type='text'
            name='create-password'
            id='create-password'
            className='form-control'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br />
        <input
          type='submit'
          value={signupMutation.isPending ? 'Signing up...' : 'Sign up'}
          disabled={!username || !password || signupMutation.isPending}
          className='btn btn-primary w-100'
        />
      </form>
    </div>
  );
}
