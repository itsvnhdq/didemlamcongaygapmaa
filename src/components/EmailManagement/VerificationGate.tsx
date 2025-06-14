import React, { useEffect, useState } from "react";
import { authService, UserRole } from "../../services/authService";
import EmailVerificationNotice from "./EmailVerificationNotice";

interface VerificationGateProps {
  children: React.ReactNode;
}

const VerificationGate: React.FC<VerificationGateProps> = ({ children }) => {
  const [user, setUser] = useState(authService.getUser());
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.subscribe((newUser) => {
      setUser(newUser);

      // Check if user needs verification
      if (
        newUser &&
        newUser.role !== UserRole.Admin &&
        newUser.role !== UserRole.Staff &&
        !newUser.isEmailVerified
      ) {
        console.log(
          "🚨 VerificationGate: Unverified user detected, showing notice"
        );
        setShowVerificationNotice(true);
      } else {
        setShowVerificationNotice(false);
      }
    });

    return unsubscribe;
  }, []);

  // Don't show children if user needs verification
  if (showVerificationNotice && user) {
    return (
      <EmailVerificationNotice
        email={user.email}
        onClose={() => {
          // Force logout when closing verification notice
          authService.logout();
          window.location.href = "/login";
        }}
        onVerificationComplete={() => {
          setShowVerificationNotice(false);
        }}
      />
    );
  }

  return <>{children}</>;
};

export default VerificationGate;
