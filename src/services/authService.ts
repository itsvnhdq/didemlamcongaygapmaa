
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  citizenId: string;
  dateOfBirth: string;
  emergencyContact: string;
  medicalConditions: string;
  address: string;
}

// Define user roles to match server enum
export enum UserRole {
  User = 0,
  Admin = 1,
  Staff = 2,
}

export interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  role: UserRole;
  phoneNumber?: string;
  dateOfBirth?: string;
  bloodType?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
  };
  medicalConditions?: string | string[];
}

export interface LoginResponse {
  token: string;
  user: User;
  result?: {
    access_token: string;
    refresh_token: string;
    role: UserRole;
  };
  redirectTo?: string;
}

type AuthListener = (user: User | null, isAuthenticated: boolean) => void;

export class AuthService {
  private user: User | null = null;
  private isAuthenticated: boolean = false;
  private listeners: AuthListener[] = [];
  private isLoading: boolean = false;
  private error: string | null = null;
  // Add throttling state for resend functionality
  private lastResendTime: number = 0;
  private readonly RESEND_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
  private readonly apiBaseURL: string = "http://localhost:8000"; // Hardcoded to port 8000

  constructor() {
    this.initializeFromStorage();
    console.log('🔗 AuthService connected to: http://localhost:8000');
  }

  private getApiURL(endpoint: string): string {
    return `${this.apiBaseURL}${endpoint}`;
  }

  private initializeFromStorage() {
    try {
      // Check for both old and new token formats
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");
      const userStr =
        localStorage.getItem("user") || localStorage.getItem("user_data");

      if (token && userStr) {
        this.user = JSON.parse(userStr);
        this.isAuthenticated = true;
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
      this.clearStorage();
    }
  }

  private clearStorage() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
  }

