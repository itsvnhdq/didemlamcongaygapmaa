import React, { useEffect, useState } from "react";
import { authService, User } from "../../services/authService";

const VerificationNotice: React.FC = () => {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isResending, setIsResending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.subscribe((newUser) => {
      setUser(newUser);
    });

    return unsubscribe;
  }, []);

  const handleResendEmail = async () => {
    setIsResending(true);
    setShowSuccess(false);
    try {
      await authService.resendVerificationEmail();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      alert("Failed to resend verification email. Please try again later.");
    } finally {
      setIsResending(false);
    }
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

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
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
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Email verification required:</strong> Please verify your
              email address ({user?.email}) to access all system features.
              {showSuccess && (
                <span className="ml-2 text-green-700 font-medium">
                  ✓ Verification email sent! Check your inbox.
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleResendEmail}
            disabled={isResending || showSuccess}
            className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending
              ? "Sending..."
              : showSuccess
              ? "Sent!"
              : "Resend Email"}
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

export default VerificationNotice;
