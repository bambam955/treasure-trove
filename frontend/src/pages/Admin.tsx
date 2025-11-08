import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  username: string;
  role: string;
  locked: boolean;
}

export function Admin() {
  const [token] = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // --- Always define the fetchers and hooks first ---
  const fetchUsers = async (): Promise<User[]> => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  };

  const usersQuery = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled: !!token && isAdmin === true, // don’t fetch until admin verified
  });

  const lockMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}admin/lock/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      usersQuery.refetch();
    },
  });

  const unlockMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}admin/unlock/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      usersQuery.refetch();
    },
  });

  // --- JWT role decoding ---
  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(payload.role === 'admin');
    } catch {
      setIsAdmin(false);
    }
  }, [token]);

  // --- Conditional Rendering ---
  if (isAdmin === null) return <p>Checking credentials...</p>;
  if (isAdmin === false) return <Navigate to='/' replace />;

  if (usersQuery.isLoading) return <p>Loading users...</p>;
  if (usersQuery.isError) return <p>Failed to load users.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate('/')}>Auction Site</button>

      <table border={1} cellPadding={8} style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersQuery.data?.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.locked ? 'Locked' : 'Active'}</td>
              <td>
                {u.locked ? (
                  <button
                    onClick={() => unlockMutation.mutate(u._id)}
                    disabled={unlockMutation.isPending}
                  >
                    Unlock
                  </button>
                ) : (
                  <button
                    onClick={() => lockMutation.mutate(u._id)}
                    disabled={lockMutation.isPending}
                  >
                    Lock
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
