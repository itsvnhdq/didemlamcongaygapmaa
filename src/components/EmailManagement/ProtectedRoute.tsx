import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService, User, UserRole } from "../../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireEmailVerification = true,
}) => {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.getIsAuthenticated()
  );
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = authService.subscribe((newUser, newIsAuthenticated) => {
      setUser(newUser);
      setIsAuthenticated(newIsAuthenticated);
      setIsLoading(false);
    });

    // Initial load
    setIsLoading(false);

    return unsubscribe;
  }, []);

  // Show loading spinner while determining auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log(
      "🚫 ProtectedRoute: User not authenticated, redirecting to login"
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin and Staff: NO verification requirements EVER
  // Regular Users: MUST be verified if requireEmailVerification is true
  const isAdminOrStaff =
    user?.role === UserRole.Admin || user?.role === UserRole.Staff;
  const isEmailVerified = user?.isEmailVerified || false;

  console.log("🔍 ProtectedRoute access control:", {
    userRole: user?.role,
    roleString:
      user?.role === UserRole.Admin
        ? "Admin"
        : user?.role === UserRole.Staff
        ? "Staff"
        : "User",
    isAdminOrStaff: isAdminOrStaff,
    isEmailVerified: isEmailVerified,
    requireEmailVerification: requireEmailVerification,
    willBlock: !isAdminOrStaff && requireEmailVerification && !isEmailVerified,
  });

  // CRITICAL: Block unverified regular users
  if (!isAdminOrStaff && requireEmailVerification && !isEmailVerified) {
    console.warn("🚫 ProtectedRoute: BLOCKING UNVERIFIED MEMBER USER:", {
      role: user?.role,
      email: user?.email,
      isEmailVerified: isEmailVerified,
      message:
        "Member users MUST verify email before accessing protected routes",
    });

    // Force logout and redirect to login with verification prompt
    authService.logout();
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          showEmailVerification: true,
          email: user?.email,
          message: "Please verify your email address to access this page.",
        }}
        replace
      />
    );
  }

  if (isAdminOrStaff) {
    console.log(
      "✅ ProtectedRoute: Admin/Staff user - NO verification required, full access granted"
    );
  } else {
    console.log("✅ ProtectedRoute: Verified member user - access granted");
  }

  return <>{children}</>;
};

export default ProtectedRoute;
