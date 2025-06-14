import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../App";
import { authService } from "../../services/authService";

const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneCountryCode: "+84", // Default to Vietnam
    phone: "",
    address: "",
    citizenId: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactCountryCode: "+84", // Default to Vietnam
    emergencyContactPhone: "",
    medicalCondition: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [awaitingEmailVerification, setAwaitingEmailVerification] =
    useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  // Add missing state variables for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Special handling for date of birth formatting
    if (name === "dateOfBirth") {
      // Format as dd/mm/yyyy while typing
      let formattedValue = value.replace(/\D/g, ""); // Remove non-digits
      if (formattedValue.length >= 2) {
        formattedValue =
          formattedValue.substring(0, 2) + "/" + formattedValue.substring(2);
      }
      if (formattedValue.length >= 5) {
        formattedValue =
          formattedValue.substring(0, 5) + "/" + formattedValue.substring(5, 9);
      }

      setFormData({
        ...formData,
        [name]: formattedValue,
      });
      return;
    }

    // Special handling for Vietnamese phone numbers - remove leading 0
    if (
      (name === "phone" || name === "emergencyContactPhone") &&
      type === "tel"
    ) {
      const countryCodeField =
        name === "phone" ? "phoneCountryCode" : "emergencyContactCountryCode";
      const currentCountryCode =
        name === "phone"
          ? formData.phoneCountryCode
          : formData.emergencyContactCountryCode;

      let phoneValue = value;

      // If it's a Vietnamese number (+84) and starts with 0, remove the leading 0
      if (currentCountryCode === "+84" && phoneValue.startsWith("0")) {
        phoneValue = phoneValue.substring(1);
      }

      setFormData({
        ...formData,
        [name]: phoneValue,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Country codes data
  const countryCodes = [
    { code: "+84", country: "Vietnam", flag: "🇻🇳" },
    { code: "+1", country: "US/CA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+82", country: "Korea", flag: "🇰🇷" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾" },
    { code: "+66", country: "Thailand", flag: "🇹🇭" },
    { code: "+62", country: "Indonesia", flag: "🇮🇩" },
    { code: "+63", country: "Philippines", flag: "🇵🇭" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
  ];

  // Updated password validation to match backend schema
  const validate = (step?: number) => {
    const newErrors: Record<string, string> = {};
    const validateStep = step || currentStep;

    // Step 1: Personal Information
    if (validateStep === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else {
        // Updated phone validation for international numbers
        const phoneDigits = formData.phone.replace(/\D/g, "");
        if (formData.phoneCountryCode === "+84") {
          // Vietnam phone validation (9 digits after removing leading 0, or 10 digits if no leading 0 was removed)
          if (!/^[0-9]{8,9}$/.test(phoneDigits)) {
            newErrors.phone =
              "Please enter a valid Vietnamese phone number (8-9 digits without leading 0)";
          }
        } else if (formData.phoneCountryCode === "+1") {
          // US/Canada phone validation (10 digits)
          if (!/^[0-9]{10}$/.test(phoneDigits)) {
            newErrors.phone =
              "Please enter a valid US/Canada phone number (10 digits)";
          }
        } else {
          // General international phone validation (7-15 digits)
          if (!/^[0-9]{7,15}$/.test(phoneDigits)) {
            newErrors.phone = "Please enter a valid phone number (7-15 digits)";
          }
        }
      }

      if (!formData.address.trim()) newErrors.address = "Address is required";

      if (!formData.citizenId.trim()) {
        newErrors.citizenId = "Citizen ID is required";
      } else if (!/^\d{12}$/.test(formData.citizenId.replace(/\D/g, ""))) {
        newErrors.citizenId = "Please enter a valid 12-digit citizen ID";
      }

      // Fix: Properly call the date validation function
      if (!formData.dateOfBirth.trim()) {
        newErrors.dateOfBirth = "Date of birth is required";
      } else {
        const dobError = validateDateOfBirth(formData.dateOfBirth);
        if (dobError) {
          newErrors.dateOfBirth = dobError;
        }
      }
    }

    // Step 2: Account Security
    if (validateStep === 2) {
      // Updated password validation to match backend schema
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else {
        // Check minimum length
        if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters long";
        }
        // Check maximum length
        else if (formData.password.length > 50) {
          newErrors.password = "Password must not exceed 50 characters";
        }
        // Check for strong password requirements
        else {
          const hasLowercase = /[a-z]/.test(formData.password);
          const hasUppercase = /[A-Z]/.test(formData.password);
          const hasNumbers = /\d/.test(formData.password);
          const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
            formData.password
          );

          if (!hasLowercase) {
            newErrors.password =
              "Password must contain at least one lowercase letter";
          } else if (!hasUppercase) {
            newErrors.password =
              "Password must contain at least one uppercase letter";
          } else if (!hasNumbers) {
            newErrors.password = "Password must contain at least one number";
          } else if (!hasSymbols) {
            newErrors.password =
              "Password must contain at least one special character";
          }
        }
      }

      // Updated confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
      } else {
        if (formData.confirmPassword.length < 8) {
          newErrors.confirmPassword =
            "Confirm password must be at least 8 characters long";
        } else if (formData.confirmPassword.length > 50) {
          newErrors.confirmPassword =
            "Confirm password must not exceed 50 characters";
        } else {
          const hasLowercase = /[a-z]/.test(formData.confirmPassword);
          const hasUppercase = /[A-Z]/.test(formData.confirmPassword);
          const hasNumbers = /\d/.test(formData.confirmPassword);
          const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
            formData.confirmPassword
          );

          if (!hasLowercase) {
            newErrors.confirmPassword =
              "Confirm password must contain at least one lowercase letter";
          } else if (!hasUppercase) {
            newErrors.confirmPassword =
              "Confirm password must contain at least one uppercase letter";
          } else if (!hasNumbers) {
            newErrors.confirmPassword =
              "Confirm password must contain at least one number";
          } else if (!hasSymbols) {
            newErrors.confirmPassword =
              "Confirm password must contain at least one special character";
          } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
          }
        }
      }
    }

    // Step 3: Emergency Contact
    if (validateStep === 3) {
      if (!formData.emergencyContactName.trim()) {
        newErrors.emergencyContactName = "Emergency contact name is required";
      }

      if (!formData.emergencyContactPhone.trim()) {
        newErrors.emergencyContactPhone = "Emergency contact phone is required";
      } else {
        // Updated emergency contact phone validation
        const phoneDigits = formData.emergencyContactPhone.replace(/\D/g, "");
        if (formData.emergencyContactCountryCode === "+84") {
          // Vietnam phone validation (8-9 digits after removing leading 0)
          if (!/^[0-9]{8,9}$/.test(phoneDigits)) {
            newErrors.emergencyContactPhone =
              "Please enter a valid Vietnamese phone number (8-9 digits without leading 0)";
          }
        } else if (formData.emergencyContactCountryCode === "+1") {
          // US/Canada phone validation
          if (!/^[0-9]{10}$/.test(phoneDigits)) {
            newErrors.emergencyContactPhone =
              "Please enter a valid US/Canada phone number (10 digits)";
          }
        } else {
          // General international phone validation
          if (!/^[0-9]{7,15}$/.test(phoneDigits)) {
            newErrors.emergencyContactPhone =
              "Please enter a valid phone number (7-15 digits)";
          }
        }
      }
    }

    // Step 4: Terms and Conditions
    if (validateStep === 4) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Move validateDateOfBirth function before it's used
  const validateDateOfBirth = (dateOfBirth: string): string | null => {
    if (!dateOfBirth.trim()) {
      return "Date of birth is required";
    }

    // Check if the format matches DD/MM/YYYY
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dateOfBirth)) {
      return "Please enter date in DD/MM/YYYY format";
    }

    // Parse the date parts
    const [day, month, year] = dateOfBirth.split("/").map(Number);

    // Basic range checks
    if (month < 1 || month > 12) {
      return "Please enter a valid month (01-12)";
    }

    if (day < 1 || day > 31) {
      return "Please enter a valid day (01-31)";
    }

    if (year < 1960 || year > new Date().getFullYear()) {
      return "Please enter a valid year, from 1960 to the current year";
    }

    // Create date object to validate the actual date
    const date = new Date(year, month - 1, day);

    // Check if the date is valid (handles leap years, days per month, etc.)
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return "Please enter a valid date";
    }

    // Check if the person is at least 13 years old (reasonable minimum age)
    const today = new Date();
    const minAge = 13;
    const minBirthDate = new Date(
      today.getFullYear() - minAge,
      today.getMonth(),
      today.getDate()
    );

    if (date > minBirthDate) {
      return `You must be at least ${minAge} years old to register`;
    }

    // Check if the date is not in the future
    if (date > today) {
      return "Date of birth cannot be in the future";
    }

    return null; // No errors
  };

  // Add password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    Object.values(checks).forEach((check) => {
      if (check) strength += 1;
    });

    return {
      score: strength,
      checks,
      label: strength < 3 ? "Weak" : strength < 5 ? "Medium" : "Strong",
      color: strength < 3 ? "red" : strength < 5 ? "yellow" : "green",
    };
  };

  const passwordStrength = formData.password
    ? getPasswordStrength(formData.password)
    : null;
  const confirmPasswordStrength = formData.confirmPassword
    ? getPasswordStrength(formData.confirmPassword)
    : null;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNext = () => {
    if (validate()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all steps before submission
    let allValid = true;
    for (let step = 1; step <= 4; step++) {
      if (!validate(step)) {
        allValid = false;
        break;
      }
    }

    if (allValid) {
      setIsSubmitting(true);

      try {
        // Convert DD/MM/YYYY to ISO8601 format (YYYY-MM-DD)
        const convertDateToISO = (dateString: string) => {
          const [day, month, year] = dateString.split("/");
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        };

        // Prepare user data for API call with correct field names and types
        // Split name into firstName and lastName (simple split by last space)
        const nameParts = formData.name.trim().split(" ");
        const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : formData.name;
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

        const userData = {
          email: formData.email,
          password: formData.password,
          firstName: firstName,
          lastName: lastName,
          phone: `${formData.phoneCountryCode}${formData.phone}`,
          citizenId: formData.citizenId,
          dateOfBirth: convertDateToISO(formData.dateOfBirth),
          emergencyContact: `${formData.emergencyContactName} (${formData.emergencyContactCountryCode}${formData.emergencyContactPhone})`,
          medicalConditions: formData.medicalCondition || "",
          address: formData.address,
        };

        console.log("Sending user data:", userData); // Debug log

        // Call the actual registration API
        await authService.register(userData);

        // Registration successful - set up email verification waiting
        setUserEmail(formData.email);
        setRegistrationSuccess(true);
        setAwaitingEmailVerification(true);
        setIsSubmitting(false);

        // Don't automatically redirect - let user verify email first
      } catch (error) {
        setIsSubmitting(false);
        console.error("Registration error:", error); // Debug log

        let errorMessage = "Registration failed. Please try again later.";

        if (error instanceof Error) {
          errorMessage = error.message;

          // Handle specific error cases with more user-friendly messages
          if (error.message.includes("email configuration")) {
            errorMessage =
              "There is a server configuration issue. Your account may have been created but email verification is not working. Please contact support.";
          } else if (error.message.includes("email service")) {
            errorMessage =
              "Email service is temporarily unavailable. Your account may have been created. Please try logging in or contact support.";
          } else if (error.message.includes("connect to server")) {
            errorMessage =
              "Cannot connect to the server. Please check your internet connection and try again.";
          }
        }

        setErrors({
          submit: errorMessage,
        });
      }
    }
  };

  // Add resend email functionality
  const handleResendEmail = async () => {
    if (resendCooldown > 0 || isResendingEmail) return;

    setIsResendingEmail(true);
    try {
      await authService.resendVerificationEmail(userEmail);

      // Start cooldown timer (60 seconds)
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      alert("Failed to resend verification email. Please try again later.");
    } finally {
      setIsResendingEmail(false);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", description: "Basic information" },
    { number: 2, title: "Security", description: "Account security" },
    { number: 3, title: "Emergency Contact", description: "Emergency details" },
    { number: 4, title: "Review", description: "Terms & review" },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 border ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="flex">
                  <select
                    name="phoneCountryCode"
                    value={formData.phoneCountryCode}
                    onChange={handleChange}
                    className="flex-shrink-0 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`flex-1 px-4 py-3 border ${
                      errors.phone ? "border-red-300" : "border-gray-300"
                    } rounded-r-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                    placeholder={
                      formData.phoneCountryCode === "+84"
                        ? "Enter your phone number (leading 0 will be removed)"
                        : "Enter your phone number"
                    }
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.phoneCountryCode === "+84"
                    ? "Enter your Vietnamese phone number (leading 0 will be automatically removed)"
                    : "Enter your phone number without the country code"}
                </p>
              </div>

              <div>
                <label
                  htmlFor="citizenId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Citizen ID Number
                </label>
                <input
                  id="citizenId"
                  name="citizenId"
                  type="text"
                  required
                  value={formData.citizenId}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 border ${
                    errors.citizenId ? "border-red-300" : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                  placeholder="Enter your 12-digit citizen ID"
                  maxLength={12}
                />
                {errors.citizenId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.citizenId}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="text"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-3 pr-12 border ${
                      errors.dateOfBirth ? "border-red-300" : "border-gray-300"
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dateOfBirth}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter your date of birth in DD/MM/YYYY format (e.g.,
                  15/03/1990)
                </p>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 border ${
                    errors.address ? "border-red-300" : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                  placeholder="Enter your address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Account Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-3 pr-12 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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

                {/* Password Strength Indicator */}
                {formData.password && passwordStrength && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Password Strength:</span>
                      <span
                        className={`font-medium ${
                          passwordStrength.color === "red"
                            ? "text-red-600"
                            : passwordStrength.color === "yellow"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          passwordStrength.color === "red"
                            ? "bg-red-500"
                            : passwordStrength.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <div className="grid grid-cols-1 gap-1">
                        <div
                          className={`flex items-center ${
                            passwordStrength.checks.length
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="mr-1">
                            {passwordStrength.checks.length ? "✓" : "○"}
                          </span>
                          At least 8 characters
                        </div>
                        <div
                          className={`flex items-center ${
                            passwordStrength.checks.lowercase
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="mr-1">
                            {passwordStrength.checks.lowercase ? "✓" : "○"}
                          </span>
                          One lowercase letter
                        </div>
                        <div
                          className={`flex items-center ${
                            passwordStrength.checks.uppercase
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="mr-1">
                            {passwordStrength.checks.uppercase ? "✓" : "○"}
                          </span>
                          One uppercase letter
                        </div>
                        <div
                          className={`flex items-center ${
                            passwordStrength.checks.numbers
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="mr-1">
                            {passwordStrength.checks.numbers ? "✓" : "○"}
                          </span>
                          One number
                        </div>
                        <div
                          className={`flex items-center ${
                            passwordStrength.checks.symbols
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="mr-1">
                            {passwordStrength.checks.symbols ? "✓" : "○"}
                          </span>
                          One special character
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-3 pr-12 border ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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

                {/* Confirm Password Strength Indicator */}
                {formData.confirmPassword && confirmPasswordStrength && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Password Strength:</span>
                      <span
                        className={`font-medium ${
                          confirmPasswordStrength.color === "red"
                            ? "text-red-600"
                            : confirmPasswordStrength.color === "yellow"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {confirmPasswordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          confirmPasswordStrength.color === "red"
                            ? "bg-red-500"
                            : confirmPasswordStrength.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${
                            (confirmPasswordStrength.score / 5) * 100
                          }%`,
                        }}
                      ></div>
                    </div>

                    {/* Password Match Indicator */}
                    {formData.password && formData.confirmPassword && (
                      <div className="mt-2">
                        <div
                          className={`flex items-center text-xs ${
                            formData.password === formData.confirmPassword
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <span className="mr-1">
                            {formData.password === formData.confirmPassword
                              ? "✓"
                              : "✗"}
                          </span>
                          {formData.password === formData.confirmPassword
                            ? "Passwords match"
                            : "Passwords do not match"}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Emergency Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="emergencyContactName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Emergency Contact Name
                </label>
                <input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  type="text"
                  required
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 border ${
                    errors.emergencyContactName
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                  placeholder="Enter emergency contact name"
                />
                {errors.emergencyContactName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.emergencyContactName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="emergencyContactPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Emergency Contact Phone
                </label>
                <div className="flex">
                  <select
                    name="emergencyContactCountryCode"
                    value={formData.emergencyContactCountryCode}
                    onChange={handleChange}
                    className="flex-shrink-0 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    type="tel"
                    required
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    className={`flex-1 px-4 py-3 border ${
                      errors.emergencyContactPhone
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-r-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                    placeholder={
                      formData.emergencyContactCountryCode === "+84"
                        ? "Enter phone number (leading 0 will be removed)"
                        : "Enter emergency contact phone"
                    }
                  />
                </div>
                {errors.emergencyContactPhone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.emergencyContactPhone}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.emergencyContactCountryCode === "+84"
                    ? "Enter Vietnamese phone number (leading 0 will be automatically removed)"
                    : "Enter the phone number without the country code"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="medicalCondition"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Medical Condition{" "}
                  <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  id="medicalCondition"
                  name="medicalCondition"
                  rows={3}
                  value={formData.medicalCondition}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                  placeholder="Please describe any medical conditions, allergies, or important health information..."
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Review & Terms
            </h3>

            {/* Registration Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                Registration Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {formData.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {formData.email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span>{" "}
                  {formData.phoneCountryCode} {formData.phone}
                </div>
                <div>
                  <span className="font-medium">Date of Birth:</span>{" "}
                  {formData.dateOfBirth}
                </div>
                <div>
                  <span className="font-medium">Citizen ID:</span>{" "}
                  {formData.citizenId}
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Address:</span>{" "}
                  {formData.address}
                </div>
                <div>
                  <span className="font-medium">Emergency Contact:</span>{" "}
                  {formData.emergencyContactName}
                </div>
                <div>
                  <span className="font-medium">Emergency Phone:</span>{" "}
                  {formData.emergencyContactCountryCode}{" "}
                  {formData.emergencyContactPhone}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={`h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1 ${
                    errors.agreeToTerms ? "border-red-300" : ""
                  }`}
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-3 block text-sm text-gray-900"
                >
                  I agree to the{" "}
                  <a
                    href="/termsandconditions"
                    className="font-medium text-red-600 hover:text-red-500 transition-colors"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacypolicy"
                    className="font-medium text-red-600 hover:text-red-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-2 ml-7 text-sm text-red-600">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (registrationSuccess && awaitingEmailVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white flex flex-col justify-center py-16 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-12 border border-white/20">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 mb-8 shadow-lg">
                <svg
                  className="h-10 w-10 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                Check Your Email!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We've sent a verification email to{" "}
                <span className="font-semibold text-blue-600">{userEmail}</span>
              </p>

              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-yellow-600"
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
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Email Verification Required
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Please check your email inbox and click the verification link
                  to activate your account before you can log in.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3 text-gray-400"
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
                    Expires in 24 hours
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Check spam folder
                  </div>
                  <div className="flex items-center text-red-600">
                    <svg
                      className="w-5 h-5 mr-3 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    Login disabled until verified
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleResendEmail}
                  disabled={isResendingEmail || resendCooldown > 0}
                  className="inline-flex items-center px-8 py-4 border-2 border-gray-200 shadow-sm text-base font-semibold rounded-2xl text-gray-700 bg-white hover:bg-gray-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResendingEmail ? (
                    <>
                      <svg
                        className="animate-spin w-5 h-5 mr-3"
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
                  ) : resendCooldown > 0 ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-3"
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
                      Resend in {resendCooldown}s
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-3"
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
                      Resend Email
                    </>
                  )}
                </button>

                <div className="pt-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-10 py-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Go to Login Page
                    <svg
                      className="w-5 h-5 ml-3"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Registration Successful!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your account has been created successfully. You will be redirected
            to the login page shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-white flex flex-col justify-center py-16 sm:px-6 lg:px-8">
      {/* Header Section - Updated colors */}
      <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <svg
                  className="h-12 w-12 text-white"
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
              </div>
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
            Join Our Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
            Create your account to start saving lives and making a difference in
            your community
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="font-semibold text-red-600 hover:text-red-500 transition-colors duration-200 underline decoration-2 underline-offset-2"
            >
              Sign in here
            </Link>
          </div>
        </div>

        {/* Step Indicator - Updated colors */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-300 ${
                        currentStep >= step.number
                          ? "bg-gradient-to-r from-red-600 to-pink-600 border-red-600 text-white shadow-lg transform scale-110"
                          : "border-gray-300 text-gray-500 bg-white shadow-sm"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <span className="text-sm font-bold">{step.number}</span>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <p
                        className={`text-sm font-semibold transition-colors ${
                          currentStep >= step.number
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-6 mt-6 rounded-full transition-colors duration-300 ${
                        currentStep > step.number
                          ? "bg-gradient-to-r from-red-600 to-pink-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Card - Enhanced spacious design */}
      <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className="bg-white/90 backdrop-blur-sm py-12 px-8 shadow-2xl rounded-3xl border border-white/20 sm:px-16">
          <form className="space-y-10" onSubmit={handleSubmit}>
            {/* Error Alert - Updated colors */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
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
                      Registration Error
                    </h3>
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Content */}
            {renderStepContent()}

            {/* Navigation Buttons - Updated colors */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center px-8 py-4 border-2 rounded-2xl text-base font-semibold transition-all duration-300 ${
                  currentStep === 1
                    ? "text-gray-400 cursor-not-allowed bg-gray-50 border-gray-200"
                    : "text-gray-700 hover:bg-gray-50 hover:border-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-8 py-4 border border-transparent rounded-2xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Next Step
                  <svg
                    className="w-5 h-5 ml-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-10 py-4 border border-transparent rounded-2xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <svg
                        className="w-5 h-5 ml-3"
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
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Important Note - Updated to red theme */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-red-600"
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
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">
                    Important Information
                  </h3>
                  <div className="text-red-700 space-y-2">
                    <p className="font-medium">
                      This registration is for member accounts only.
                    </p>
                    <p>
                      Staff accounts can only be created by existing
                      administrators. Contact to administrators for more.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
