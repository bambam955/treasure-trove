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
  const [passwordError, setPasswordError] = useState(''); // creating state for password error

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

    if (!validatePassword(password)) {
      alert(
        'Password must be at least 7 characters long and contain at least one number and one special character.',
      );
      return;
    }
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
