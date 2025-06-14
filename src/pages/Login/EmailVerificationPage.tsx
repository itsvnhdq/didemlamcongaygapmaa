import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/authService";

const EmailVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "failed" | "expired" | "invalid"
  >("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    try {
      // Check if user is already logged in
      const currentUser = authService.getUser();
      if (currentUser) {
        setIsLoggedIn(true);
        setUserEmail(currentUser.email || email || "");
      } else if (email) {
        setUserEmail(email);
      }

      if (!token) {
        setVerificationStatus("invalid");
        setErrorMessage("Verification token is missing.");
        return;
      }

      verifyEmail(token);
    } catch (error) {
      console.error("Error initializing verification page:", error);
      setVerificationStatus("failed");
      setErrorMessage(
        "An error occurred while initializing the verification process."
      );
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      await authService.verifyEmail(token);
      setVerificationStatus("success");

      // Get current user and redirect to appropriate dashboard
      const currentUser = authService.getUser();
      let redirectPath = "/dashboard";

      if (currentUser) {
        redirectPath = authService.getDashboardByRole(currentUser.role);
      }

      // Redirect based on user role
      setTimeout(() => {
        if (isLoggedIn && currentUser) {
          navigate(redirectPath, {
            state: {
              message:
                "Email verified successfully! You now have full access to the system.",
              type: "success",
            },
          });
        } else {
          navigate("/login", {
            state: {
              message: "Email verified successfully! You can now log in.",
              type: "success",
            },
          });
        }
      }, 3000);
    } catch (error) {
      console.error("Email verification failed:", error);

      if (error instanceof Error) {
        if (error.message.includes("expired")) {
          setVerificationStatus("expired");
          setErrorMessage(
            "The verification link has expired. Please request a new one."
          );
        } else if (error.message.includes("invalid")) {
          setVerificationStatus("invalid");
          setErrorMessage("Invalid verification token.");
        } else {
          setVerificationStatus("failed");
          setErrorMessage(error.message || "Email verification failed.");
        }
      } else {
        setVerificationStatus("failed");
        setErrorMessage("An unexpected error occurred during verification.");
      }
    }
  };

  const handleResendEmail = async () => {
    if (!userEmail) {
      alert("Email address not found. Please try registering again.");
      return;
    }

    setIsResendingEmail(true);
    try {
      await authService.resendVerificationEmail(userEmail);
      alert("Verification email sent successfully! Please check your inbox.");
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend verification email. Please try again later.";
      alert(errorMessage);
    } finally {
      setIsResendingEmail(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <svg
                className="animate-spin w-8 h-8 text-blue-600"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Email
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case "success":
        const currentUser = authService.getUser();
        const dashboardPath = currentUser
          ? authService.getDashboardByRole(currentUser.role)
          : "/dashboard";

        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              {isLoggedIn
                ? "Your email has been verified. You now have full access to the system."
                : "Your email has been verified. You can now log in to your account."}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              You will be redirected{" "}
              {isLoggedIn ? "to your dashboard" : "to the login page"} in a few
              seconds...
            </p>
            <Link
              to={isLoggedIn ? dashboardPath : "/login"}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              {isLoggedIn ? "Go to Dashboard" : "Go to Login Page"}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        );

      case "expired":
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Link Expired
            </h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>

            {userEmail && (
              <div className="mb-6">
                <button
                  onClick={handleResendEmail}
                  disabled={isResendingEmail}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResendingEmail ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4 mr-2"
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Send New Verification Email
                    </>
                  )}
                </button>
              </div>
            )}

            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
            >
              Register Again
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        );

      case "failed":
      case "invalid":
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>

            <div className="space-y-4">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                Register Again
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              <div>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-500 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
