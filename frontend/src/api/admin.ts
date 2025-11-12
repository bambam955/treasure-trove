/// <reference types="vite/client" />
import type { UserInfo } from '@shared/users.ts';
import { apiRoute, jwtHeaders } from './utils';

class AdminApi {
  static async getAllUsers(token: string): Promise<UserInfo[]> {
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
