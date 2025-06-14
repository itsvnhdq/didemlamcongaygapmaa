import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "../../App";
import { FeatureConfig, FeatureConfigManager } from "../../utils/featureConfig";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [navItems, setNavItems] = useState<FeatureConfig[]>([]);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [activePath, setActivePath] = useState("");

  // Set active path based on current location
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  // Load navigation items based on user role and feature configuration
  useEffect(() => {
    const updateNavItems = () => {
      if (isAuthenticated && user) {
        console.log("Updating navbar items for role:", user.role);
        const enabledFeatures = FeatureConfigManager.getEnabledFeaturesForRole(
          user.role
        );
        console.log(
          "Enabled features:",
          enabledFeatures.map((f) => f.id)
        );
        setNavItems(enabledFeatures);
      } else {
        setNavItems([]);
      }
    };

    // Initial load
    updateNavItems();

    // Add listener for real-time updates
    FeatureConfigManager.addListener(updateNavItems);

    // Cleanup listener on unmount
    return () => {
      FeatureConfigManager.removeListener(updateNavItems);
    };
  }, [isAuthenticated, user]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Hide navbar on admin routes and inventory overview - moved after all hooks
  if (
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/staff") ||
    location.pathname.startsWith("/manage")
  ) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setShowUserMenu(false);
  };

  // Function to check if a feature is enabled for the current user
  const isFeatureEnabled = (featureId: string): boolean => {
    return navItems.some((item) => item.id === featureId);
  };

  // Function to determine link class based on whether it's active
  const getLinkClass = (path: string) => {
    const isActive = activePath === path;
    return isActive
      ? "relative px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-xl border-2 border-red-200 transition-all duration-200"
      : "relative px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200";
  };

  // Function for mobile menu link classes
  const getMobileLinkClass = (path: string) => {
    const isActive = activePath === path;
    return isActive
      ? "block px-4 py-3 text-base font-bold text-red-600 bg-red-50 border-l-4 border-red-600 transition-all duration-200"
      : "block px-4 py-3 text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 border-l-4 border-transparent hover:border-red-300 transition-all duration-200";
  };

  return (
    <nav className="bg-white shadow-xl border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <svg
                  className="h-7 w-7 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  BloodDonation
                </span>
                <p className="text-xs font-medium text-gray-500 -mt-1">
                  Saving Lives Together
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            {isAuthenticated && (
              <>
                {/* Controllable navbar features */}
                {isFeatureEnabled("navbar-home") && (
                  <Link to="/" className={getLinkClass("/")}>
                    <svg
                      className="h-4 w-4 inline mr-2"
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
                    Home
                  </Link>
                )}

                {isFeatureEnabled("navbar-about") && (
                  <Link to="/about" className={getLinkClass("/about")}>
                    <svg
                      className="h-4 w-4 inline mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    About
                  </Link>
                )}

                {isFeatureEnabled("navbar-blood-types") && (
                  <Link
                    to="/blood-types"
                    className={getLinkClass("/blood-types")}
                  >
                    <svg
                      className="h-4 w-4 inline mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Blood Types
                  </Link>
                )}

                {/* Dashboard links */}
                {isFeatureEnabled("member-dashboard") &&
                  user?.role === UserRole.User && (
                    <Link
                      to="/member-dashboard"
                      className={getLinkClass("/member-dashboard")}
                    >
                      <svg
                        className="h-4 w-4 inline mr-2"
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
                      My Dashboard
                    </Link>
                  )}

                {isFeatureEnabled("staff-dashboard") &&
                  user?.role === UserRole.Staff && (
                    <Link to="/staff" className={getLinkClass("/staff")}>
                      <svg
                        className="h-4 w-4 inline mr-2"
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
                      Staff Dashboard
                    </Link>
                  )}

                {isFeatureEnabled("admin-dashboard") &&
                  user?.role === UserRole.Admin && (
                    <Link to="/admin" className={getLinkClass("/admin")}>
                      <svg
                        className="h-4 w-4 inline mr-2"
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
                      Admin Dashboard
                    </Link>
                  )}

                {isFeatureEnabled("emergency-request-management") &&
                  user?.role === UserRole.Staff && (
                    <Link
                      to="/staff/emergency-request"
                      className="relative px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg
                        className="h-4 w-4 inline mr-2"
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
                      Emergency Request
                    </Link>
                  )}
              </>
            )}
          </div>

          {/* User Menu / Auth Section */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleUserMenu();
                  }}
                  className="flex items-center space-x-3 px-4 py-2 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500 capitalize">
                      {user?.role === UserRole.User
                        ? "Member"
                        : user?.role === UserRole.Staff
                        ? "Staff"
                        : user?.role === UserRole.Admin
                        ? "Admin"
                        : "Unknown"}
                    </p>
                  </div>
                  <svg
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
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
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-800 mt-2">
                        {user?.role === UserRole.User
                          ? "Member"
                          : user?.role === UserRole.Staff
                          ? "Staff"
                          : user?.role === UserRole.Admin
                          ? "Admin"
                          : "Unknown"}
                      </span>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile-settings"
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg
                          className="h-4 w-4 mr-3 text-gray-400"
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
                        Profile Settings
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg
                          className="h-4 w-4 mr-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-5 5-5-5h5v-12h0z"
                          />
                        </svg>
                        Notifications
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg
                          className="h-4 w-4 mr-3 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all duration-200"
                  onClick={() => setActivePath("/login")}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => setActivePath("/register")}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-3 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="bg-white border-t border-gray-100 shadow-lg">
          {/* Mobile Navigation Links */}
          <div className="px-4 py-6 space-y-1">
            {isAuthenticated && (
              <>
                {/* Controllable mobile navbar features */}
                {isFeatureEnabled("navbar-home") && (
                  <Link
                    to="/"
                    className={getMobileLinkClass("/")}
                    onClick={() => {
                      setActivePath("/");
                      setIsMenuOpen(false);
                    }}
                  >
                    <svg
                      className="h-5 w-5 inline mr-3"
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
                    Home
                  </Link>
                )}

                {isFeatureEnabled("navbar-about") && (
                  <Link
                    to="/about"
                    className={getMobileLinkClass("/about")}
                    onClick={() => {
                      setActivePath("/about");
                      setIsMenuOpen(false);
                    }}
                  >
                    <svg
                      className="h-5 w-5 inline mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    About
                  </Link>
                )}

                {isFeatureEnabled("navbar-blood-types") && (
                  <Link
                    to="/blood-types"
                    className={getMobileLinkClass("/blood-types")}
                    onClick={() => {
                      setActivePath("/blood-types");
                      setIsMenuOpen(false);
                    }}
                  >
                    <svg
                      className="h-5 w-5 inline mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Blood Types
                  </Link>
                )}

                {/* Dashboard links */}
                {isFeatureEnabled("member-dashboard") &&
                  user?.role === UserRole.User && (
                    <Link
                      to="/member-dashboard"
                      className={getMobileLinkClass("/member-dashboard")}
                      onClick={() => {
                        setActivePath("/member-dashboard");
                        setIsMenuOpen(false);
                      }}
                    >
                      <svg
                        className="h-5 w-5 inline mr-3"
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
                      My Dashboard
                    </Link>
                  )}

                {isFeatureEnabled("staff-dashboard") &&
                  user?.role === UserRole.Staff && (
                    <Link
                      to="/staff"
                      className={getMobileLinkClass("/staff")}
                      onClick={() => {
                        setActivePath("/staff");
                        setIsMenuOpen(false);
                      }}
                    >
                      <svg
                        className="h-5 w-5 inline mr-3"
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
                      Staff Dashboard
                    </Link>
                  )}

                {isFeatureEnabled("admin-dashboard") &&
                  user?.role === UserRole.Admin && (
                    <Link
                      to="/admin"
                      className={getMobileLinkClass("/admin")}
                      onClick={() => {
                        setActivePath("/admin");
                        setIsMenuOpen(false);
                      }}
                    >
                      <svg
                        className="h-5 w-5 inline mr-3"
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
                      Admin Dashboard
                    </Link>
                  )}

                {isFeatureEnabled("emergency-request-management") &&
                  user?.role === UserRole.Staff && (
                    <Link
                      to="/staff/emergency-request"
                      className="block px-4 py-3 text-base font-bold text-white bg-gradient-to-r from-red-500 to-red-600 border-l-4 border-red-600 transition-all duration-200"
                      onClick={() => {
                        setActivePath("/staff/emergency-request");
                        setIsMenuOpen(false);
                      }}
                    >
                      <svg
                        className="h-5 w-5 inline mr-3"
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
                      Emergency Request
                    </Link>
                  )}
              </>
            )}
          </div>

          {/* Mobile User Section */}
          <div className="border-t border-gray-200 bg-gray-50">
            {isAuthenticated ? (
              <div className="px-4 py-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-800 mt-1">
                      {user?.role === UserRole.User
                        ? "Member"
                        : user?.role === UserRole.Staff
                        ? "Staff"
                        : user?.role === UserRole.Admin
                        ? "Admin"
                        : "Unknown"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    to="/profile-settings"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:text-red-600 rounded-xl transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className="h-4 w-4 mr-3"
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
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200"
                  >
                    <svg
                      className="h-4 w-4 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-6 space-y-3">
                <Link
                  to="/login"
                  className="block w-full px-4 py-3 text-center text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border-2 border-red-200 transition-all duration-200"
                  onClick={() => {
                    setActivePath("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-4 py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200 shadow-lg"
                  onClick={() => {
                    setActivePath("/register");
                    setIsMenuOpen(false);
                  }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
