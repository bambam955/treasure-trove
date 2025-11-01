import { useQuery } from '@tanstack/react-query';
import UserApi from '../api/users';
import { UserInfo } from '@shared/users.ts';

interface UserProps {
  id: string;
}

export function User({ id }: UserProps) {
  const userInfoQuery = useQuery<UserInfo>({
    // The fetched info will be cached by user ID.
    queryKey: ['users', id],
    // Fetch the user info from the API.
    queryFn: () => UserApi.getUserInfo(id),
  });

  // If for some reason we couldn't fetch the user info, default to the user ID as the username.
  // It won't look great, but it's better than nothing.
  const userInfo: UserInfo = userInfoQuery.data ?? { username: id, tokens: 0 };

  return (
    <div className='border rounded py-2 px-3 d-flex align-items-center justify-content-between bg-secondary'>
      <strong className='me-3'>{userInfo.username}</strong>
      <div className='vr' style={{ width: '3px' }} />
      <strong className='ms-2 fs-5'>
        💰 <em>{userInfo.tokens}</em>
      </strong>
      <button className='btn ms-2 py-0 btn-sm bg-info fs-5'>+</button>
    </div>
  );
}
