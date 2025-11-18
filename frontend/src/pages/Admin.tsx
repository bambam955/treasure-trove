import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FullUserInfo } from '@shared/users.ts';
import AdminApi from '../api/admin';
import { Header } from '../components/Header.tsx';
import UserApi from '../api/users.ts';

export function Admin() {
  const [token] = useAuth();
  const navigate = useNavigate();

  const usersQuery = useQuery<FullUserInfo[]>({
    queryKey: ['users'],
    queryFn: () => AdminApi.getAllUsers(token!),
    enabled: !!token,
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

  const updateTokensMutation = useMutation({
    mutationFn: async ({
      user,
      newTokens,
    }: {
      user: FullUserInfo;
      newTokens: number;
    }) => {
      await UserApi.updateUser(
        user.id,
        { id: user.id, tokens: newTokens },
        token!,
      );
    },
    onSuccess: () => usersQuery.refetch(),
  });

  if (!token) {
    return (
      <div style={{ padding: 8 }}>
        <Header />
        <p>You must be logged in as an admin</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate('/')}>Auction Site</button>

      <table border={1} cellPadding={8} style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Tokens</th>
            <th>Lock / Unlock</th>
            <th>Token Controls</th>
          </tr>
        </thead>
        <tbody>
          {usersQuery.data?.map((u) => {
            const currentTokens = u.tokens ?? 0;
            return (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>{u.locked ? 'Locked' : 'Active'}</td>
                <td>{currentTokens}</td>
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
                <td>
                  {u.role !== 'admin' ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>Add Tokens</div>
                      <button
                        className='btn btn-sm btn-success'
                        disabled={updateTokensMutation.isPending}
                        onClick={() =>
                          updateTokensMutation.mutate({
                            user: u,
                            newTokens: currentTokens + 100,
                          })
                        }
                      >
                        +100
                      </button>

                      <div style={{ fontWeight: 'bold', marginTop: 6 }}>
                        Remove Tokens
                      </div>
                      <button
                        className='btn btn-sm btn-warning'
                        disabled={updateTokensMutation.isPending}
                        onClick={() =>
                          updateTokensMutation.mutate({
                            user: u,
                            newTokens: Math.max(0, currentTokens - 100),
                          })
                        }
                      >
                        -100
                      </button>
                    </div>
                  ) : (
                    <em style={{ color: 'gray' }}>N/A</em>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
