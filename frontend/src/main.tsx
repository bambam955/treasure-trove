import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './scss/custom.scss';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';

createRoot(document.getElementById('root')!).render(
  // Strict mode enables some extra warnings and things during development
  // so that errors can be caught before going to production.
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
