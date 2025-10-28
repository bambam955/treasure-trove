import { useQuery } from '@tanstack/react-query'
import UserApi, { UserInfo } from '../api/users'

interface UserProps {
  id: string
}

export function User({ id }: UserProps) {
  const userInfoQuery = useQuery<UserInfo>({
    queryKey: ['users', id],
    queryFn: () => UserApi.getUserInfo(id),
  })

  // If for some reason we couldn't fetch the user info, default to the user ID as the username.
  const userInfo = userInfoQuery.data ?? { username: id }

  return <strong>{userInfo.username}</strong>
}
