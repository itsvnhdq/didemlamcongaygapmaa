import React, { useEffect, useState } from "react";
import { authService, User, UserRole } from "../../services/authService";

const VerificationBanner: React.FC = () => {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isResending, setIsResending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = authService.subscribe((newUser) => {
      setUser(newUser);
    });

    // Update cooldown timer
    const updateCooldown = () => {
      const remaining = authService.getRemainingCooldownTime();
      setCooldownTime(remaining);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Don't show for admin/staff or verified users
  if (
    !user ||
    user.role === UserRole.Admin ||
    user.role === UserRole.Staff ||
    user.isEmailVerified
  ) {
    return null;
  }

  const handleResendEmail = async () => {
    if (!authService.canResendVerificationEmail()) {
      setError(
        `Please wait ${Math.ceil(
          cooldownTime / 60
        )} minutes before requesting another email.`
      );
      return;
    }

    setIsResending(true);
    setError("");
    setShowSuccess(false);

    try {
      await authService.resendVerificationEmail();
      setShowSuccess(true);

      // Auto-hide success message after 8 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 8000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to resend verification email");
      }
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

  if (isMinimized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-lg transition-colors"
          title="Show verification notice"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </button>
      </div>
    );
  }

  const canResend = authService.canResendVerificationEmail() && !isResending;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <div className="text-sm text-yellow-700">
              <strong>Email verification required:</strong> Please verify your
              email address ({user?.email}) to access all system features.
            </div>

            {showSuccess && (
              <div className="mt-1 text-sm text-green-700 font-medium">
                ✓ Verification email sent! Check your inbox and spam folder.
              </div>
            )}

            {error && (
              <div className="mt-1 text-sm text-red-700">✗ {error}</div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleResendEmail}
            disabled={!canResend || cooldownTime > 0}
            className={`text-sm px-3 py-1 rounded-md transition-colors ${
              canResend && cooldownTime === 0
                ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isResending ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin w-3 h-3 mr-1"
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
              </span>
            ) : cooldownTime > 0 ? (
              `Resend in ${formatCooldownTime(cooldownTime)}`
            ) : (
              "Resend Email"
            )}
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="text-yellow-400 hover:text-yellow-600 p-1"
            title="Minimize notice"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationBanner;
