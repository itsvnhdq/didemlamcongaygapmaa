import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth, UserRole } from "../../App";
import { FeatureConfig, FeatureConfigManager } from "../../utils/featureConfig";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navItems, setNavItems] = useState<FeatureConfig[]>([]);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
  };

  // Helper function to get role display name
  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case UserRole.Admin:
        return "Admin Panel";
      case UserRole.Staff:
        return "Staff Panel";
      case UserRole.User:
        return "Member Portal";
      default:
        return "Portal";
    }
  };

  // Helper function to get role name
  const getRoleName = (role: UserRole): string => {
    switch (role) {
      case UserRole.Admin:
        return "Admin";
      case UserRole.Staff:
        return "Staff";
      case UserRole.User:
        return "Member";
      default:
        return "User";
    }
  };

  // Load navigation items based on user role and feature configuration
  useEffect(() => {
    const updateNavItems = () => {
      if (isAuthenticated && user) {
        console.log("Updating sidebar items for role:", user.role);
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

  if (!isAuthenticated || user?.role === UserRole.User) {
    return null;
  }

  return (
    <div
      className={`bg-white shadow-md h-screen fixed top-0 left-0 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } lg:w-64 z-50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={`${isOpen ? "block" : "hidden"} lg:block`}>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <svg
                className="h-6 w-6 text-white"
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
            <div className="ml-3">
              <NavLink to="/" className="text-lg font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent hover:from-red-700 hover:to-red-900 transition-all duration-200">
                BloodDonation
              </NavLink>
              <p className="text-xs font-medium text-gray-500 -mt-1">
                {user?.role !== undefined
                  ? getRoleDisplayName(user.role)
                  : "Portal"}
              </p>
            </div>
          </div>
        </div>
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          onClick={toggleSidebar}
        >
          <svg
            className="h-6 w-6 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="mt-4 flex-1 overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                end={
                  item.path === "/admin" ||
                  item.path === "/staff" ||
                  item.path === "/"
                }
                className={({ isActive }) =>
                  `flex items-center p-4 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 ${
                    isActive
                      ? "bg-red-50 text-red-600 border-r-2 border-red-600"
                      : ""
                  }`
                }
              >
                <svg
                  className="h-5 w-5 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                <span className={`${isOpen ? "block" : "hidden"} lg:block`}>
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className={`${isOpen ? "block" : "hidden"} lg:block`}>
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">
              {user?.role !== undefined ? getRoleName(user.role) : "User"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={`mt-3 w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 ${
            isOpen ? "justify-start" : "justify-center"
          } lg:justify-start`}
        >
          <svg
            className="h-4 w-4"
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
          <span className={`ml-2 ${isOpen ? "block" : "hidden"} lg:block`}>
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
