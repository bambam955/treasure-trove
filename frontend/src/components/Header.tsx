import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { User } from './User'

interface JwtPayload {
  sub: string
}

export function Header() {
  const [token, setToken] = useAuth()
  if (token) {
    const { sub } = jwtDecode<JwtPayload>(token)
    return (
      <div>
        Logged in as <User id={sub} />
        <br />
        <button onClick={() => setToken(null)}>Logout</button>
      </div>
    )
  }
  return (
    <div>
      <Link to='/login'>Login</Link> | <Link to='/signup'>Sign Up</Link>
    </div>
  )
}
