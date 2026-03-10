import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1a1a1a]/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default AuthGuard;
