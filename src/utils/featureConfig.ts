import { UserRole } from "../services/authService";

// Define allowed roles using the numeric enum
export type AllowedUserRole = UserRole.User | UserRole.Staff | UserRole.Admin;

export interface FeatureConfig {
  id: string;
  name: string;
  path: string;
  icon: string;
  allowedRoles: AllowedUserRole[];
  enabled: {
    [UserRole.User]: boolean;
    [UserRole.Staff]: boolean;
    [UserRole.Admin]: boolean;
  };
  description?: string;
}

// Default feature configuration
export const defaultFeatureConfig: FeatureConfig[] = [
  // Navbar features (controllable for members)
  {
    id: "navbar-home",
    name: "Home (Navbar)",
    path: "/",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    allowedRoles: [UserRole.User, UserRole.Staff, UserRole.Admin],
    enabled: {
      [UserRole.User]: true,
      [UserRole.Staff]: false,
      [UserRole.Admin]: false,
    },
    description: "Home page access in navigation bar",
  },
  {
    id: "navbar-about",
    name: "About (Navbar)",
    path: "/about",
    icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    allowedRoles: [UserRole.User, UserRole.Staff, UserRole.Admin],
    enabled: {
      [UserRole.User]: true,
      [UserRole.Staff]: false,
      [UserRole.Admin]: false,
    },
    description: "About page access in navigation bar",
  },
  {
    id: "navbar-blood-types",
    name: "Blood Types (Navbar)",
    path: "/blood-types",
    icon: "M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a3 3 0 01-3 3H6a3 3 0 01-3-3V7a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9zm0 3v2h6V6H9z",
    allowedRoles: [UserRole.User, UserRole.Staff, UserRole.Admin],
    enabled: {
      [UserRole.User]: true,
      [UserRole.Staff]: false,
      [UserRole.Admin]: false,
    },
    description: "Blood types information in navigation bar",
  },

  // Dashboard features
  {
    id: "member-dashboard",
    name: "My Dashboard",
    path: "/member-dashboard",
    icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M3 7l9 6 9-6",
    allowedRoles: [UserRole.User],
    enabled: {
      [UserRole.User]: true,
      [UserRole.Staff]: false,
      [UserRole.Admin]: false,
    },
    description: "Member personal dashboard",
  },
  {
    id: "staff-dashboard",
    name: "Staff Dashboard",
    path: "/staff",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    allowedRoles: [UserRole.Staff],
    enabled: {
      [UserRole.User]: false,
      [UserRole.Staff]: true,
      [UserRole.Admin]: false,
    },
    description: "Staff management dashboard",
  },
  {
    id: "admin-dashboard",
    name: "Admin Dashboard",
    path: "/admin",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    allowedRoles: [UserRole.Admin],
    enabled: {
      [UserRole.User]: false,
      [UserRole.Staff]: false,
      [UserRole.Admin]: true,
    },
    description: "Administrative dashboard",
  },

  // Admin management features (sidebar only - no Home, About, Blood Types here)
  {
    id: "user-management",
    name: "User Management",
    path: "/manage/user",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    allowedRoles: [UserRole.Admin, UserRole.Staff],
    enabled: {
      [UserRole.User]: false,
      [UserRole.Staff]: true,
      [UserRole.Admin]: true,
    },
    description: "Manage system users",
  },
  {
    id: "inventory-overview",
    name: "Inventory Management",
    path: "/manage/inventory",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    allowedRoles: [UserRole.Admin, UserRole.Staff],
    enabled: {
      [UserRole.User]: false,
      [UserRole.Staff]: true,
      [UserRole.Admin]: true,
    },
    description: "Blood inventory management",
  },
  {
    id: "donation-management",
    name: "Donation Management",
    path: "/manage/donation",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    allowedRoles: [UserRole.Admin, UserRole.Staff],
    enabled: {
      [UserRole.User]: false,
      [UserRole.Staff]: true,
      [UserRole.Admin]: true,
    },
    description: "Manage blood donations",
  },
  {
    id: "emergency-requests-admin",
    name: "Emergency Requests Management",
    path: "/manage/emergency",
    icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    allowedRoles: [UserRole.Admin, UserRole.Staff],
    enabled: {
      [UserRole.User]: false,
      [UserRole.Staff]: true,
      [UserRole.Admin]: true,
    },
    description: "Handle emergency blood requests",
  },

  {
    id: "system-settings",
    name: "System Settings",
    path: "/admin/settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    allowedRoles: [UserRole.Admin],
    enabled: {
      [UserRole.User]: false,
      [UserRole.Staff]: false,
      [UserRole.Admin]: true,
    },
    description: "System configuration and settings",
  },
];

export class FeatureConfigManager {
  private static STORAGE_KEY = "sidebar_feature_config";
  private static listeners: Set<() => void> = new Set();

  static getFeatureConfig(): FeatureConfig[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure new features are included
        return this.mergeWithDefaults(parsed);
      }
    } catch (error) {
      console.error("Error loading feature config:", error);
    }
    return defaultFeatureConfig;
  }

  static saveFeatureConfig(config: FeatureConfig[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      // Also dispatch a storage event to notify other tabs/windows
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: this.STORAGE_KEY,
          newValue: JSON.stringify(config),
          storageArea: localStorage,
        })
      );
    } catch (error) {
      console.error("Error saving feature config:", error);
    }
  }

  static toggleFeature(featureId: string, role: UserRole, enabled: boolean) {
    const config = this.getFeatureConfig();
    const feature = config.find((f) => f.id === featureId);
    if (feature) {
      feature.enabled[role as keyof typeof feature.enabled] = enabled;
      this.saveFeatureConfig(config);
      this.notifyListeners();
    }
  }

  static getEnabledFeaturesForRole(role: UserRole): FeatureConfig[] {
    const config = this.getFeatureConfig();
    return config.filter(
      (feature) =>
        feature.allowedRoles.includes(role as AllowedUserRole) &&
        feature.enabled[role as keyof typeof feature.enabled]
    );
  }

  static resetToDefaults(): void {
    this.saveFeatureConfig(defaultFeatureConfig);
    this.notifyListeners();
  }

  // Add listener for feature config changes
  static addListener(callback: () => void): void {
    this.listeners.add(callback);
  }

  // Remove listener
  static removeListener(callback: () => void): void {
    this.listeners.delete(callback);
  }

  // Notify all listeners when config changes
  private static notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in feature config listener:", error);
      }
    });
  }

  private static mergeWithDefaults(stored: FeatureConfig[]): FeatureConfig[] {
    const merged = [...defaultFeatureConfig];

    stored.forEach((storedFeature) => {
      const index = merged.findIndex((f) => f.id === storedFeature.id);
      if (index !== -1) {
        merged[index] = { ...merged[index], ...storedFeature };
      }
    });

    return merged;
  }
}

// Listen for localStorage changes from other tabs/windows
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === FeatureConfigManager["STORAGE_KEY"]) {
      FeatureConfigManager["notifyListeners"]();
    }
  });
}
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === FeatureConfigManager["STORAGE_KEY"]) {
      FeatureConfigManager["notifyListeners"]();
    }
  });
}
