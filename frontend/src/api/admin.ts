/// <reference types="vite/client" />
import type { FullUserInfo } from '@shared/users.ts';
import { apiRoute, jwtHeaders } from './utils';

class AdminApi {
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

  static async updateUserTokens(id: string, tokens: number, user: FullUserInfo, auth: string) {
    // const body = {
    // id: user.id,
    // username: user.username,
    // role: user.role,
    // tokens,
    // locked: user.locked,
    // canBeLocked: user.canBeLocked,
    // };
    const res = await fetch(apiRoute(`users/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders(auth),
      },
      body: JSON.stringify({...user, tokens}),
    });

    if (!res.ok) throw new Error('Failed to update tokens');
    return await res.json();
  }
}

export default AdminApi;
