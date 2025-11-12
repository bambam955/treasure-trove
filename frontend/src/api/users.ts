/// <reference types="vite/client" />

import type {
  UserCredentials,
  AuthInfo,
  RegularUserInfo,
  FullUserInfo,
} from '@shared/users.ts';
import { apiRoute, jwtHeaders } from './utils';

// This class defines frontend API methods for the backend database.
class UserApi {
  // Register a new user account, which requires just a username and password.
  // If successful, the new user's info will be returned.
  static async signup(auth: UserCredentials): Promise<RegularUserInfo> {
    // Send request to create account.
    const res = await fetch(apiRoute('users/signup'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: auth.username,
        password: auth.password,
      }),
    });
    if (!res.ok) throw new Error('failed to sign up');
    return await res.json();
  }

  // Log in to an existing user account with a username and password.
  // If successful, the authentication info from the backend will be returned.
  static async login(auth: UserCredentials): Promise<AuthInfo> {
    // Send request to log in.
    const res = await fetch(apiRoute('users/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: auth.username,
        password: auth.password,
      }),
    });
    if (!res.ok) throw new Error('failed to log in');
    return await res.json();
  }

  // Retrieve information about a given user.
  // A user's ID is a unique identifier assigned by the backend, which we parse from the JWT token.
  static async getUserInfo(
    id: string,
    token: string,
  ): Promise<RegularUserInfo | FullUserInfo> {
    const res = await fetch(apiRoute(`users/${id}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
    });
    if (!res.ok) throw new Error('failed to fetch user info');
    return await res.json();
  }

  static async updateUser(
    id: string,
    user: Partial<FullUserInfo>,
    token: string,
  ): Promise<RegularUserInfo | FullUserInfo> {
    const res = await fetch(apiRoute(`users/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error('failed to update user tokens');
    return await res.json();
  }
}

export default UserApi;
