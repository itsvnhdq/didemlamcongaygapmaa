import React, { useEffect, useState } from "react";
import { useAdminContext } from "../../../pages/AdminPage/AdminContext";
import Sidebar from "../../Layout/Sidebar";
import { useNavigate } from "react-router-dom";

interface EmergencyRequest {
  id: number;
  staff: string;
  staffId: string;
  bloodType: string;
  unitsNeeded: number;
  unitsAvailable: number;
  status: "pending" | "approved" | "fulfilled" | "rejected" | "urgent";
  priority: "low" | "medium" | "high" | "critical";
  requestDate: string;
  requiredBy: string;
  hospital: string;
  reason: string;
  contactNumber: string;
}

const EmergencyManagementPage: React.FC = () => {
  const { donationStats } = useAdminContext();
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<EmergencyRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  // Mock emergency request data with enhanced fields
  const mockRequests: EmergencyRequest[] = [
    {
      id: 1,
      staff: "Dr. Sarah Johnson",
      staffId: "DOC001",
      bloodType: "O-",
      unitsNeeded: 3,
      unitsAvailable: 25,
      status: "urgent",
      priority: "critical",
      requestDate: new Date().toISOString(),
      requiredBy: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      hospital: "Central Medical Center",
      reason: "Emergency surgery - multiple trauma patient",
      contactNumber: "+1-555-0123",
    },
    {
      id: 2,
      staff: "Dr. Michael Chen",
      staffId: "DOC002",
      bloodType: "AB+",
      unitsNeeded: 2,
      unitsAvailable: 15,
      status: "pending",
      priority: "high",
      requestDate: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      requiredBy: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      hospital: "General Hospital",
      reason: "Scheduled surgery - cardiac procedure",
      contactNumber: "+1-555-0124",
    },
    {
      id: 3,
      staff: "Dr. Emily Davis",
      staffId: "DOC003",
      bloodType: "A+",
      unitsNeeded: 1,
      unitsAvailable: 50,
      status: "approved",
      priority: "medium",
      requestDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      requiredBy: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
      hospital: "City Medical Center",
      reason: "Blood transfusion for anemia patient",
      contactNumber: "+1-555-0125",
    },
    {
      id: 4,
      staff: "Dr. James Wilson",
      staffId: "DOC004",
      bloodType: "B-",
      unitsNeeded: 4,
      unitsAvailable: 5,
      status: "pending",
      priority: "high",
      requestDate: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      requiredBy: new Date(Date.now() + 1800000).toISOString(), // 30 minutes from now
      hospital: "Emergency Medical Center",
      reason: "Emergency childbirth complications",
      contactNumber: "+1-555-0126",
    },
    {
      id: 5,
      staff: "Dr. Lisa Anderson",
      staffId: "DOC005",
      bloodType: "O+",
      unitsNeeded: 2,
      unitsAvailable: 80,
      status: "fulfilled",
      priority: "medium",
      requestDate: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      requiredBy: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      hospital: "Regional Medical Center",
      reason: "Post-operative blood replacement",
      contactNumber: "+1-555-0127",
    },
  ];

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setRequests(mockRequests);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching emergency requests:", error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "fulfilled":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "urgent":
        return "bg-red-600 text-white border-red-600 animate-pulse";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-600 animate-pulse";
      default:
        return "bg-gray-500";
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

  const filteredRequests = requests.filter((request) => {
    const statusMatch =
      filterStatus === "all" || request.status === filterStatus;
    const priorityMatch =
      filterPriority === "all" || request.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const pendingRequests = requests.filter(
    (r) => r.status === "pending" || r.status === "urgent"
  ).length;
  const urgentRequests = requests.filter((r) => r.status === "urgent").length;
  const fulfilledRequests = requests.filter(
    (r) => r.status === "fulfilled"
  ).length;
  const criticalRequests = requests.filter(
    (r) => r.priority === "critical"
  ).length;

  const handleStatusUpdate = (requestId: number, newStatus: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: newStatus as EmergencyRequest["status"] }
          : req
      )
    );
    alert(`Request ${requestId} status updated to ${newStatus}`);
  };

  const handleViewDetails = (request: EmergencyRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const exportReport = () => {
    const reportContent = `
      Emergency Requests Report
      Generated on: ${new Date().toLocaleDateString()}
      
      SUMMARY
      =======
      Total Requests: ${requests.length}
      Pending Requests: ${pendingRequests}
      Urgent Requests: ${urgentRequests}
      Critical Priority: ${criticalRequests}
      Fulfilled Requests: ${fulfilledRequests}
      
      DETAILED REQUESTS
      =================
      ${filteredRequests
        .map(
          (req) =>
            `ID: ${req.id} | Staff: ${req.staff} | Blood Type: ${req.bloodType} | Units: ${req.unitsNeeded} | Status: ${req.status} | Priority: ${req.priority} | Hospital: ${req.hospital}`
        )
        .join("\n")}
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `emergency-requests-report-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="ml-16 lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center bg-white p-12 rounded-2xl shadow-2xl">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-200 border-t-red-600 mx-auto mb-6"></div>
            <p className="text-xl font-semibold text-gray-700">
              Loading emergency requests...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please wait while we fetch the latest information
            </p>
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
                  Emergency Blood Requests Overview
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Monitor and manage critical blood requests with real-time
                  tracking and priority-based allocation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={exportReport}
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
                  onClick={() => navigate("/staff/emergency-request")}
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
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  New Request
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
                    Total Requests
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">
                    {requests.length}
                  </p>
                  <p className="text-sm text-blue-600 font-semibold">
                    Active today
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
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Urgent Requests
                  </p>
                  <p className="text-4xl font-bold text-red-600 mb-1">
                    {urgentRequests}
                  </p>
                  <p className="text-sm text-red-600 font-semibold">
                    Immediate attention
                  </p>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Pending Review
                  </p>
                  <p className="text-4xl font-bold text-amber-600 mb-1">
                    {pendingRequests}
                  </p>
                  <p className="text-sm text-amber-600 font-semibold">
                    Awaiting approval
                  </p>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                    Fulfilled Today
                  </p>
                  <p className="text-4xl font-bold text-emerald-600 mb-1">
                    {fulfilledRequests}
                  </p>
                  <p className="text-sm text-emerald-600 font-semibold">
                    Successfully completed
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Request Management */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-8 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 lg:mb-0">
                  Emergency Requests Management
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="urgent">Urgent</option>
                    <option value="approved">Approved</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-sm font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  >
                    <option value="all">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
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
                  {filteredRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-red-300 hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 ${getPriorityColor(
                              request.priority
                            )} rounded-full mr-3 shadow-sm`}
                          ></div>
                          <div
                            className={`w-12 h-12 ${getBloodTypeColor(
                              request.bloodType
                            )} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform`}
                          >
                            {request.bloodType}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-2 text-xs font-bold rounded-full border-2 ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {request.staff}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.hospital}
                      </p>
                      <p className="text-sm font-semibold text-red-600 mb-3">
                        {request.unitsNeeded} units needed
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Required by:{" "}
                        {new Date(request.requiredBy).toLocaleString()}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="flex-1 px-3 py-2 text-sm font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                          Details
                        </button>
                        {request.status === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(request.id, "approved")
                            }
                            className="flex-1 px-3 py-2 text-sm font-semibold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                          >
                            Approve
                          </button>
                        )}
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
                        Staff & Hospital
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Blood Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Units
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Required By
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {request.staff}
                            </p>
                            <p className="text-sm text-gray-500">
                              {request.hospital}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 ${getBloodTypeColor(
                                request.bloodType
                              )} rounded-lg flex items-center justify-center text-white text-xs font-bold mr-3 shadow-md`}
                            >
                              {request.bloodType}
                            </div>
                            <span className="font-semibold text-gray-900">
                              {request.bloodType}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-bold text-gray-900">
                            {request.unitsNeeded}
                          </p>
                          <p className="text-xs text-gray-500">
                            {request.unitsAvailable} available
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 ${getPriorityColor(
                                request.priority
                              )} rounded-full mr-2`}
                            ></div>
                            <span className="text-sm font-medium capitalize">
                              {request.priority}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-bold rounded-full border-2 ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {new Date(request.requiredBy).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all"
                            >
                              Details
                            </button>
                            {request.status === "pending" && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(request.id, "approved")
                                }
                                className="text-emerald-600 hover:text-emerald-800 font-semibold hover:underline transition-all"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Enhanced Details Modal */}
          {showDetailsModal && selectedRequest && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Request Details
                    </h3>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Staff Member
                        </label>
                        <p className="text-gray-900">{selectedRequest.staff}</p>
                        <p className="text-sm text-gray-500">
                          ID: {selectedRequest.staffId}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Hospital
                        </label>
                        <p className="text-gray-900">
                          {selectedRequest.hospital}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Contact Number
                        </label>
                        <p className="text-gray-900">
                          {selectedRequest.contactNumber}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Blood Type
                        </label>
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 ${getBloodTypeColor(
                              selectedRequest.bloodType
                            )} rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3`}
                          >
                            {selectedRequest.bloodType}
                          </div>
                          <span className="text-gray-900">
                            {selectedRequest.bloodType}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Units Needed
                        </label>
                        <p className="text-gray-900">
                          {selectedRequest.unitsNeeded} units
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Available Units
                        </label>
                        <p className="text-gray-900">
                          {selectedRequest.unitsAvailable} units
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Reason
                      </label>
                      <p className="text-gray-900">{selectedRequest.reason}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Request Date
                        </label>
                        <p className="text-gray-900">
                          {new Date(
                            selectedRequest.requestDate
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Required By
                        </label>
                        <p className="text-gray-900">
                          {new Date(
                            selectedRequest.requiredBy
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                      Close
                    </button>
                    {selectedRequest.status === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            handleStatusUpdate(selectedRequest.id, "rejected");
                            setShowDetailsModal(false);
                          }}
                          className="px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(selectedRequest.id, "approved");
                            setShowDetailsModal(false);
                          }}
                          className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all"
                        >
                          Approve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmergencyManagementPage;
