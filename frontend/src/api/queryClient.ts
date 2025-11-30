import { QueryClient } from '@tanstack/react-query';

// The QueryClient is what allows for async fetches from a backend server to work
// on the client side.
// We need it to be accessible from both React components and TS functions,
// which is why it's exported here.
export const queryClient = new QueryClient();
