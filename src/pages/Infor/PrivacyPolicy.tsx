import React from "react";
import { Link } from "react-router-dom";

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl mb-6">
            <svg
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using our Blood Donation
            Management System. By accessing or using our services, you agree to
            be bound by these terms.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="prose prose-red max-w-none">
              {/* Summary Section */}
              <section className="mb-12 bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Summary
                </h2>
                <p className="text-gray-700 mb-4">
                  These Terms of Service govern your use of the Blood Donation
                  Management System. By accessing or using our services, you
                  agree to these terms. Please read them carefully.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      User Responsibilities
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Understand your obligations and rights as a user of our
                      system.
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Medical Information
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Learn about how we handle medical data and your
                      responsibilities.
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Legal Terms
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Important legal information about using our services.
                    </p>
                  </div>
                </div>
              </section>

              {/* Main Content */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using this Blood Donation Management System,
                  you agree to be bound by these Terms of Service and all
                  applicable laws and regulations. If you do not agree with any
                  of these terms, you are prohibited from using or accessing
                  this site.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  2. Use License
                </h2>
                <p className="text-gray-700 mb-4">
                  Permission is granted to temporarily access the materials
                  (information or software) on the Blood Donation Management
                  System for personal, non-commercial transitory viewing only.
                </p>
                <div className="bg-gray-50 rounded-2xl p-6 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Under this license you may not:
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose</li>
                    <li>
                      Attempt to decompile or reverse engineer any software
                      contained on the system
                    </li>
                    <li>
                      Remove any copyright or other proprietary notations from
                      the materials
                    </li>
                    <li>
                      Transfer the materials to another person or "mirror" the
                      materials on any other server
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  3. User Responsibilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Account Management
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>
                        Provide accurate and complete information during
                        registration
                      </li>
                      <li>
                        Maintain the confidentiality of your account credentials
                      </li>
                      <li>
                        Notify us immediately of any unauthorized use of your
                        account
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      System Usage
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>
                        Use the system in compliance with all applicable laws
                      </li>
                      <li>
                        Not engage in any activity that could harm the system
                      </li>
                      <li>Respect the privacy and rights of other users</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  4. Medical Information
                </h2>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Important Medical Disclaimers
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>We do not provide medical advice</li>
                    <li>
                      All medical decisions should be made by qualified
                      healthcare professionals
                    </li>
                    <li>
                      Users are responsible for providing accurate medical
                      information
                    </li>
                    <li>
                      We are not liable for any medical decisions made based on
                      information in the system
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  5. Privacy Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  Your use of the Blood Donation Management System is also
                  governed by our Privacy Policy. Please review our Privacy
                  Policy, which also governs the site and informs users of our
                  data collection practices.
                </p>
                <div className="mt-4">
                  <Link
                    to="/privacy"
                    className="inline-flex items-center text-red-600 hover:text-red-700"
                  >
                    Read our Privacy Policy
                    <svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  6. Disclaimer
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-700 mb-4">
                    The materials on the Blood Donation Management System are
                    provided on an 'as is' basis. We make no warranties,
                    expressed or implied, and hereby disclaim and negate all
                    other warranties including, without limitation, implied
                    warranties or conditions of merchantability, fitness for a
                    particular purpose, or non-infringement of intellectual
                    property or other violation of rights.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  7. Limitations
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-700 mb-4">
                    In no event shall the Blood Donation Management System or
                    its suppliers be liable for any damages (including, without
                    limitation, damages for loss of data or profit, or due to
                    business interruption) arising out of the use or inability
                    to use the materials on the system.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  8. Revisions and Errata
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-700 mb-4">
                    The materials appearing on the Blood Donation Management
                    System could include technical, typographical, or
                    photographic errors. We do not warrant that any of the
                    materials on its website are accurate, complete, or current.
                  </p>
                </div>
              </section>

              {/* Contact Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  9. Contact Information
                </h2>
                <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 text-white">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-8">
                          Contact Information
                        </h3>
                        <div className="space-y-6">
                          {[
                            {
                              icon: (
                                <svg
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              ),
                              info: [
                                "123 Medical Center Drive",
                                "City, State 12345",
                              ],
                            },
                            {
                              icon: (
                                <svg
                                  className="h-6 w-6"
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
                              ),
                              info: ["(123) 456-7890"],
                            },
                            {
                              icon: (
                                <svg
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                              ),
                              info: ["info@blooddonation.org"],
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-4"
                            >
                              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                                {item.icon}
                              </div>
                              <div className="space-y-1">
                                {item.info.map((line, i) => (
                                  <p key={i} className="text-red-100">
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-white mb-6">
                          Operating Hours
                        </h3>
                        <div className="space-y-3 text-red-100">
                          <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                          <p>Saturday: 9:00 AM - 5:00 PM</p>
                          <p>Sunday: Closed</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                      <h3 className="text-2xl font-bold text-white mb-8">
                        Send us a message
                      </h3>
                      <form className="space-y-6">
                        {[
                          { label: "Name", type: "text", id: "name" },
                          { label: "Email", type: "email", id: "email" },
                        ].map((field) => (
                          <div key={field.id}>
                            <label className="block text-sm font-bold text-white mb-2">
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              id={field.id}
                              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-red-200 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                              placeholder={`Enter your ${field.label.toLowerCase()}`}
                            />
                          </div>
                        ))}
                        <div>
                          <label className="block text-sm font-bold text-white mb-2">
                            Message
                          </label>
                          <textarea
                            rows={4}
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-red-200 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm resize-none"
                            placeholder="Enter your message"
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-white text-red-600 py-4 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
                        >
                          Send Message
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-red-600 hover:text-red-700 font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
