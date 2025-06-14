import React, { useEffect, useState } from "react";

import AddInventory from "./AddInventory";
import InventoryManagement from "./InventoryManagement";
import Sidebar from "../../Layout/Sidebar";

interface InventoryOverviewProps {
  refreshInterval?: number;
}

interface InventoryStats {
  totalUnits: number;
  byBloodType: {
    [key: string]: {
      available: number;
      reserved: number;
      total: number;
      target: number; // Target/default amount for each blood type
    };
  };
  expiringThisWeek: number;
  recentDonations: number;
}

interface InventoryItem {
  _id: string;
  bloodType: string;
  quantity: number;
  location: string;
  expirationDate: string;
  status: "available" | "reserved" | "used" | "expired";
  collectionDate: string;
}

const InventoryOverview: React.FC<InventoryOverviewProps> = ({
  refreshInterval = 60000,
}) => {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManagementModal, setShowManagementModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false);

  // Default target amounts for each blood type
  const defaultBloodTypeTargets = {
    "A+": 100,
    "A-": 50,
    "B+": 80,
    "B-": 40,
    "AB+": 30,
    "AB-": 20,
    "O+": 120,
    "O-": 60,
  };

  // Mock inventory data
  const mockInventory: InventoryItem[] = [
    {
      _id: "1",
      bloodType: "A+",
      quantity: 50,
      location: "Storage Room A",
      expirationDate: new Date(Date.now() + 3024000000).toISOString(), // 35 days from now
      status: "available",
      collectionDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
    {
      _id: "2",
      bloodType: "B+",
      quantity: 30,
      location: "Storage Room A",
      expirationDate: new Date(Date.now() + 3024000000).toISOString(), // 35 days from now
      status: "available",
      collectionDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
    {
      _id: "3",
      bloodType: "O+",
      quantity: 80,
      location: "Storage Room B",
      expirationDate: new Date(Date.now() + 3024000000).toISOString(), // 35 days from now
      status: "available",
      collectionDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    },
    {
      _id: "4",
      bloodType: "AB+",
      quantity: 15,
      location: "Storage Room B",
      expirationDate: new Date(Date.now() + 3024000000).toISOString(), // 35 days from now
      status: "available",
      collectionDate: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    },
    {
      _id: "5",
      bloodType: "O-",
      quantity: 25,
      location: "Storage Room C",
      expirationDate: new Date(Date.now() + 3024000000).toISOString(), // 35 days from now
      status: "available",
      collectionDate: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    },
    {
      _id: "6",
      bloodType: "A-",
      quantity: 10,
      location: "Storage Room C",
      expirationDate: new Date(Date.now() + 3024000000).toISOString(), // 35 days from now
      status: "available",
      collectionDate: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    },
    {
      _id: "7",
      bloodType: "A+",
      quantity: 20,
      location: "Storage Room A",
      expirationDate: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
      status: "reserved",
      collectionDate: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
    },
    {
      _id: "8",
      bloodType: "B-",
      quantity: 5,
      location: "Storage Room C",
      expirationDate: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
      status: "available",
      collectionDate: new Date(Date.now() - 1728000000).toISOString(), // 20 days ago
    },
  ];

  // Calculate inventory statistics with targets
  const calculateStats = (inventory: InventoryItem[]): InventoryStats => {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats: InventoryStats = {
      totalUnits: 0,
      byBloodType: {},
      expiringThisWeek: 0,
      recentDonations: 0,
    };

    // Initialize all blood types with default targets
    Object.entries(defaultBloodTypeTargets).forEach(([bloodType, target]) => {
      stats.byBloodType[bloodType] = {
        available: 0,
        reserved: 0,
        total: 0,
        target: target,
      };
    });

    // Process inventory items
    inventory.forEach((item) => {
      stats.totalUnits += item.quantity;

      if (!stats.byBloodType[item.bloodType]) {
        stats.byBloodType[item.bloodType] = {
          available: 0,
          reserved: 0,
          total: 0,
          target:
            defaultBloodTypeTargets[
              item.bloodType as keyof typeof defaultBloodTypeTargets
            ] || 50,
        };
      }

      stats.byBloodType[item.bloodType].total += item.quantity;
      if (item.status === "available") {
        stats.byBloodType[item.bloodType].available += item.quantity;
      } else if (item.status === "reserved") {
        stats.byBloodType[item.bloodType].reserved += item.quantity;
      }

      const expirationDate = new Date(item.expirationDate);
      if (expirationDate <= oneWeekFromNow) {
        stats.expiringThisWeek += item.quantity;
      }

      const collectionDate = new Date(item.collectionDate);
      if (collectionDate >= oneWeekAgo) {
        stats.recentDonations += item.quantity;
      }
    });

    return stats;
  };

  useEffect(() => {
    const fetchInventory = async () => {
      // Only show loading on initial load, not on auto-refresh
      if (!stats) {
        setLoading(true);
      }

      try {
        // In a real implementation, we would fetch inventory data from the API
        // For now, use mock data
        setTimeout(() => {
          setInventory(mockInventory);
          setStats(calculateStats(mockInventory));
          setLastRefresh(new Date());
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to load inventory data");
        setLoading(false);
      }
    };

    // Initial fetch
    fetchInventory();

    // Set up refresh interval only if auto-refresh is enabled
    let intervalId: NodeJS.Timeout | null = null;
    if (isAutoRefreshEnabled) {
      intervalId = setInterval(fetchInventory, refreshInterval);
    }

    // Clean up interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line
  }, [refreshInterval, isAutoRefreshEnabled]); // Add isAutoRefreshEnabled as dependency

  // Manual refresh function
  const handleManualRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setInventory(mockInventory);
      setStats(calculateStats(mockInventory));
      setLastRefresh(new Date());
      setLoading(false);
    }, 500);
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

  const getStockStatus = (
    current: number,
    target: number
  ): { color: string; status: string } => {
    const percentage = (current / target) * 100;
    if (percentage >= 80) return { color: "text-emerald-600", status: "Good" };
    if (percentage >= 50) return { color: "text-yellow-600", status: "Low" };
    return { color: "text-red-600", status: "Critical" };
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "reserved":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredInventory = inventory.filter(
    (item) => filterStatus === "all" || item.status === filterStatus
  );

  // Export to PDF function
  const exportToPDF = () => {
    try {
      const pdfContent = `
        Blood Inventory Report
        Generated on: ${new Date().toLocaleDateString()}
        
        INVENTORY SUMMARY
        =================
        Total Units: ${stats?.totalUnits || 0}
        Expiring This Week: ${stats?.expiringThisWeek || 0}
        Recent Donations: ${stats?.recentDonations || 0}
        Blood Types Available: ${Object.keys(stats?.byBloodType || {}).length}
        
        BLOOD TYPE BREAKDOWN
        ===================
        ${Object.entries(stats?.byBloodType || {})
          .map(
            ([type, data]) =>
              `${type}: ${data.total} total (${data.available} available, ${data.reserved} reserved)`
          )
          .join("\n")}
        
        DETAILED INVENTORY
        ==================
        ${filteredInventory
          .map(
            (item) =>
              `ID: ${item._id} | Type: ${item.bloodType} | Quantity: ${
                item.quantity
              } units | Location: ${item.location} | Status: ${
                item.status
              } | Expires: ${new Date(
                item.expirationDate
              ).toLocaleDateString()}`
          )
          .join("\n")}
      `;

      const blob = new Blob([pdfContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `blood-inventory-report-${
        new Date().toISOString().split("T")[0]
      }.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Report exported successfully!");
    } catch (error) {
      console.error("Error exporting report:", error);
      alert("Failed to export report. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="ml-16 lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center bg-white p-12 rounded-2xl shadow-2xl">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-200 border-t-red-600 mx-auto mb-6"></div>
            <p className="text-xl font-semibold text-gray-700">
              Loading inventory data...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please wait while we fetch the latest information
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Sidebar />
        <div className="ml-16 lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <svg
              className="mx-auto h-16 w-16 text-red-500 mb-4"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <Sidebar />
        <div className="ml-16 lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m16 0V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-600">No inventory data found.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="ml-16 lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-12">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
              <div className="mb-8 xl:mb-0">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-4">
                  Blood Inventory Overview
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Monitor and manage blood bank inventory levels with real-time
                  analytics and comprehensive tracking.
                </p>
                {/* Add refresh status */}
                <div className="flex items-center gap-4 mt-4">
                  <p className="text-sm text-gray-500">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoRefresh"
                      checked={isAutoRefreshEnabled}
                      onChange={(e) =>
                        setIsAutoRefreshEnabled(e.target.checked)
                      }
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label
                      htmlFor="autoRefresh"
                      className="text-sm text-gray-600"
                    >
                      Auto-refresh every {refreshInterval / 1000}s
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleManualRefresh}
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 bg-gray-100 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-200 hover:border-gray-400 transition-all shadow-lg disabled:opacity-50"
                >
                  <svg
                    className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
                <button
                  onClick={exportToPDF}
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export Report
                </button>
                <button
                  onClick={() => setShowManagementModal(true)}
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Manage Inventory
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Inventory
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Total Units
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">
                    {stats.totalUnits}
                  </p>
                  <p className="text-sm text-emerald-600 font-semibold">
                    +12% from last month
                  </p>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Expiring Soon
                  </p>
                  <p className="text-4xl font-bold text-orange-600 mb-1">
                    {stats.expiringThisWeek}
                  </p>
                  <p className="text-sm text-orange-600 font-semibold">
                    Within 7 days
                  </p>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Recent Donations
                  </p>
                  <p className="text-4xl font-bold text-emerald-600 mb-1">
                    {stats.recentDonations}
                  </p>
                  <p className="text-sm text-gray-500 font-semibold">
                    Last 7 days
                  </p>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Blood Types
                  </p>
                  <p className="text-4xl font-bold text-purple-600 mb-1">
                    {Object.keys(stats.byBloodType).length}
                  </p>
                  <p className="text-sm text-gray-500 font-semibold">
                    Available types
                  </p>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Blood Type Distribution with Targets */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Blood Type Distribution & Targets
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {Object.entries(stats?.byBloodType || {}).map(
                ([bloodType, data]) => {
                  const stockStatus = getStockStatus(
                    data.available,
                    data.target
                  );
                  const percentage = Math.min(
                    (data.available / data.target) * 100,
                    100
                  );

                  return (
                    <div
                      key={bloodType}
                      className="text-center group hover:scale-105 transition-transform"
                    >
                      <div
                        className={`w-20 h-20 ${getBloodTypeColor(
                          bloodType
                        )} rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
                      >
                        {bloodType}
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-1">
                        {data.available}/{data.target}
                      </p>
                      <p
                        className={`text-xs font-semibold mb-2 ${stockStatus.color}`}
                      >
                        {stockStatus.status}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                          className={`${getBloodTypeColor(
                            bloodType
                          )} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {Math.round(percentage)}% of target
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Enhanced Inventory Management */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-8 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 lg:mb-0">
                  Inventory Management
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="expired">Expired</option>
                  </select>
                  <div className="flex rounded-xl border-2 border-gray-300 overflow-hidden shadow-sm">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-4 py-3 text-sm font-semibold transition-all ${
                        viewMode === "grid"
                          ? "bg-red-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Grid View
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-4 py-3 text-sm font-semibold transition-all ${
                        viewMode === "list"
                          ? "bg-red-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      List View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredInventory.map((item) => (
                    <div
                      key={item._id}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-red-300 hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-16 h-16 ${getBloodTypeColor(
                            item.bloodType
                          )} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          {item.bloodType}
                        </div>
                        <span
                          className={`px-3 py-2 text-xs font-bold rounded-full border-2 ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-3">
                        {item.quantity} units
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 flex items-center">
                        <svg
                          className="h-4 w-4 mr-2"
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
                        {item.location}
                      </p>
                      <p className="text-sm text-gray-600 mb-4 flex items-center">
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Expires:{" "}
                        {new Date(item.expirationDate).toLocaleDateString()}
                      </p>
                      <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2 text-sm font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                          Edit
                        </button>
                        <button className="flex-1 px-4 py-2 text-sm font-semibold bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">
                          Reserve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Blood Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Expiration
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInventory.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 ${getBloodTypeColor(
                                item.bloodType
                              )} rounded-xl flex items-center justify-center text-white text-sm font-bold mr-4 shadow-md`}
                            >
                              {item.bloodType}
                            </div>
                            <span className="font-semibold text-gray-900">
                              {item.bloodType}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {item.quantity} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {item.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-bold rounded-full border-2 ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {new Date(item.expirationDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end gap-3">
                            <button className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all">
                              Edit
                            </button>
                            <button className="text-orange-600 hover:text-orange-800 font-semibold hover:underline transition-all">
                              Reserve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modals */}
          {showAddModal && (
            <AddInventory
              onClose={() => setShowAddModal(false)}
              onAdd={(newItem) => {
                const updatedInventory = [...inventory, newItem];
                setInventory(updatedInventory);
                setStats(calculateStats(updatedInventory));
                setLastRefresh(new Date());
                setShowAddModal(false);
              }}
            />
          )}

          {showManagementModal && (
            <InventoryManagement
              inventory={inventory}
              onClose={() => setShowManagementModal(false)}
              onUpdate={(updatedInventory) => {
                setInventory(updatedInventory);
                setStats(calculateStats(updatedInventory));
                setLastRefresh(new Date());
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default InventoryOverview;
