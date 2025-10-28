import React, { createContext, useContext, useState } from 'react'

interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
})

interface AuthContextProviderProps {
  children: React.ReactNode
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null)
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): [string | null, (token: string | null) => void] {
  const { token, setToken } = useContext(AuthContext)
  return [token, setToken]
}
