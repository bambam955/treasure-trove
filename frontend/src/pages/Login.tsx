import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
//import UserApi from '../api/users';
//import { AuthInfo } from '@shared/users.ts';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [, setToken] = useAuth();
  const [passwordError, setPasswordError] = useState(''); // creating state for password error

  // When a user clicks the "Login" button then we will send an API request
  // to attempt to register the new account.
  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Pass the backend error to onError
        throw new Error(data.error || 'Login failed.');
      }

      return data;
    },
    
   onError: (error: Error) => {
      alert(error.message);
    }, 
   onSuccess: (data) => {
  // Defensive check: token must exist and be a string
  if (!data.token || typeof data.token !== 'string') {
    alert('Invalid or missing token from server.');
    return;
  }

  setToken(data.token);

  try {
    // Decode the JWT payload (middle part of the token)
    const payload = JSON.parse(atob(data.token.split('.')[1]));

    // Redirect admins to their dashboard
    if (payload.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/home');
    }
  } catch (err) {
    console.error('Failed to decode token:', err);
    navigate('/home');
  }
},

  });

  const validatePassword = (value: string): boolean => {
    const minLength = value.length >= 7; // checks for minimum length of 7
    const hasNumber = /\d/.test(value); // checks for at least one digit (\d)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value); // checks for at least one special character
    if (!minLength) {
      setPasswordError('Password must be at least 7 characters long.');
      return false;
    } else if (!hasNumber) {
      setPasswordError('Password must contain at least one number.');
      return false;
    } else if (!hasSpecialChar) {
      setPasswordError('Password must contain at least one special character.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate();
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
            htmlFor='login-username'
            className='form-label fw-semibold text-pink'
          >
            Username:
          </label>
          <input
            type='text'
            name='login-username'
            id='login-username'
            className='form-control'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <br />
        <div className='mb-3'>
          <label
            htmlFor='login-password'
            className='form-label fw-semibold text-pink'
          >
            Password:
          </label>
          <input
            type='password'
            name='login-password'
            id='login-password'
            className='form-control'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value); // validate password on change
            }}
          />
          {passwordError && (
            <p style={{ color: 'red', fontSize: '0.9rem' }}>{passwordError}</p> // display password error message
          )}
        </div>
        <br />
        <input
          type='submit'
          value={loginMutation.isPending ? 'Logging in...' : 'Login'}
          disabled={!username || !password || loginMutation.isPending}
          className='btn btn-primary w-100'
        />
      </form>
    </div>
  );
}