  // State management methods
  subscribe(listener: AuthListener): () => void {
    this.listeners.push(listener);
    listener(this.user, this.isAuthenticated);

    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      listener(this.user, this.isAuthenticated);
    });
  }

  // Getters for current state
  getUser(): User | null {
    return this.user;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getIsEmailVerified(): boolean {
    return this.user?.isEmailVerified || false;
  }

  getIsLoading(): boolean {
    return this.isLoading;
  }

  getError(): string | null {
    return this.error;
  }

  clearError(): void {
    this.error = null;
  }

  // Helper function to convert server role string to UserRole enum
  private mapServerRoleToEnum(serverRole: string): UserRole {
    switch (serverRole.toLowerCase()) {
      case "admin":
        return UserRole.Admin;
      case "staff":
        return UserRole.Staff;
      case "member":
      case "user":
      default:
        return UserRole.User;
    }
  }

  // Helper method to map Django roles to frontend roles
  private mapDjangoRoleToUserRole(djangoRole: string): UserRole {
    switch (djangoRole?.toUpperCase()) {
      case 'ADMIN':
        return UserRole.Admin;
      case 'STAFF':
        return UserRole.Staff;
      case 'DONOR':
      case 'USER':
      default:
        return UserRole.User;
    }
  }

  // Enhanced login method with validation and better error handling
  async login(email: string, password: string): Promise<void> {
    this.setLoading(true);
    this.clearError();

    try {
      const apiURL = this.getApiURL('/api/users/login/');
      
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        let errorMessage: string;
        const data = errorData;

        switch (response.status) {
          case 400:
            errorMessage =
              "Invalid Input: " +
              (data.message || "Please check your email and password format.");
            break;
          case 401:
            errorMessage =
              "Invalid Credentials: " +
              (data.message || "The email or password you entered is incorrect.");
            break;
          case 403:
            errorMessage =
              "Account Access Denied: " +
              (data.message ||
                "Your account may be suspended or require verification.");
            break;
          case 404:
            errorMessage =
              "Account Not Found: No account found with this email address.";
            break;
          case 429:
            errorMessage =
              "Too Many Attempts: Please wait a few minutes before trying again.";
            break;
          case 500:
            errorMessage =
              "Server Error: Our servers are experiencing issues. Please try again later.";
            break;
          default:
            errorMessage = data.message || "An unexpected error occurred.";
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Handle Django response format
      if (data.token && data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          name: `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim(),
          role: this.mapDjangoRoleToUserRole(data.user.role),
          isEmailVerified: !!data.user.isEmailVerified,
        };

        this.setUser(user);
        this.setToken(data.token);
        this.setIsAuthenticated(true);
        
        console.log(`✅ Login successful for ${user.email}`);
      } else {
        throw new Error('Invalid login response format');
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      this.setError(error.message || 'Login failed');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async register(userData: RegisterData): Promise<void> {
    this.setLoading(true);
    this.clearError();

    try {
      const apiURL = this.getApiURL('/api/users/signup/');
      
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone_number: userData.phone,
          citizen_id: userData.citizenId,
          date_of_birth: userData.dateOfBirth,
          emergency_contact: userData.emergencyContact,
          medical_conditions: userData.medicalConditions,
          address: userData.address
        }),
      });

      if (!response.ok) {
        let errorMessage = "Registration failed";

        try {
          const data = await response.json();
          if (data.errors) {
            const firstError = Object.values(data.errors)[0];
            errorMessage = Array.isArray(firstError)
              ? firstError[0] as string
              : firstError as string;
          } else {
            errorMessage = data.message || data.error || errorMessage;
          }
        } catch (parseError) {
          errorMessage = `Registration failed: ${response.status} ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Registration successful:', data);
      
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      this.setError(error.message || 'Registration failed');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    this.setLoading(true);
    this.clearError();

    try {
      if (!email || !email.trim()) {
        throw new Error("Email is required for password reset.");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        throw new Error(
          "Please enter a valid email address for password reset."
        );
      }

      const apiURL = this.getApiURL('/api/verify/send-otp/');
      
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (response.ok) {
        console.log('✅ Password reset email sent');
        return true;
      } else {
        const data = await response.json();
        let errorMessage = "Password Reset Failed";

        switch (response.status) {
          case 404:
            errorMessage = "No account found with this email address.";
            break;
          case 429:
            errorMessage =
              "Too many reset requests. Please wait before requesting another password reset.";
            break;
          case 500:
            errorMessage = "Server error occurred. Please try again later.";
            break;
          default:
            errorMessage =
              data.message || "Failed to send password reset email.";
        }

        this.setError(errorMessage);
        return false;
      }
    } catch (error: any) {
      console.error('❌ Password reset failed:', error);
      if (error instanceof Error) {
        this.setError(error.message);
      } else {
        this.setError("Password reset request failed.");
      }
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const apiURL = this.getApiURL('/api/verify/reset-password/');
      
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          new_password: newPassword 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Password reset failed');
      }

      console.log('✅ Password reset successful');
      return true;
    } catch (error: any) {
      console.error('❌ Password reset failed:', error);
      this.setError(error.message || 'Password reset failed');
      return false;
    }
  }

  // Enhanced credential check method
  async checkCredentials(
    email: string,
    password: string
  ): Promise<{
    isValid: boolean;
    isVerified: boolean;
    userEmail?: string;
    userRole?: UserRole;
  }> {
    try {
      const loginURL = this.getApiURL("/api/users/login/");
      const response = await fetch(loginURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.log("Credential check failed - HTTP error:", response.status);
        return { isValid: false, isVerified: false };
      }

      const data = await response.json();
      console.log("Credential check response:", data);

      // Handle the actual server response format: {message: 'Login successfully', result: {...}, redirectTo: '/admin'}
      if (data.message === "Login successfully" && data.redirectTo) {
        // Admin/Staff always considered verified regardless of DB status
        const isAdminOrStaff =
          data.redirectTo === "/admin" || data.redirectTo === "/staff";
        const userRole =
          data.redirectTo === "/admin"
            ? UserRole.Admin
            : data.redirectTo === "/staff"
            ? UserRole.Staff
            : UserRole.User;

        console.log("Credential check - Admin/Staff detection:", {
          redirectTo: data.redirectTo,
          isAdminOrStaff: isAdminOrStaff,
          alwaysVerified: isAdminOrStaff,
          userRole: userRole,
        });

        return {
          isValid: true,
          isVerified: true, // Always true for admin/staff
          userEmail: email,
          userRole: userRole,
        };
      }

      let user = data.user || data;
      let isVerified = false; // Default to NOT verified for credential check
      let userRole = UserRole.User;

      if (user && typeof user === "object") {
        // Determine role from user data
        userRole = this.mapServerRoleToEnum(user.role || "");
        const isAdminOrStaff =
          userRole === UserRole.Admin || userRole === UserRole.Staff;

        if (isAdminOrStaff) {
          // Admin/Staff NEVER need verification
          isVerified = true;
          console.log("Credential check - Admin/Staff user, always verified:", {
            role: user.role,
            userRole: userRole,
          });
        } else {
          // Regular users MUST be verified in database
          isVerified = this.isAccountVerified(user.verify);
          console.log(
            "Credential check - Regular user, checking verification:",
            {
              role: user.role,
              userRole: userRole,
              verify: user.verify,
              isVerified: isVerified,
            }
          );
        }
      }

      return {
        isValid: true,
        isVerified: isVerified,
        userEmail: user?.email || email,
        userRole: userRole,
      };
    } catch (error) {
      console.error("Credential check error:", error);
      return { isValid: false, isVerified: false };
    }
  }

  // Helper method to check if account is verified
  private isAccountVerified(verifyStatus: any): boolean {
    // Handle different possible formats of verify status
    if (typeof verifyStatus === 'boolean') {
      return verifyStatus;
    }
    if (typeof verifyStatus === 'string') {
      return verifyStatus.toLowerCase() === 'true' || verifyStatus === '1';
    }
    if (typeof verifyStatus === 'number') {
      return verifyStatus === 1;
    }
    return false;
  }

  // Enhanced logout method
  async logout(): Promise<void> {
    this.setLoading(true);

    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const accessToken =
        localStorage.getItem("access_token") || localStorage.getItem("token");

      if (refreshToken && accessToken) {
        const logoutURL = this.getApiURL("/api/users/logout/");
        await fetch(logoutURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      this.clearStorage();
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
      this.setLoading(false);
    }
  }

  // Verify forgot password token
  async verifyForgotPasswordToken(token: string): Promise<boolean> {
    try {
      console.log('🔍 Verifying forgot password token:', token);
      const verifyURL = this.getApiURL("/api/verify/token/");
      console.log('Token verification URL:', verifyURL);
      
      const response = await fetch(verifyURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });

      console.log('Token verification response status:', response.status);
      const responseData = await response.json();
      console.log('Token verification response data:', responseData);

      if (response.ok) {
        return true;
      } else {
        throw new Error(responseData.message || "Invalid or expired reset token.");
      }
    } catch (error) {
      console.error("Token verification error:", error);
      throw error;
    }
  }

  // Reset password with token
  async resetPasswordWithToken(token: string, newPassword: string, confirmPassword: string): Promise<boolean> {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }

      console.log('🔄 Attempting password reset with token:', token);
      const resetURL = this.getApiURL("/api/verify/reset-password/");
      console.log('Password reset URL:', resetURL);

      const response = await fetch(resetURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          new_password: newPassword,
          confirm_password: confirmPassword
        }),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        console.log('✅ Password reset successful');
        return true;
      } else {
        throw new Error(responseData.message || "Password reset failed.");
      }

    } catch (error) {
      console.error("Password reset error:", error);
      
      // Improve error messages for better user experience
      if (error instanceof Error) {
        if (error.message.includes("do not match")) {
          throw new Error("⚠️ Password validation failed.\n\nPlease ensure:\n• Both password fields are filled\n• Both passwords match exactly\n• Password meets all requirements");
        } else if (error.message.includes("token")) {
          throw new Error("⚠️ The password reset token is invalid or has expired.\n\nPlease request a new password reset link to continue.");
        } else if (error.message.includes("expired")) {
          throw new Error("⚠️ The password reset link has expired.\n\nFor security reasons, reset links are only valid for 1 hour.\n\nPlease request a new password reset link.");
        } else {
          throw error;
        }
      } else {
        throw new Error("⚠️ An unexpected error occurred during password reset.\n\nPlease try again or contact support if the problem persists.");
      }
    }
  }

  // Helper function to get dashboard route based on user role
  getDashboardByRole(role: UserRole): string {
    switch (role) {
      case UserRole.Admin:
        return "/admin";
      case UserRole.Staff:
        return "/staff";
      case UserRole.User:
        return "/member-dashboard";
      default:
        return "/";
    }
  }

  private setUser(user: User) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
    this.notifyListeners();
  }

  private setToken(token: string) {
    localStorage.setItem("token", token);
  }

  private setIsAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
    this.notifyListeners();
  }

  private setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
    this.notifyListeners();
  }

  private setError(error: string | null) {
    this.error = error;
    this.notifyListeners();
  }

  // ...existing methods...
  updateVerificationStatus(verified: boolean): void {
    try {
      if (this.user) {
        const updatedUser = { ...this.user, isEmailVerified: verified };
        this.user = updatedUser;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
        this.notifyListeners();
      }
    } catch (error) {
      console.error("Error updating verification status:", error);
    }
  }

  // Enhanced resend method with 5-minute throttling
  async resendVerificationEmail(email?: string): Promise<void> {
    const now = Date.now();
    const timeSinceLastResend = now - this.lastResendTime;

    if (timeSinceLastResend < this.RESEND_COOLDOWN_MS) {
      const remainingTime = Math.ceil(
        (this.RESEND_COOLDOWN_MS - timeSinceLastResend) / 1000
      );
      throw new Error(
        `Please wait ${Math.ceil(
          remainingTime / 60
        )} minutes before requesting another verification email.`
      );
    }

    try {
      const emailToUse = email || this.user?.email;
      if (!emailToUse) {
        throw new Error("No user email found");
      }

      console.log(
        "🔄 Sending verification email resend request for:",
        emailToUse
      );

      const apiURL = this.getApiURL("/api/verify/send-otp/");
      
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include authorization if user is logged in
          ...(this.isAuthenticated && {
            Authorization: `Bearer ${
              localStorage.getItem("access_token") ||
              localStorage.getItem("token")
            }`,
          }),
        },
        body: JSON.stringify({ email: emailToUse }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle specific error cases
        if (response.status === 429) {
          throw new Error(
            "Too many requests. Please wait before requesting another verification email."
          );
        } else if (response.status === 404) {
          throw new Error("User not found. Please check your email address.");
        } else if (response.status === 400) {
          throw new Error(
            errorData?.message || "Invalid request. Please try again."
          );
        } else if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        }

        throw new Error(
          errorData?.message ||
            "Failed to resend verification email. Please try again later."
        );
      }

      // Update throttling timestamp on successful request
      this.lastResendTime = now;
      console.log("✅ Verification email resend successful");

      return await response.json();
    } catch (error) {
      console.error("❌ Error resending verification email:", error);
      throw error;
    }
  }

  // Get remaining cooldown time in seconds
  getRemainingCooldownTime(): number {
    const now = Date.now();
    const timeSinceLastResend = now - this.lastResendTime;
    const remainingTime = this.RESEND_COOLDOWN_MS - timeSinceLastResend;

    return remainingTime > 0 ? Math.ceil(remainingTime / 1000) : 0;
  }

  // Check if resend is available
  canResendVerificationEmail(): boolean {
    return this.getRemainingCooldownTime() === 0;
  }

  async verifyEmail(token: string): Promise<any> {
    try {
      const verifyURL = this.getApiURL("/api/verify/email/");
      
      const response = await fetch(verifyURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Email verification failed");
      }

      const result = await response.json();

      if (this.user) {
        this.updateVerificationStatus(true);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  getCurrentUser(): User | null {
    return this.getUser();
  }

  updateUserVerificationStatus(verified: boolean): void {
    this.updateVerificationStatus(verified);
  }
}

// Export singleton instance
export const authService = new AuthService();