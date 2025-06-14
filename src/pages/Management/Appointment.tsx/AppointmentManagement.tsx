import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../../components/Layout/Sidebar";

interface Appointment {
  id: string;
  facilityId: string;
  facilityName: string;
  date: string;
  timeSlot: string;
  donationType: string;
  donorName: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
}

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  // Mock data (in a real app, this would come from an API)
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        facilityId: "1",
        facilityName: "Central Blood Bank",
        date: "2025-05-20",
        timeSlot: "09:00 AM",
        donationType: "whole_blood",
        donorName: "John Doe",
        status: "scheduled",
        notes: "First-time donor",
      },
      {
        id: "2",
        facilityId: "2",
        facilityName: "City Medical Center",
        date: "2025-05-21",
        timeSlot: "10:00 AM",
        donationType: "plasma",
        donorName: "Jane Smith",
        status: "scheduled",
        notes: "",
      },
      {
        id: "3",
        facilityId: "3",
        facilityName: "Community Health Clinic",
        date: "2025-05-22",
        timeSlot: "12:00 PM",
        donationType: "platelets",
        donorName: "Mike Johnson",
        status: "completed",
        notes: "Regular donor",
      },
    ];
    setAppointments(mockAppointments);
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus =
      filterStatus === "all" || appointment.status === filterStatus;
    const matchesDate = !filterDate || appointment.date === filterDate;
    const matchesSearch =
      appointment.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.facilityName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDate && matchesSearch;
  });

  const handleStatusChange = (
    appointmentId: string,
    newStatus: Appointment["status"]
  ) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
  };

  const handleSaveEdit = () => {
    if (editingAppointment) {
      setAppointments(
        appointments.map((apt) =>
          apt.id === editingAppointment.id ? editingAppointment : apt
        )
      );
      setEditingAppointment(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (editingAppointment) {
      setEditingAppointment({
        ...editingAppointment,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12">
      <Sidebar></Sidebar>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-4">
            Appointment Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and monitor blood donation appointments
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-10">
            {/* Filters */}
            <div className="mb-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all"
                  >
                    <option value="all">All Statuses</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by donor or facility..."
                    className="w-full px-4 py-3 text-lg border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Appointment List */}
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border-2 border-gray-200 rounded-xl p-6 bg-white hover:bg-gray-50 transition-all"
                >
                  {editingAppointment?.id === appointment.id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Facility
                          </label>
                          <input
                            type="text"
                            name="facilityName"
                            value={editingAppointment.facilityName}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border-2 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Donor Name
                          </label>
                          <input
                            type="text"
                            name="donorName"
                            value={editingAppointment.donorName}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border-2 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <input
                            type="date"
                            name="date"
                            value={editingAppointment.date}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border-2 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Time
                          </label>
                          <input
                            type="text"
                            name="timeSlot"
                            value={editingAppointment.timeSlot}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border-2 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Donation Type
                          </label>
                          <select
                            name="donationType"
                            value={editingAppointment.donationType}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border-2 rounded-lg"
                          >
                            <option value="whole_blood">Whole Blood</option>
                            <option value="plasma">Plasma</option>
                            <option value="platelets">Platelets</option>
                            <option value="double_red">Double Red Cells</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <select
                            name="status"
                            value={editingAppointment.status}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border-2 rounded-lg"
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border-2 border-gray-300 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Appointment Details
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {appointment.donorName}
                        </h3>
                        <p className="text-gray-600">
                          Facility: {appointment.facilityName}
                        </p>
                        <p className="text-gray-600">
                          Date:{" "}
                          {new Date(appointment.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-gray-600">
                          Time: {appointment.timeSlot}
                        </p>
                        <p className="text-gray-600">
                          Donation Type:{" "}
                          {appointment.donationType
                            .replace("_", " ")
                            .toUpperCase()}
                        </p>
                        <p className="text-gray-600">
                          Status: {appointment.status.toUpperCase()}
                        </p>
                        {appointment.notes && (
                          <p className="text-gray-600">
                            Notes: {appointment.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(appointment.id, "cancelled")
                          }
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800"
                          disabled={appointment.status === "cancelled"}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filteredAppointments.length === 0 && (
                <p className="text-center text-gray-600">
                  No appointments found.
                </p>
              )}
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Need help managing appointments?{" "}
                <Link
                  to="/contact"
                  className="font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
