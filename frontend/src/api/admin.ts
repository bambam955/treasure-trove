/// <reference types="vite/client" />
import type { FullUserInfo } from '@shared/users.ts';
import { apiRoute, jwtHeaders } from './utils';

class AdminApi {
  // Retrieve information about all users.
  static async getAllUsers(token: string): Promise<FullUserInfo[]> {
    const res = await fetch(apiRoute('admin/users'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch users');
    }

    return await res.json();
  }

  // Lock out a user's account.
  // Locked users will not be able to log in.
  static async lockUser(id: string, token: string): Promise<void> {
    const res = await fetch(apiRoute(`admin/users/${id}/lock`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to lock user');
    }
  }

  // Unlock a user's account.
  static async unlockUser(id: string, token: string): Promise<void> {
    const res = await fetch(apiRoute(`admin/users/${id}/unlock`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(token),
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to unlock user');
    }
  }
}

export default AdminApi;
