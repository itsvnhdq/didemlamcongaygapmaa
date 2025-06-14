import React, { useEffect, useState } from "react";
import { authService, UserRole } from "../../services/authService";

interface EmailVerificationNoticeProps {
  email: string;
  onClose: () => void;
  onVerificationComplete?: () => void;
}

const EmailVerificationNotice: React.FC<EmailVerificationNoticeProps> = ({
  email,
  onClose,
  onVerificationComplete,
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");
  const [cooldownTime, setCooldownTime] = useState(0);
  const [debugInfo, setDebugInfo] = useState("");

  // Check if current user is admin/staff and auto-close if so
  useEffect(() => {
    const currentUser = authService.getUser();
    console.log("EmailVerificationNotice - Current user:", currentUser);

    if (
      currentUser &&
      (currentUser.role === UserRole.Admin ||
        currentUser.role === UserRole.Staff)
    ) {
      console.log(
        "Admin/Staff user detected, verification notice not needed - auto-closing"
      );
      if (onVerificationComplete) {
        onVerificationComplete();
      }
      onClose();
      return;
    }

    // Initialize cooldown timer
    const updateCooldown = () => {
      const remaining = authService.getRemainingCooldownTime();
      setCooldownTime(remaining);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);

    return () => clearInterval(interval);
  }, [onClose, onVerificationComplete]);

  const handleResendEmail = async () => {
    console.log("Resend email clicked for:", email);

    if (!authService.canResendVerificationEmail()) {
      const errorMsg = `Please wait ${Math.ceil(
        cooldownTime / 60
      )} minutes before requesting another email.`;
      setResendError(errorMsg);
      console.log("Resend blocked by cooldown:", errorMsg);
      return;
    }

    setIsResending(true);
    setResendError("");
    setResendSuccess(false);
    setDebugInfo("Attempting to send verification email...");

    try {
      console.log("Calling authService.resendVerificationEmail...");
      await authService.resendVerificationEmail(email);

      setResendSuccess(true);
      setDebugInfo("Email sent successfully!");
      console.log("✅ Resend successful");

      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 10000);
    } catch (error) {
      console.error("❌ Resend failed:", error);

      let errorMessage = "Failed to resend verification email";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setResendError(errorMessage);
      setDebugInfo(`Error: ${errorMessage}`);
    } finally {
      setIsResending(false);
    }
  };

  const formatCooldownTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const handleContinue = () => {
    console.log("Continue clicked, closing verification notice");
    if (onVerificationComplete) {
      onVerificationComplete();
    }
    onClose();
  };

  const canResend = authService.canResendVerificationEmail() && !isResending;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative p-8 bg-white w-full max-w-md m-auto rounded-lg shadow-lg">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Email Verification Required
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Your email address <span className="font-medium">{email}</span>{" "}
            needs to be verified before you can access the system.
          </p>

          {/* Debug Information */}
          {process.env.NODE_ENV === "development" && debugInfo && (
            <div className="mb-4 p-2 bg-gray-100 border rounded text-xs text-left">
              <strong>Debug:</strong> {debugInfo}
            </div>
          )}

          {resendSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-md">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-600 mr-2"
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
                <p className="text-sm text-green-700">
                  Verification email sent successfully! Please check your inbox
                  and spam folder.
                </p>
              </div>
            </div>
          )}

          {resendError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-red-600 mr-2"
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
                <p className="text-sm text-red-700">{resendError}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={!canResend || cooldownTime > 0}
              className={`w-full inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md transition-all duration-200 ${
                canResend && cooldownTime === 0
                  ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  : "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
              }`}
            >
              {isResending ? (
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
              ) : cooldownTime > 0 ? (
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Resend in {formatCooldownTime(cooldownTime)}
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
                  Resend Verification Email
                </>
              )}
            </button>

            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-blue-500 mr-1"
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
                You can only request a new verification email once every 5
                minutes
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            >
              Continue to Dashboard
            </button>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600">
              <strong>What to do next:</strong>
            </p>
            <ul className="text-xs text-gray-600 mt-1 space-y-1">
              <li>• Check your email inbox for the verification link</li>
              <li>• Check your spam/junk folder if you don't see it</li>
              <li>• Click the verification link to activate your account</li>
              <li>• Refresh this page after verifying</li>
            </ul>
          </div>

          {/* Debugging section for development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-left">
              <strong>Debug Info:</strong>
              <div>Email: {email}</div>
              <div>Can Resend: {canResend ? "Yes" : "No"}</div>
              <div>Cooldown: {cooldownTime}s</div>
              <div>
                Is Authenticated:{" "}
                {authService.getIsAuthenticated() ? "Yes" : "No"}
              </div>
              <div>Current User: {JSON.stringify(authService.getUser())}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationNotice;
