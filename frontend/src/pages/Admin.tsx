import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FullUserInfo } from '@shared/users.ts';
import AdminApi from '../api/admin';
import { UnauthorizedPage } from './Unauthorized.tsx';
import { BaseLayout } from '../layouts/BaseLayout.tsx';

export function Admin() {
  const [token] = useAuth();
  const navigate = useNavigate();

  if (!token) {
    return <UnauthorizedPage />;
  }

  const usersQuery = useQuery<FullUserInfo[]>({
    queryKey: ['users'],
    queryFn: () => AdminApi.getAllUsers(token!),
  });

  const toggleLockMutation = useMutation({
    mutationFn: async (user: FullUserInfo) => {
      if (user.locked) {
        await AdminApi.unlockUser(user.id!, token!);
      } else {
        await AdminApi.lockUser(user.id!, token!);
      }
    },
    onSuccess: () => usersQuery.refetch(),
  });

  return (
    <BaseLayout>
      <div>
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
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>{u.locked ? 'Locked' : 'Active'}</td>
                <td>
                  {u.role !== 'admin' ? (
                    <button
                      onClick={() => toggleLockMutation.mutate(u)}
                      disabled={toggleLockMutation.isPending}
                      className={`btn btn-sm ${u.locked ? 'btn-success' : 'btn-danger'}`}
                    >
                      {u.locked ? 'Unlock' : 'Lock'}
                    </button>
                  ) : (
                    <em style={{ color: 'gray' }}>N/A</em>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BaseLayout>
  );
}
