/// <reference types="vite/client" />
import type { UserInfo } from '@shared/users.ts';

class AdminApi {
  static async getAllUsers(auth: string): Promise<UserInfo[]> {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth}`,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch users');
    }

    return await res.json();
  }

  static async lockUser(id: string, auth: string): Promise<void> {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}admin/users/lock/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth}`,
        },
      },
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to lock user');
    }
  }

  static async unlockUser(id: string, auth: string): Promise<void> {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}admin/users/unlock/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth}`,
        },
      },
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to unlock user');
    }
  }

  static async updateUserTokens(id: string, tokens: number, auth: string) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}users/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify({ tokens }),
    });

    if (!res.ok) throw new Error('Failed to update tokens');
    return await res.json();
  }
}

export default AdminApi;
