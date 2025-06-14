import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPasswordRedirect: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("forgot_password_token");
    if (token) {
      // Redirect to the actual reset password page with the token
      navigate(`/reset-password?forgot_password_token=${token}`, { replace: true });
    } else {
      // If no token, redirect to forgot password page
      navigate("/forgot-password", { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-2xl rounded-[2rem] border border-white/20 sm:px-10">
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
              Redirecting...
            </h2>
            <p className="text-gray-600">
              Please wait while we redirect you to the password reset page...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordRedirect;
