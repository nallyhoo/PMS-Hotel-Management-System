import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
          <Toaster 
            position="top-right" 
            richColors 
            expand 
            toastOptions={{
              style: {
                background: 'white',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
