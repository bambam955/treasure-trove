import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Signup } from './pages/Signup';
import { AuthContextProvider } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';

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
]);

// The QueryClient is what allows for async fetches from a backend server to work
// on the client side.
const queryClient = new QueryClient();

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
