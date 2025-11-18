import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { UnauthContent } from '../pages/Unauthorized.tsx';

interface BaseLayoutProps {
  children: React.ReactNode;
  checkAuth?: boolean;
}

export function BaseLayout({ children, checkAuth }: BaseLayoutProps) {
  const reqAuth = checkAuth ?? true; // This way checkAuth defaults to true
  const [token] = useAuth();

  // If the user is logged in then show the normal content.
  // Otherwise, notify the user that they must be logged in to view that page.
  // Note that most times the other page components should take care of this,
  // because they'll need to check authorization before loading API queries and whatnot...
  // but this provides a simple default.
  return (
    <div className='vh-100 d-flex flex-column p-2'>
      <Header />
      {token || !reqAuth ? children : <UnauthContent />}
    </div>
  );
}
