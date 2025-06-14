import React, { useState } from "react";
import Sidebar from "../../Layout/Sidebar";

const EmergencyRequestPage: React.FC = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    bloodType: "",
    hospitalName: "",
    hospitalAddress: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    unitsNeeded: "1",
    urgency: "urgent",
    requiredBy: "",
    medicalCondition: "",
    additionalNotes: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim())
      newErrors.patientName = "Patient name is required";
    if (!formData.patientAge.trim())
      newErrors.patientAge = "Patient age is required";
    if (!formData.bloodType) newErrors.bloodType = "Blood type is required";
    if (!formData.hospitalName.trim())
      newErrors.hospitalName = "Hospital name is required";
    if (!formData.hospitalAddress.trim())
      newErrors.hospitalAddress = "Hospital address is required";
    if (!formData.contactName.trim())
      newErrors.contactName = "Contact name is required";

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    } else if (!/^\d{10}$/.test(formData.contactPhone.replace(/\D/g, ""))) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    if (!formData.unitsNeeded)
      newErrors.unitsNeeded = "Units needed is required";
    if (!formData.requiredBy)
      newErrors.requiredBy = "Required by date is required";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setRequestId("ER" + Math.floor(100000 + Math.random() * 900000)); // Generate a random request ID
      }, 1500);
    }
  };

  const getBloodTypeColor = (bloodType: string): string => {
    switch (bloodType) {
      case "A+":
        return "bg-red-500";
      case "A-":
        return "bg-red-400";
      case "B+":
        return "bg-blue-500";
      case "B-":
        return "bg-blue-400";
      case "AB+":
        return "bg-purple-500";
      case "AB-":
        return "bg-purple-400";
      case "O+":
        return "bg-green-500";
      case "O-":
        return "bg-green-400";
      default:
        return "bg-gray-500";
    }
  };

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case "critical":
        return "bg-red-600 text-white";
      case "urgent":
        return "bg-orange-500 text-white";
      case "standard":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 lg:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {!isSubmitted ? (
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                      <svg
                        className="h-10 w-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Emergency Blood Request
                  </h1>
                  <p className="text-xl text-red-100 max-w-2xl mx-auto">
                    Submit urgent blood requests for patients in critical need
                    with our streamlined emergency system
                  </p>
                </div>

                <div className="px-8 py-8">
                  {/* Emergency Alert */}
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-red-100 rounded-2xl flex items-center justify-center">
                          <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-red-800 mb-2">
                          Critical Emergency Notice
                        </h3>
                        <p className="text-sm text-red-700 leading-relaxed">
                          For life-threatening emergencies requiring immediate
                          blood transfusion, please contact emergency services
                          (911) immediately. This form is designed for urgent
                          but non-immediate blood needs with advance planning.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Patient Information Section */}
                    <div className="bg-gray-50 rounded-2xl p-8">
                      <div className="flex items-center mb-8">
                        <div className="h-12 w-12 bg-blue-500 rounded-2xl flex items-center justify-center mr-4">
                          <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            Patient Information
                          </h2>
                          <p className="text-sm text-gray-600">
                            Enter the patient's medical details and requirements
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label
                            htmlFor="patientName"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Patient Full Name *
                          </label>
                          <input
                            type="text"
                            name="patientName"
                            id="patientName"
                            value={formData.patientName}
                            onChange={handleChange}
                            className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                              errors.patientName
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300 focus:border-red-500"
                            }`}
                            placeholder="Enter patient's full name"
                          />
                          {errors.patientName && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {errors.patientName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="patientAge"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Patient Age *
                          </label>
                          <input
                            type="number"
                            name="patientAge"
                            id="patientAge"
                            min="0"
                            max="150"
                            value={formData.patientAge}
                            onChange={handleChange}
                            className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                              errors.patientAge
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300 focus:border-red-500"
                            }`}
                            placeholder="Enter patient's age"
                          />
                          {errors.patientAge && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {errors.patientAge}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="bloodType"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Blood Type Required *
                          </label>
                          <div className="relative">
                            <select
                              id="bloodType"
                              name="bloodType"
                              value={formData.bloodType}
                              onChange={handleChange}
                              className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all appearance-none ${
                                errors.bloodType
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300 focus:border-red-500"
                              }`}
                            >
                              <option value="">Select Blood Type</option>
                              <option value="A+">A+ (A Positive)</option>
                              <option value="A-">A- (A Negative)</option>
                              <option value="B+">B+ (B Positive)</option>
                              <option value="B-">B- (B Negative)</option>
                              <option value="AB+">AB+ (AB Positive)</option>
                              <option value="AB-">AB- (AB Negative)</option>
                              <option value="O+">O+ (O Positive)</option>
                              <option value="O-">O- (O Negative)</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                            {formData.bloodType && (
                              <div
                                className={`absolute left-3 top-3 w-6 h-6 ${getBloodTypeColor(
                                  formData.bloodType
                                )} rounded-lg flex items-center justify-center`}
                              >
                                <span className="text-white text-xs font-bold">
                                  {formData.bloodType}
                                </span>
                              </div>
                            )}
                          </div>
                          {errors.bloodType && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {errors.bloodType}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="medicalCondition"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Medical Condition/Reason
                          </label>
                          <input
                            type="text"
                            name="medicalCondition"
                            id="medicalCondition"
                            value={formData.medicalCondition}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                            placeholder="e.g., Emergency Surgery, Trauma, Anemia"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hospital Information Section */}
                    <div className="bg-blue-50 rounded-2xl p-8">
                      <div className="flex items-center mb-8">
                        <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center mr-4">
                          <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            Hospital Information
                          </h2>
                          <p className="text-sm text-gray-600">
                            Specify the medical facility details
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-8">
                        <div>
                          <label
                            htmlFor="hospitalName"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Hospital/Medical Facility Name *
                          </label>
                          <input
                            type="text"
                            name="hospitalName"
                            id="hospitalName"
                            value={formData.hospitalName}
                            onChange={handleChange}
                            className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                              errors.hospitalName
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300 focus:border-red-500"
                            }`}
                            placeholder="Enter hospital or medical facility name"
                          />
                          {errors.hospitalName && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {errors.hospitalName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="hospitalAddress"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Hospital Address *
                          </label>
                          <input
                            type="text"
                            name="hospitalAddress"
                            id="hospitalAddress"
                            value={formData.hospitalAddress}
                            onChange={handleChange}
                            className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                              errors.hospitalAddress
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300 focus:border-red-500"
                            }`}
                            placeholder="Enter complete hospital address"
                          />
                          {errors.hospitalAddress && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {errors.hospitalAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-purple-50 rounded-2xl p-8">
                      <div className="flex items-center mb-8">
                        <div className="h-12 w-12 bg-purple-500 rounded-2xl flex items-center justify-center mr-4">
                          <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            Contact Information
                          </h2>
                          <p className="text-sm text-gray-600">
                            Primary contact for emergency coordination
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label
                            htmlFor="contactName"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Contact Person Name *
                          </label>
                          <input
                            type="text"
                            name="contactName"
                            id="contactName"
                            value={formData.contactName}
                            onChange={handleChange}
                            className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                              errors.contactName
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300 focus:border-red-500"
                            }`}
                            placeholder="Doctor, nurse, or authorized personnel"
                          />
                          {errors.contactName && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {errors.contactName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="contactPhone"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Contact Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="contactPhone"
                            id="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                              errors.contactPhone
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300 focus:border-red-500"
                            }`}
                            placeholder="(555) 123-4567"
                          />
                          {errors.contactPhone && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {errors.contactPhone}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label
                            htmlFor="contactEmail"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Contact Email Address *
                          </label>
                          <input
                            type="email"
                            name="contactEmail"
                            id="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                              errors.contactEmail
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300 focus:border-red-500"
                            }`}
                            placeholder="doctor@hospital.com"
                          />
                          {errors.contactEmail && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {errors.contactEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Request Details Section */}
                    <div className="bg-orange-50 rounded-2xl p-8">
                      <div className="flex items-center mb-8">
                        <div className="h-12 w-12 bg-orange-500 rounded-2xl flex items-center justify-center mr-4">
                          <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                            />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            Request Details
                          </h2>
                          <p className="text-sm text-gray-600">
                            Specify the blood requirements and timeline
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <label
                            htmlFor="unitsNeeded"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Units Required *
                          </label>
                          <select
                            id="unitsNeeded"
                            name="unitsNeeded"
                            value={formData.unitsNeeded}
                            onChange={handleChange}
                            className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all appearance-none ${
                              errors.unitsNeeded
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300 focus:border-red-500"
                            }`}
                          >
                            <option value="1">1 unit</option>
                            <option value="2">2 units</option>
                            <option value="3">3 units</option>
                            <option value="4">4 units</option>
                            <option value="5">5 units</option>
                            <option value="6+">6+ units</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="urgency"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Urgency Level
                          </label>
                          <div className="relative">
                            <select
                              id="urgency"
                              name="urgency"
                              value={formData.urgency}
                              onChange={handleChange}
                              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all appearance-none"
                            >
                              <option value="critical">
                                Critical (within hours)
                              </option>
                              <option value="urgent">
                                Urgent (within 24 hours)
                              </option>
                              <option value="standard">
                                Standard (within 48 hours)
                              </option>
                            </select>
                            {formData.urgency && (
                              <div
                                className={`absolute left-3 top-3 px-2 py-1 ${getUrgencyColor(
                                  formData.urgency
                                )} rounded-lg text-xs font-bold`}
                              >
                                {formData.urgency.toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="requiredBy"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Required By Date *
                          </label>
                          <input
                            type="datetime-local"
                            name="requiredBy"
                            id="requiredBy"
                            value={formData.requiredBy}
                            onChange={handleChange}
                            min={new Date().toISOString().slice(0, 16)}
                            className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                              errors.requiredBy
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300 focus:border-red-500"
                            }`}
                          />
                          {errors.requiredBy && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {errors.requiredBy}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-3">
                          <label
                            htmlFor="additionalNotes"
                            className="block text-sm font-bold text-gray-700 mb-3"
                          >
                            Additional Information & Special Requirements
                          </label>
                          <textarea
                            id="additionalNotes"
                            name="additionalNotes"
                            rows={4}
                            value={formData.additionalNotes}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                            placeholder="Any specific medical requirements, cross-matching details, or other relevant information..."
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-gray-50 rounded-2xl p-8">
                      <div className="flex items-start">
                        <div className="flex items-center h-5 mt-1">
                          <input
                            id="agreeToTerms"
                            name="agreeToTerms"
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className={`h-5 w-5 text-red-600 focus:ring-red-500 border-2 rounded transition-all ${
                              errors.agreeToTerms
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        <div className="ml-4">
                          <label
                            htmlFor="agreeToTerms"
                            className="text-sm font-medium text-gray-700 leading-relaxed"
                          >
                            <span className="font-bold">
                              I confirm and agree that:
                            </span>
                            <ul className="mt-2 space-y-1 text-gray-600">
                              <li>
                                • All information provided above is accurate and
                                complete
                              </li>
                              <li>
                                • I am authorized to submit this emergency blood
                                request
                              </li>
                              <li>
                                • I understand that this request will be
                                processed based on blood availability and
                                medical urgency
                              </li>
                              <li>
                                • I acknowledge that false information may delay
                                critical medical care
                              </li>
                            </ul>
                          </label>
                          {errors.agreeToTerms && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {errors.agreeToTerms}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-8">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-lg font-bold rounded-2xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                            Processing Emergency Request...
                          </>
                        ) : (
                          <>
                            <svg
                              className="h-6 w-6 mr-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                            Submit Emergency Request
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* Success State */
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-12 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                      <svg
                        className="h-10 w-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Request Submitted Successfully
                  </h1>
                  <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                    Your emergency blood request has been received and is being
                    processed by our medical team
                  </p>
                </div>

                <div className="px-8 py-12">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6">
                      <svg
                        className="w-8 h-8 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Emergency Request Confirmed
                    </h3>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Your request has been submitted to our emergency response
                      team. We will contact you immediately with updates and
                      coordination details.
                    </p>
                  </div>

                  {/* Request Summary */}
                  <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      Request Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">
                            Request ID:
                          </span>
                          <span className="text-sm font-bold text-gray-900 bg-gray-200 px-3 py-1 rounded-lg">
                            {requestId}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">
                            Patient:
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {formData.patientName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">
                            Blood Type:
                          </span>
                          <div className="flex items-center">
                            <div
                              className={`w-6 h-6 ${getBloodTypeColor(
                                formData.bloodType
                              )} rounded-lg flex items-center justify-center mr-2`}
                            >
                              <span className="text-white text-xs font-bold">
                                {formData.bloodType}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              {formData.bloodType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">
                            Units Requested:
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {formData.unitsNeeded}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">
                            Urgency:
                          </span>
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-lg ${getUrgencyColor(
                              formData.urgency
                            )}`}
                          >
                            {formData.urgency.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">
                            Hospital:
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {formData.hospitalName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-blue-50 rounded-2xl p-8 mb-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      We Will Contact You At:
                    </h4>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                      <div className="flex items-center text-gray-700">
                        <svg
                          className="h-5 w-5 mr-2 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="font-semibold">
                          {formData.contactPhone}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg
                          className="h-5 w-5 mr-2 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          />
                        </svg>
                        <span className="font-semibold">
                          {formData.contactEmail}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 mb-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      What Happens Next?
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-4 mt-1">
                          <span className="text-white text-sm font-bold">
                            1
                          </span>
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">
                            Immediate Review
                          </h5>
                          <p className="text-sm text-gray-600">
                            Our medical team will review your request within 15
                            minutes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-4 mt-1">
                          <span className="text-white text-sm font-bold">
                            2
                          </span>
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">
                            Blood Availability Check
                          </h5>
                          <p className="text-sm text-gray-600">
                            We'll verify blood type availability and prepare for
                            allocation
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-4 mt-1">
                          <span className="text-white text-sm font-bold">
                            3
                          </span>
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">
                            Coordination Call
                          </h5>
                          <p className="text-sm text-gray-600">
                            You'll receive a call with delivery details and
                            timeline
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-lg"
                    >
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                      Print Summary
                    </button>
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Return to Home
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequestPage;
