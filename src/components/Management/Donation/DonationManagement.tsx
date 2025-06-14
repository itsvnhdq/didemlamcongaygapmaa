import React, { useEffect, useState } from "react";
import { useAdminContext } from "../../../pages/AdminPage/AdminContext";
import Overview from "../../DonationComponents/Overview";
import Process from "../../DonationComponents/Process";
import Sidebar from "../../Layout/Sidebar";

const DonationManagement: React.FC = () => {
  const { donationStats } = useAdminContext();
  const [activeTab, setActiveTab] = useState<"overview" | "process">(
    "overview"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initializeDonationManagement = async () => {
      setLoading(true);
      try {
        // Simulate API call to fetch donation management data
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // In a real implementation, this would fetch actual donation data
        // const response = await axios.get('/api/donations/management');
        // setDonationData(response.data);

        setLoading(false);
      } catch (err) {
        setError("Failed to load donation management data");
        setLoading(false);
      }
    };

    initializeDonationManagement();
  }, []);

  const handleStartProcess = () => {
    setActiveTab("process");
  };

  const handleBackToOverview = () => {
    setActiveTab("overview");
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="ml-16 lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center bg-white p-12 rounded-2xl shadow-2xl">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-200 border-t-red-600 mx-auto mb-6"></div>
            <p className="text-xl font-semibold text-gray-700">
              Loading Donation Management...
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
        <div className="ml-16 lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
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
              Error Loading Donation Management
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Try Again
              </button>
            </div>
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
                  Donation Management
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Comprehensive donation oversight and processing system with
                  real-time tracking and analytics.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
              <nav className="flex space-x-2" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`${
                    activeTab === "overview"
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } flex-1 px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-3`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Overview & Management
                </button>
                <button
                  onClick={() => setActiveTab("process")}
                  className={`${
                    activeTab === "process"
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } flex-1 px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-3`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Process Donation
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <Overview onStartProcess={handleStartProcess} />
          )}

          {activeTab === "process" && (
            <Process onBackToOverview={handleBackToOverview} />
          )}
        </div>
      </div>
    </>
  );
};

export default DonationManagement;
