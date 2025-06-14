import React, { useState } from "react";
import { authService } from "../../services/authService";

const EmailVerificationTest: React.FC = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testResendEmail = async () => {
    if (!email) {
      setResult("Please enter an email address");
      return;
    }

    setIsLoading(true);
    setResult("Testing...");

    try {
      await authService.resendVerificationEmail(email);
      setResult("✅ Success! Email sent successfully.");
    } catch (error) {
      setResult(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const testApiEndpoints = async () => {
    if (!email) {
      setResult("Please enter an email address");
      return;
    }

    setIsLoading(true);
    setResult("Testing API endpoints...");

    const endpoints = [
      "http://localhost:5000/members/resend-email-verify-token",
      "http://localhost:5000/members/resend-verification",
      "http://localhost:5000/auth/resend-verification",
      "http://localhost:5000/users/resend-verification",
    ];

    let results = [];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        results.push(
          `${endpoint}: ${response.status} - ${JSON.stringify(data)}`
        );
      } catch (error) {
        results.push(
          `${endpoint}: Error - ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    setResult(results.join("\n\n"));
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white border rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Email Verification Test</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter email to test"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={testResendEmail}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Test Resend (Service)
          </button>

          <button
            onClick={testApiEndpoints}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Test API Endpoints
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Result:</label>
          <textarea
            value={result}
            readOnly
            rows={10}
            className="w-full px-3 py-2 border rounded-md bg-gray-50 font-mono text-sm"
          />
        </div>

        <div className="text-sm text-gray-600">
          <p>
            <strong>Current User:</strong>{" "}
            {JSON.stringify(authService.getUser())}
          </p>
          <p>
            <strong>Is Authenticated:</strong>{" "}
            {authService.getIsAuthenticated() ? "Yes" : "No"}
          </p>
          <p>
            <strong>Can Resend:</strong>{" "}
            {authService.canResendVerificationEmail() ? "Yes" : "No"}
          </p>
          <p>
            <strong>Cooldown Time:</strong>{" "}
            {authService.getRemainingCooldownTime()}s
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationTest;
