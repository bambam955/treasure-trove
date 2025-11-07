import { useMutation, useQuery } from '@tanstack/react-query';
import UserApi from '../api/users';
import { UserInfo } from '@shared/users.ts';
import { useAuth } from '../contexts/AuthContext';

interface UserProps {
  id: string;
}

export function User({ id }: UserProps) {
  const [token] = useAuth();

  // This is the query used to fetch the user info.
  const userInfoQuery = useQuery<UserInfo>({
    // The fetched info will be cached by user ID.
    queryKey: ['users', id],
    // Fetch the user info from the API.
    queryFn: () => UserApi.getUserInfo(id, token!),
  });

  // We can use this mutation to add tokens to the user's account.
  const tokensMutation = useMutation({
    mutationFn: (newTokens: number) =>
      UserApi.addUserTokens(id, newTokens, token!),
    onSuccess: () => userInfoQuery.refetch(),
  });

  // If for some reason we couldn't fetch the user info, default to the user ID as the username.
  // It won't look great, but it's better than nothing.
  const userInfo: UserInfo = userInfoQuery.data ?? { username: id };

  return (
    <div className='border rounded py-2 px-3 d-flex align-items-center justify-content-between bg-secondary'>
      <strong className='me-3'>{userInfo.username}</strong>
      <div className='vr' style={{ width: '3px' }} />
      <strong className='ms-2 fs-5'>
        💰 <em>{userInfo.tokens ?? 0}</em>
      </strong>
      <button
        // Don't allow tokens to be added if we had trouble fetching the initial amount.
        disabled={tokensMutation.isPending}
        className='btn ms-2 py-0 btn-sm bg-info fs-5'
        // Currently, pressing the button is hardcoded to add 100 tokens.
        // We will need to revise this eventually...
        onClick={() => tokensMutation.mutate(userInfo.tokens! + 100)}
      >
        +
      </button>
    </div>
  );
}
