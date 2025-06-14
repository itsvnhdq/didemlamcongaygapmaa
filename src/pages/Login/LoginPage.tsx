import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import EmailVerificationNotice from "../../components/EmailManagement/EmailVerificationNotice";
import { authService } from "../../services/authService";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check if we should show verification notice from route state
  useEffect(() => {
    const state = location.state as any;
    if (state?.showEmailVerification && state?.email) {
      setUnverifiedEmail(state.email);
      setShowVerificationNotice(true);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("🔐 Starting login attempt for:", email);

      // Attempt login directly - let authService handle verification
      await authService.login(email, password);

      // If we get here, login was successful and user is verified
      const loggedInUser = authService.getUser();
      console.log("✅ Login successful, user:", loggedInUser);

      let redirectPath = "/dashboard";
      if (loggedInUser) {
        redirectPath = authService.getDashboardByRole(loggedInUser.role);
      }

      // Redirect to intended page or role-based dashboard
      const from = location.state?.from?.pathname || redirectPath;
      console.log("🔄 Redirecting to:", from);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof Error) {
        if (error.message === "EMAIL_NOT_VERIFIED") {
          console.log("🚫 Email not verified, showing verification notice");
          // Show verification notice for unverified users
          setUnverifiedEmail(email);
          setShowVerificationNotice(true);
        } else {
          setError(error.message);
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseVerificationNotice = () => {
    setShowVerificationNotice(false);
    setUnverifiedEmail("");
  };

  const handleVerificationComplete = () => {
    // Refresh the page or attempt login again
    window.location.reload();
  };

  return (
    <>
      {showVerificationNotice && (
        <EmailVerificationNotice
          email={unverifiedEmail}
          onClose={handleCloseVerificationNotice}
          onVerificationComplete={handleVerificationComplete}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white flex flex-col justify-center py-8 sm:px-6 lg:px-8">
        <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Header Section - Reduced title size and updated colors */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="h-32 w-32 rounded-3xl bg-gradient-to-r from-red-600 to-pink-600 flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <svg
                    className="h-16 w-16 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H5C3.89,1 3,1.89 3,3V21A2,2 0 0,0 5,23H19A2,2 0 0,0 21,21V9M19,9H14V4H15.5L19,7.5V9Z" />
                  </svg>
                </div>
                <div className="absolute -top-3 -right-3 h-8 w-8 bg-green-400 rounded-full border-4 border-white animate-pulse flex items-center justify-center">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                  Welcome Back
                </h1>
                <div className="mt-6 space-y-4">
                  <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Sign in to continue your life-saving journey
                  </p>
                  <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Access your donor profile, view donation history, and help
                    save lives in your community
                  </p>
                </div>
              </div>

              {/* Key Features Section - Updated colors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Save Lives
                  </h3>
                  <p className="text-gray-600">
                    Your blood donation can save up to 3 lives and make a real
                    difference
                  </p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Track Impact
                  </h3>
                  <p className="text-gray-600">
                    Monitor your donation history and see the impact you've made
                  </p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-2xl mb-4">
                    <svg
                      className="w-8 h-8 text-pink-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Join Community
                  </h3>
                  <p className="text-gray-600">
                    Connect with fellow donors and participate in community
                    events
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3 text-base text-gray-500 mt-8">
                <span>New to our platform?</span>
                <Link
                  to="/register"
                  className="font-semibold text-red-600 hover:text-red-500 transition-colors duration-200 underline decoration-2 underline-offset-4 text-lg"
                >
                  Create your account →
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area - Login Form and Info Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Login Form Card */}
            <div className="order-2 lg:order-1">
              <div className="bg-white/90 backdrop-blur-sm py-12 px-8 shadow-2xl rounded-3xl border border-white/20 sm:px-12">
                {/* Welcome Message */}
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Sign In
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Welcome back! Enter your credentials to access your donor
                    dashboard and continue making a difference.
                  </p>
                </div>

                {/* Error Alert - Updated colors */}
                {error && (
                  <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                          <svg
                            className="h-5 w-5 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-semibold text-red-800 mb-1">
                          Authentication Error
                        </h3>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Email Field - Updated focus colors */}
                  <div className="space-y-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-800 mb-3"
                    >
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-6 w-6 text-gray-400 group-focus-within:text-red-500 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full pl-14 pr-4 py-5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-base bg-gray-50 focus:bg-white"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Password Field - Updated focus colors */}
                  <div className="space-y-3">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-800 mb-3"
                    >
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-6 w-6 text-gray-400 group-focus-within:text-red-500 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full pl-14 pr-14 py-5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-base bg-gray-50 focus:bg-white"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                      >
                        {showPassword ? (
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Options Row */}
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded-lg"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-3 block text-base font-medium text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-base">
                      <Link
                        to="/forgot-password"
                        className="font-semibold text-red-600 hover:text-red-500 transition-colors duration-200 underline decoration-2 underline-offset-2"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  {/* Sign In Button - Updated to red gradient */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full flex justify-center items-center px-8 py-5 border border-transparent rounded-2xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-5">
                        {isLoading ? (
                          <svg
                            className="animate-spin w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                          </svg>
                        )}
                      </span>
                      {isLoading ? "Signing in..." : "Sign In to Your Account"}
                    </button>
                  </div>
                </form>

                {/* Divider - Modern design */}
                <div className="mt-10">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">
                        New to our platform?
                      </span>
                    </div>
                  </div>

                  {/* Register Button - Updated hover colors */}
                  <div className="mt-8">
                    <Link
                      to="/register"
                      className="w-full flex justify-center items-center py-4 px-6 border-2 border-gray-200 rounded-2xl shadow-sm bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <svg
                        className="w-6 h-6 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Create your account
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Panel - Updated colors */}
            <div className="order-1 lg:order-2 space-y-8">
              {/* Important Note - Updated to red theme */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-3xl p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-red-800 mb-4">
                      Account Verification Required
                    </h3>
                    <div className="text-base text-red-700 space-y-3 leading-relaxed">
                      <p>
                        You must verify your email address before accessing your
                        account. This ensures the security of your donor profile
                        and helps us maintain accurate records.
                      </p>
                      <p>
                        After registration, check your email inbox for the
                        verification link. The verification email may take a few
                        minutes to arrive.
                      </p>
                      <div className="bg-red-100 rounded-xl p-4 mt-4">
                        <p className="font-medium text-red-800">Pro tip:</p>
                        <p className="text-sm">
                          Check your spam folder if you don't see the
                          verification email in your inbox.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-green-800 mb-4">
                      Your Data is Secure
                    </h3>
                    <div className="text-base text-green-700 space-y-3 leading-relaxed">
                      <p>
                        We use industry-standard encryption to protect your
                        personal information and medical data.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-600 mr-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>SSL encryption for all data transfers</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-600 mr-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>HIPAA-compliant data handling</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-600 mr-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Regular security audits and updates</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donation Impact Stats - Updated colors */}
              <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 rounded-3xl p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-pink-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-pink-800 mb-4">
                    Community Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-pink-700">
                        2,547
                      </div>
                      <div className="text-sm text-pink-600">Lives Saved</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-pink-700">
                        849
                      </div>
                      <div className="text-sm text-pink-600">Active Donors</div>
                    </div>
                  </div>
                  <p className="text-base text-pink-700 mt-4 leading-relaxed">
                    Join our community of heroes who are making a real
                    difference every day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links - Updated hover colors */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex justify-center space-x-12 text-base">
              <Link
                to="/about"
                className="text-gray-500 hover:text-red-600 transition-colors font-medium"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-gray-500 hover:text-red-600 transition-colors font-medium"
              >
                Contact
              </Link>
              <Link
                to="/help"
                className="text-gray-500 hover:text-red-600 transition-colors font-medium"
              >
                Help Center
              </Link>
              <Link
                to="/privacy"
                className="text-gray-500 hover:text-red-600 transition-colors font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-500 hover:text-red-600 transition-colors font-medium"
              >
                Terms of Service
              </Link>
            </div>
            <div className="text-center mt-6">
              <p className="text-gray-400">
                © 2025 Blood Donation Platform. Making a difference, one
                donation at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
