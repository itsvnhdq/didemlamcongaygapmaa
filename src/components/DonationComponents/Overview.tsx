import React, { useState } from "react";

interface Donor {
  id: number;
  name: string;
  bloodType: string;
  units: number;
  status: "Scheduled" | "Completed" | "Cancelled";
  notes?: string;
  phone?: string;
  email?: string;
}

interface Appointment {
  id: number;
  date: string;
  time: string;
  location: string;
  assignedMembers: string[];
  donors: Donor[];
  capacity?: number;
  duration?: string;
}

interface OverviewProps {
  onStartProcess: () => void;
}

const Overview: React.FC<OverviewProps> = ({ onStartProcess }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Enhanced Mock appointment data with more donors
  const appointments: Appointment[] = [
    {
      id: 101,
      date: "2025-05-20",
      time: "10:00 AM",
      location: "City Blood Center",
      assignedMembers: ["Dr. Alice Brown", "Nurse Sarah Wilson"],
      capacity: 15,
      duration: "4 hours",
      donors: [
        {
          id: 1,
          name: "John Smith",
          bloodType: "A+",
          units: 1,
          status: "Completed",
          notes: "First-time donor, successful donation",
          phone: "(555) 123-4567",
          email: "john.smith@email.com",
        },
        {
          id: 2,
          name: "David Lee",
          bloodType: "O-",
          units: 1,
          status: "Completed",
          notes: "Regular donor",
          phone: "(555) 987-6543",
          email: "david.lee@email.com",
        },
        {
          id: 3,
          name: "Emily Johnson",
          bloodType: "B+",
          units: 1,
          status: "Completed",
          notes: "Excellent health metrics",
          phone: "(555) 456-7890",
          email: "emily.johnson@email.com",
        },
      ],
    },
    {
      id: 102,
      date: "2025-05-21",
      time: "2:00 PM",
      location: "Downtown Medical Center",
      assignedMembers: ["Dr. Michael Chen", "Nurse Rebecca Martinez"],
      capacity: 20,
      duration: "5 hours",
      donors: [
        {
          id: 4,
          name: "Sarah Williams",
          bloodType: "AB+",
          units: 1,
          status: "Scheduled",
          notes: "Second-time donor",
          phone: "(555) 234-5678",
          email: "sarah.williams@email.com",
        },
        {
          id: 5,
          name: "Michael Brown",
          bloodType: "O+",
          units: 1,
          status: "Scheduled",
          notes: "Regular monthly donor",
          phone: "(555) 345-6789",
          email: "michael.brown@email.com",
        },
        {
          id: 6,
          name: "Jennifer Davis",
          bloodType: "A-",
          units: 1,
          status: "Scheduled",
          notes: "New donor, completed screening",
          phone: "(555) 456-7890",
          email: "jennifer.davis@email.com",
        },
        {
          id: 7,
          name: "Robert Wilson",
          bloodType: "B-",
          units: 1,
          status: "Scheduled",
          notes: "Rare blood type donor",
          phone: "(555) 567-8901",
          email: "robert.wilson@email.com",
        },
      ],
    },
    {
      id: 103,
      date: "2025-05-22",
      time: "9:00 AM",
      location: "University Hospital",
      assignedMembers: [
        "Dr. Lisa Thompson",
        "Nurse James Rodriguez",
        "Nurse Maria Garcia",
      ],
      capacity: 25,
      duration: "6 hours",
      donors: [
        {
          id: 8,
          name: "Amanda Miller",
          bloodType: "O-",
          units: 1,
          status: "Scheduled",
          notes: "Universal donor",
          phone: "(555) 678-9012",
          email: "amanda.miller@email.com",
        },
        {
          id: 9,
          name: "Christopher Taylor",
          bloodType: "A+",
          units: 1,
          status: "Scheduled",
          notes: "High school teacher, community volunteer",
          phone: "(555) 789-0123",
          email: "christopher.taylor@email.com",
        },
        {
          id: 10,
          name: "Jessica Anderson",
          bloodType: "AB-",
          units: 1,
          status: "Scheduled",
          notes: "Nurse at local clinic",
          phone: "(555) 890-1234",
          email: "jessica.anderson@email.com",
        },
        {
          id: 11,
          name: "Daniel Thomas",
          bloodType: "B+",
          units: 1,
          status: "Scheduled",
          notes: "College student",
          phone: "(555) 901-2345",
          email: "daniel.thomas@email.com",
        },
        {
          id: 12,
          name: "Michelle Jackson",
          bloodType: "O+",
          units: 1,
          status: "Scheduled",
          notes: "Corporate donor program participant",
          phone: "(555) 012-3456",
          email: "michelle.jackson@email.com",
        },
      ],
    },
    {
      id: 104,
      date: "2025-05-18",
      time: "11:00 AM",
      location: "Community Health Center",
      assignedMembers: ["Dr. Kevin Park", "Nurse Susan Lee"],
      capacity: 12,
      duration: "3 hours",
      donors: [
        {
          id: 13,
          name: "Kevin White",
          bloodType: "A-",
          units: 1,
          status: "Completed",
          notes: "Veteran donor, 50+ donations",
          phone: "(555) 123-0987",
          email: "kevin.white@email.com",
        },
        {
          id: 14,
          name: "Lisa Martin",
          bloodType: "B-",
          units: 1,
          status: "Completed",
          notes: "Healthcare worker",
          phone: "(555) 234-0987",
          email: "lisa.martin@email.com",
        },
        {
          id: 15,
          name: "James Garcia",
          bloodType: "AB+",
          units: 1,
          status: "Cancelled",
          notes: "Cancelled due to illness",
          phone: "(555) 345-0987",
          email: "james.garcia@email.com",
        },
      ],
    },
    {
      id: 105,
      date: "2025-05-19",
      time: "3:30 PM",
      location: "City Blood Center",
      assignedMembers: [
        "Dr. Rachel Kim",
        "Nurse Tony Martinez",
        "Nurse Helen Chang",
      ],
      capacity: 18,
      duration: "4.5 hours",
      donors: [
        {
          id: 16,
          name: "Nancy Rodriguez",
          bloodType: "O-",
          units: 1,
          status: "Completed",
          notes: "Emergency services worker",
          phone: "(555) 456-0987",
          email: "nancy.rodriguez@email.com",
        },
        {
          id: 17,
          name: "Steven Lewis",
          bloodType: "A+",
          units: 1,
          status: "Completed",
          notes: "Regular donor, good health",
          phone: "(555) 567-0987",
          email: "steven.lewis@email.com",
        },
        {
          id: 18,
          name: "Patricia Walker",
          bloodType: "B+",
          units: 1,
          status: "Completed",
          notes: "Teacher, first donation this year",
          phone: "(555) 678-0987",
          email: "patricia.walker@email.com",
        },
        {
          id: 19,
          name: "Mark Hall",
          bloodType: "AB-",
          units: 1,
          status: "Cancelled",
          notes: "Low hemoglobin levels",
          phone: "(555) 789-0987",
          email: "mark.hall@email.com",
        },
        {
          id: 20,
          name: "Laura Allen",
          bloodType: "O+",
          units: 1,
          status: "Completed",
          notes: "Young professional, excellent vitals",
          phone: "(555) 890-0987",
          email: "laura.allen@email.com",
        },
      ],
    },
    {
      id: 106,
      date: "2025-05-23",
      time: "1:00 PM",
      location: "Regional Medical Plaza",
      assignedMembers: ["Dr. Thomas Scott", "Nurse Angela Davis"],
      capacity: 14,
      duration: "4 hours",
      donors: [
        {
          id: 21,
          name: "Brian Young",
          bloodType: "A-",
          units: 1,
          status: "Scheduled",
          notes: "Military veteran",
          phone: "(555) 321-0987",
          email: "brian.young@email.com",
        },
        {
          id: 22,
          name: "Carol King",
          bloodType: "B-",
          units: 1,
          status: "Scheduled",
          notes: "Rare blood type, very valuable",
          phone: "(555) 432-0987",
          email: "carol.king@email.com",
        },
        {
          id: 23,
          name: "George Wright",
          bloodType: "AB+",
          units: 1,
          status: "Scheduled",
          notes: "Business owner, community leader",
          phone: "(555) 543-0987",
          email: "george.wright@email.com",
        },
        {
          id: 24,
          name: "Helen Lopez",
          bloodType: "O-",
          units: 1,
          status: "Scheduled",
          notes: "Universal donor, monthly contributor",
          phone: "(555) 654-0987",
          email: "helen.lopez@email.com",
        },
        {
          id: 25,
          name: "Paul Hill",
          bloodType: "A+",
          units: 1,
          status: "Scheduled",
          notes: "College professor",
          phone: "(555) 765-0987",
          email: "paul.hill@email.com",
        },
        {
          id: 26,
          name: "Sandra Green",
          bloodType: "B+",
          units: 1,
          status: "Scheduled",
          notes: "Social worker, frequent donor",
          phone: "(555) 876-0987",
          email: "sandra.green@email.com",
        },
      ],
    },
  ];

  const locations = Array.from(
    new Set(appointments.map((app) => app.location))
  );
  const statuses = ["Scheduled", "Completed", "Cancelled"];

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.donors.some((donor) =>
        donor.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      appointment.id.toString().includes(searchTerm) ||
      appointment.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      appointment.donors.some((donor) => donor.status === statusFilter);

    const matchesLocation =
      locationFilter === "" || appointment.location === locationFilter;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalDonations = appointments.reduce(
    (sum, appointment) => sum + appointment.donors.length,
    0
  );
  const successfulDonations = appointments.reduce(
    (sum, appointment) =>
      sum +
      appointment.donors.filter(
        (donor) => donor.status === "Completed" && donor.units > 0
      ).length,
    0
  );
  const cancelledDonations = appointments.reduce(
    (sum, appointment) =>
      sum +
      appointment.donors.filter((donor) => donor.status === "Cancelled").length,
    0
  );
  const scheduledDonations = appointments.reduce(
    (sum, appointment) =>
      sum +
      appointment.donors.filter((donor) => donor.status === "Scheduled").length,
    0
  );

  const exportData = () => {
    const csvContent = [
      [
        "Appointment ID",
        "Date",
        "Time",
        "Location",
        "Donor Name",
        "Blood Type",
        "Units",
        "Status",
        "Notes",
      ].join(","),
      ...filteredAppointments.flatMap((appointment) =>
        appointment.donors.map((donor) =>
          [
            appointment.id,
            appointment.date,
            appointment.time,
            appointment.location,
            donor.name,
            donor.bloodType,
            donor.units,
            donor.status,
            donor.notes || "",
          ].join(",")
        )
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donations-management.csv";
    a.click();
  };

  const StatCard = ({ title, value, icon, color, trend }: any) => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {title}
          </p>
          <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
          {trend && (
            <p
              className={`text-sm font-semibold flex items-center ${
                trend > 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {trend > 0 ? (
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              )}
              {trend > 0 ? "+" : ""}
              {trend}% from last month
            </p>
          )}
        </div>
        <div
          className={`h-16 w-16 ${color} rounded-2xl flex items-center justify-center shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <StatCard
          title="Total Appointments"
          value={totalDonations}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend={12}
          icon={
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
        <StatCard
          title="Successful Donations"
          value={successfulDonations}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          trend={8}
          icon={
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Scheduled"
          value={scheduledDonations}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
          trend={-2}
          icon={
            <svg
              className="w-8 h-8 text-white"
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
          }
        />
        <StatCard
          title="Cancelled"
          value={cancelledDonations}
          color="bg-gradient-to-br from-red-500 to-red-600"
          trend={-15}
          icon={
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Enhanced Quick Action Button */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Quick Actions
          </h2>
          <p className="text-gray-600">
            Streamline your donation management workflow
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => exportData()}
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
            Export Data
          </button>
          <button
            onClick={onStartProcess}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Start New Donation Process
          </button>
        </div>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
              />
            </svg>
            Search & Filter Appointments
          </h3>
          <p className="text-gray-600 mt-1">
            Find and manage donation appointments efficiently
          </p>
        </div>
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search appointments, donors, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                />
                <svg
                  className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm font-medium"
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm font-medium"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                onClick={exportData}
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Appointments List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Appointment Management
              </h3>
              <p className="text-gray-600 mt-1">
                {filteredAppointments.length} appointments found
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {paginatedAppointments.length === 0 ? (
            <div className="text-center py-12">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-red-300 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                          #{appointment.id}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {appointment.location}
                          </h4>
                          <p className="text-gray-600 flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {new Date(appointment.date).toLocaleDateString()} at{" "}
                            {appointment.time}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <p className="text-blue-800 font-semibold text-sm">
                            Capacity
                          </p>
                          <p className="text-blue-900 font-bold text-lg">
                            {appointment.capacity || "N/A"}
                          </p>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                          <p className="text-emerald-800 font-semibold text-sm">
                            Duration
                          </p>
                          <p className="text-emerald-900 font-bold text-lg">
                            {appointment.duration || "N/A"}
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <p className="text-purple-800 font-semibold text-sm">
                            Donors
                          </p>
                          <p className="text-purple-900 font-bold text-lg">
                            {appointment.donors.length}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Assigned Staff:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {appointment.assignedMembers.map((member, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-200"
                            >
                              {member}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:ml-6">
                      <button
                        onClick={() =>
                          setExpandedAppointment(
                            expandedAppointment === appointment.id
                              ? null
                              : appointment.id
                          )
                        }
                        className="px-4 py-2 text-sm font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
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
                        {expandedAppointment === appointment.id
                          ? "Hide Details"
                          : "View Details"}
                      </button>
                      <button className="px-4 py-2 text-sm font-semibold bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedAppointment === appointment.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h5 className="font-bold text-gray-900 mb-4">
                        Donor Details
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {appointment.donors.map((donor) => (
                          <div
                            key={donor.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h6 className="font-semibold text-gray-900">
                                {donor.name}
                              </h6>
                              <span
                                className={`px-3 py-1 text-xs font-bold rounded-full ${
                                  donor.status === "Completed"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : donor.status === "Scheduled"
                                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                                    : "bg-red-100 text-red-800 border border-red-200"
                                }`}
                              >
                                {donor.status}
                              </span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-medium">Blood Type:</span>{" "}
                                {donor.bloodType}
                              </p>
                              <p>
                                <span className="font-medium">Units:</span>{" "}
                                {donor.units}
                              </p>
                              {donor.phone && (
                                <p>
                                  <span className="font-medium">Phone:</span>{" "}
                                  {donor.phone}
                                </p>
                              )}
                              {donor.email && (
                                <p>
                                  <span className="font-medium">Email:</span>{" "}
                                  {donor.email}
                                </p>
                              )}
                              {donor.notes && (
                                <p>
                                  <span className="font-medium">Notes:</span>{" "}
                                  {donor.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Overview;
