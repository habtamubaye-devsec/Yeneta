import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading...</div>;
  }

  // If user not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Block inactive or unverified accounts
  if (user && user.status && user.status !== "active") {
    return <Navigate to="/login" replace />;
  }

  if (user && user.isVerified === false) {
    return (
      <Navigate
        to="/verify"
        replace
        state={{ email: user.email, userId: user.id }}
      />
    );
  }

  // If role-based protection is used
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children or nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
