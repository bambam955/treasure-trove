import { useQuery } from '@tanstack/react-query';
import UserApi, { UserInfo } from '../api/users';

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
  // This won't look great but it's better than nothing.
  const userInfo: UserInfo = userInfoQuery.data ?? { username: id };

  return <strong>{userInfo.username}</strong>;
}
