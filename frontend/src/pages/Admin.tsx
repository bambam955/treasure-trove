import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserInfo } from '@shared/users.ts';
import AdminApi from '../api/admin';

export function Admin() {
  const [token] = useAuth();
  const navigate = useNavigate();
 
  const usersQuery = useQuery<UserInfo[]>({
    queryKey: ['users'],
    queryFn: () => AdminApi.getAllUsers(token!),
  });

  const toggleLockMutation = useMutation({
    mutationFn: async (user: UserInfo) => {
      if (user.locked) {
        await AdminApi.unlockUser(user._id!, token!);
      } else {
        await AdminApi.lockUser(user._id!, token!);
      }
    },
    onSuccess: () => usersQuery.refetch(),
  });

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
  );
}
