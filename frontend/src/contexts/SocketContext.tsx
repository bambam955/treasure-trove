import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

type SocketStatus = 'waiting' | 'connected' | 'disconnected' | 'error';

interface SocketContextType {
  socket: Socket | null;
  status: SocketStatus;
  error: Error | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  status: 'waiting',
  error: null,
});

interface SocketContextProviderProps {
  children: React.ReactNode;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<SocketStatus>('waiting');
  const [error, setError] = useState<Error | null>(null);
  const [token] = useAuth();

  useEffect(() => {
    if (!token) {
      return;
    }

    // In development, use VITE_SOCKET_HOST. In production, connect to same origin.
    const socketHost =
      import.meta.env.VITE_SOCKET_HOST || window.location.origin;
    const newSocket = io(socketHost, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      setStatus('connected');
      setError(null);
    });

    newSocket.on('connect_error', (err) => {
      setStatus('error');
      setError(err);
    });

    newSocket.on('disconnect', () => {
      setStatus('disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, status, error }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket(): SocketContextType {
  return useContext(SocketContext);
}
