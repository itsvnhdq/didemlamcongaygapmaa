import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { AdminProvider } from "./pages/AdminPage/AdminContext";
import { StaffProvider } from "./pages/StaffPage/StaffContext";
import { apiService } from "./services/apiService";
import { authService, User, UserRole } from "./services/authService";

// Layout components
import Footer from "./components/Layout/Footer";
import Navbar from "./components/Layout/Navbar";

// Page components
import DonationManagement from "./components/Management/Donation/DonationManagement";
import EmergencyManagementPage from "./components/Management/Emergency/EmergencyManagement";
import EmergencyRequestPage from "./components/Management/Emergency/EmergencyRequestPage";
import InventoryOverview from "./components/Management/Inventory/InventoryOverview";
import ProfileEdit from "./components/Management/Profile/ProfileEdit";
import AddUser from "./components/Management/User/AddUser";
import UpdateUser from "./components/Management/User/UpdateUser";
import UsersPage from "./components/Management/User/UserManagement";
import SettingsPage from "./components/Setting/SettingPage";
import AppointmentBookingPage from "./pages/Appointment/AppointmentBookingPage";
import Blog from "./pages/Blog/Blog";
import Contact from "./pages/Contact/Contact";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import MemberDashboard from "./pages/Dashboard/MemberDashboard";
import StaffDashboard from "./pages/Dashboard/StaffDashboard";
import AboutPage from "./pages/Infor/AboutPage";
import BloodTypeInfoPage from "./pages/Infor/BloodTypeInfoPage";
import HomePage from "./pages/Infor/HomePage";
import PrivacyPolicy from "./pages/Infor/PrivacyPolicy";
import TermsOfServices from "./pages/Infor/TermsOfServices";
import ForgotPassword from "./pages/Login/ForgotPassword";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Login/RegisterPage";
import ResetPassword from "./pages/Login/ResetPassword";
import ResetPasswordRedirect from "./pages/Login/ResetPasswordRedirect";

// Create React context for auth
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  requestPasswordReset: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.getIsAuthenticated()
  );
  const [isLoading, setIsLoading] = useState(authService.getIsLoading());
  const [error, setError] = useState<string | null>(authService.getError());
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    // Initialize API configuration using the new service
    const initAPI = async () => {
      try {
        await apiService.getBaseURL(); // This will trigger initialization
        setIsApiReady(true);
        console.log("🚀 API service ready");
      } catch (error) {
        console.error("Failed to initialize API:", error);
        setIsApiReady(true); // Continue with fallback
      }
    };

    initAPI();

    // Subscribe to auth changes
    const unsubscribe = authService.subscribe((newUser, newIsAuthenticated) => {
      setUser(newUser);
      setIsAuthenticated(newIsAuthenticated);
      setIsLoading(authService.getIsLoading());
      setError(authService.getError());
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
  };

  const logout = async () => {
    await authService.logout();
  };

  const clearError = () => {
    authService.clearError();
    setError(null);
  };

  const requestPasswordReset = async (email: string) => {
    return await authService.requestPasswordReset(email);
  };

  // Show loading while API is initializing
  if (!isApiReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-200 border-t-red-600 mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-gray-700">
            Connecting to server...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Detecting server port automatically
          </p>
        </div>
      </div>
    );
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading,
    error,
    clearError,
    requestPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper function to get dashboard route based on user role
export const getDashboardByRole = (role: UserRole): string => {
  return authService.getDashboardByRole(role);
};

// Role-based route protection component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case UserRole.User:
        window.location.href = "/member-dashboard";
        break;
      case UserRole.Staff:
        window.location.href = "/staff";
        break;
      case UserRole.Admin:
        window.location.href = "/admin";
        break;
      default:
        window.location.href = "/";
        break;
    }
    return null;
  }

  return <>{children}</>;
};

// Export UserRole for use in other components
export { UserRole };

// Main App component with routing
const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blood-types" element={<BloodTypeInfoPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/terms" element={<TermsOfServices />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardByRole(user!.role)} />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardByRole(user!.role)} />
          ) : (
            <ForgotPassword />
          )
        }
      />
      {/* Reset password routes - handle both possible URLs */}
      <Route
        path="/reset-password"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardByRole(user!.role)} />
          ) : (
            <ResetPassword />
          )
        }
      />
      <Route
        path="/members/reset-password"
        element={<ResetPasswordRedirect />}
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardByRole(user!.role)} />
          ) : (
            <RegisterPage />
          )
        }
      />

      {/* Protected routes */}
      <Route
        path="/member-dashboard"
        element={
          <ProtectedRoute allowedRoles={[UserRole.User, UserRole.Admin]}>
            <MemberDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={[UserRole.Staff, UserRole.Admin]}>
            <StaffProvider>
              <StaffDashboard />
            </StaffProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/emergency-request"
        element={
          <ProtectedRoute allowedRoles={[UserRole.Staff, UserRole.Admin]}>
            <StaffProvider>
              <EmergencyRequestPage />
            </StaffProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[UserRole.Admin]}>
            <AdminProvider>
              <AdminDashboard />
            </AdminProvider>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage/inventory"
        element={
          <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Staff]}>
            <StaffProvider>
              <InventoryOverview />
            </StaffProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/user"
        element={
          <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Staff]}>
            <AdminProvider>
              <UsersPage />
            </AdminProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/user/add"
        element={
          <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Staff]}>
            <AdminProvider>
              <AddUser />
            </AdminProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/user/:id"
        element={
          <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Staff]}>
            <AdminProvider>
              <UpdateUser />
            </AdminProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/donation"
        element={
          <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Staff]}>
            <AdminProvider>
              <DonationManagement />
            </AdminProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage/emergency"
        element={
          <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Staff]}>
            <AdminProvider>
              <EmergencyManagementPage />
            </AdminProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={[UserRole.Admin]}>
            <AdminProvider>
              <SettingsPage />
            </AdminProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointment/newAppointment"
        element={
          <ProtectedRoute
            allowedRoles={[UserRole.User, UserRole.Staff, UserRole.Admin]}
          >
            <AppointmentBookingPage />
          </ProtectedRoute>
        }
      />
      <Route path="/profile-settings" element={<ProfileEdit />} />
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
