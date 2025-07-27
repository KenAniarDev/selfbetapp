import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Debug logging
  console.log('PublicRoute - loading:', loading, 'isAuthenticated:', isAuthenticated, 'user:', user?.email);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard instead of root to avoid conflicts
  if (isAuthenticated) {
    console.log('PublicRoute - redirecting authenticated user to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if not authenticated
  console.log('PublicRoute - rendering children for unauthenticated user');
  return <>{children}</>;
};

export default PublicRoute; 