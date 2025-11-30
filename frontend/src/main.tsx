import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './scss/custom.scss';

createRoot(document.getElementById('root')!).render(
  // Strict mode enables some extra warnings and things during development
  // so that errors can be caught before going to production.
  <StrictMode>
    <App />
  </StrictMode>,
);
