import { Outlet } from 'react-router-dom';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  role?: 'STUDENT' | 'TUTOR' | 'ADMIN';
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  // TEMPORARY MODIFICATION FOR SCREENSHOTS:
  // Bypassing all authentication checks to allow access to all routes
  // Remove or comment out this code when done taking screenshots
  return <Outlet />;

  /*
  // Original authentication code - uncomment when done taking screenshots
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check if user has the correct role
  if (role && user?.role !== role) {
    // Redirect to the appropriate dashboard based on user's role
    let redirectPath = '/';
    
    if (user?.role === 'STUDENT') {
      redirectPath = '/student/dashboard';
    } else if (user?.role === 'TUTOR') {
      redirectPath = '/tutor/dashboard';
    } else if (user?.role === 'ADMIN') {
      redirectPath = '/admin/dashboard';
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  // If all checks pass, render the protected content
  return <Outlet />;
  */
};

export default ProtectedRoute;