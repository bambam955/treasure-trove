import { QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Signup } from './pages/Signup';
import { AuthContextProvider } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { Admin } from './pages/Admin.tsx';
import { AuctionView } from './pages/AuctionView.tsx';
import { AddAuction } from './pages/AddAuction.tsx';
import { MyAuctions } from './pages/MyAuctions.tsx';
import { PurchasedItems } from './pages/PurchasedItems.tsx';
import { queryClient } from './api/queryClient.ts';

// Define the routes to different pages of the application.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/auctions/:id',
    element: <AuctionView />,
  },
  {
    path: '/auctions/add',
    element: <AddAuction />,
  },
  {
    path: '/my-auctions',
    element: <MyAuctions />,
  },
  {
    path: '/purchased',
    element: <PurchasedItems />,
  },
]);

export function App() {
  return (
    // QueryClientProvider connects the query client to the app.
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
