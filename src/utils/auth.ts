import { toast } from "react-hot-toast";
import { apiCall } from './api';

export const handleTokenExpiration = () => {
  // Clear auth data
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");

  // Show notification
  toast.error("Your session has expired. Please login again.");

  // Redirect to login page
  window.location.href = "/login";
};

export const isTokenExpired = (token: string): boolean => {
  try {
    // Decode the token
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Check if token is expired
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // If there's an error parsing the token, consider it expired
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");

  if (!token || !user) return false;

  // Check if token is expired
  return !isTokenExpired(token);
};

// Get current user data
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Handle unauthorized access
export const handleUnauthorized = (redirectUrl?: string) => {
  // Redirect to login
  window.location.href = "/login";
};

// Validate API connection
export const validateApiConnection = async (): Promise<boolean> => {
  try {
    return await apiCall.healthCheck();
  } catch (error) {
    console.warn('API connection validation failed:', error);
    return false;
  }
};

// Enhanced token validation
export const getValidToken = (): string | null => {
  const token = localStorage.getItem("authToken") || 
                localStorage.getItem("access_token") || 
                localStorage.getItem("token");

  if (!token) return null;

  // Check if token is expired
  if (isTokenExpired(token)) {
    handleTokenExpiration();
    return null;
  }

  return token;
};
