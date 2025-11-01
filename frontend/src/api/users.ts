/// <reference types="vite/client" />

import type { UserCredentials, UserInfo, AuthInfo } from '@shared/users.ts';

// This class defines frontend API methods for the backend database.
class UserApi {
  // Register a new user account, which requires just a username and password.
  // If successful, the new user's info will be returned.
  static async signup({
    username,
    password,
  }: UserCredentials): Promise<UserInfo> {
    // Send request to create account.
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('failed to sign up');
    return await res.json();
  }

  // Log in to an existing user account with a username and password.
  // If successful, the authentication info from the backend will be returned.
  static async login({
    username,
    password,
  }: UserCredentials): Promise<AuthInfo> {
    // Send request to log in.
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('failed to log in');
    return await res.json();
  }

  // Retrieve information about a given user.
  // A user's ID is a unique identifier assigned by the backend, which we parse from the JWT token.
  static async getUserInfo(id: string, token: string): Promise<UserInfo> {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('failed to fetch user info');
    return await res.json();
  }
}

export default UserApi;
