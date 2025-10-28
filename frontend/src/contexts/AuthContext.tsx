import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

interface AuthContextProviderProps {
  children: React.ReactNode;
}

// This provider component is how the context gets integrated into the React tree.
// All it's really doing is saving a stringified token using React state.
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// This hook is how another React element can easily get access to the authentication
// information when needed.
export function useAuth(): [string | null, (token: string | null) => void] {
  const { token, setToken } = useContext(AuthContext);
  return [token, setToken];
}
