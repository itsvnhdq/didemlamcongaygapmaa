import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../App";

const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const [upcomingAppointments] = useState([
    {
      id: 1,
      date: '2025-05-20',
      time: '10:00 AM',
      facility: 'Central Blood Bank',
      address: '123 Medical Center Drive, City',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2025-06-15',
      time: '2:30 PM',
      facility: 'City Medical Center',
      address: '456 Health Plaza, Downtown',
      status: 'pending'
    }
  ]);

  const [donationHistory] = useState([
    {
      id: 101,
      date: '2025-01-10',
      facility: 'Central Blood Bank',
      bloodType: 'A+',
      amount: '450ml',
      status: 'completed'
    },
    {
      id: 102,
      date: '2024-10-05',
      facility: 'City Medical Center',
      bloodType: 'A+',
      amount: '450ml',
      status: 'completed'
    },
    {
      id: 103,
      date: '2024-07-22',
      facility: 'Central Blood Bank',
      bloodType: 'A+',
      amount: '450ml',
      status: 'completed'
    }
  ]);

  const [nearbyRequests] = useState([
    {
      id: 123,
      hospital: 'City General Hospital',
      bloodType: 'A+ or O+',
      urgency: 'urgent',
      distance: '2.3 miles'
    },
    {
      id: 124,
      hospital: 'Memorial Medical Center',
      bloodType: 'A+',
      urgency: 'normal',
      distance: '4.7 miles'
    }
  ]);

  const [nextEligibleDate] = useState('2025-07-20');

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'confirmed':
        return (
          <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'pending':
        return (
          <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 bg-gray-100 rounded-full p-2">
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Enhanced Header Section */}
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Welcome back, {user?.name}!
              </h1>
              <p className="mt-3 text-lg text-gray-600 max-w-2xl">
                Your donation journey continues to save lives. Track your contributions and schedule your next donation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/appointment/newAppointment"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      

        {/* Enhanced Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Donations</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{donationHistory.length}</p>
                <div className="flex items-center">
                  <span className="text-sm text-emerald-600 font-semibold">Lives saved</span>
                  <span className="text-sm text-gray-500 ml-1">so far</span>
                </div>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Blood Type</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">A+</p>
                <div className="flex items-center">
                  <span className="text-sm text-blue-600 font-semibold">Universal</span>
                  <span className="text-sm text-gray-500 ml-1">recipient</span>
                </div>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Next Eligible</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{nextEligibleDate}</p>
                <div className="flex items-center">
                  <span className="text-sm text-emerald-600 font-semibold">Ready to</span>
                  <span className="text-sm text-gray-500 ml-1">donate</span>
                </div>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Upcoming</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{upcomingAppointments.length}</p>
                <div className="flex items-center">
                  <span className="text-sm text-purple-600 font-semibold">Appointments</span>
                  <span className="text-sm text-gray-500 ml-1">scheduled</span>
                </div>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Upcoming Appointments and Recent Donations */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          {/* Enhanced Upcoming Appointments */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h3>
              <Link
                to="/appointment/newAppointment"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
              >
                Book New
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="space-y-6">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start space-x-4 p-6 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-100"
                  >
                    {getStatusIcon(appointment.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-semibold text-gray-900">{appointment.facility}</p>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{appointment.address}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {appointment.date} at {appointment.time}
                      </div>
                    </div>
                    <Link
                      to={`/member/appointment/${appointment.id}`}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg font-medium">No upcoming appointments</p>
                  <p className="text-gray-400 mt-1">Book your next donation today!</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Recent Donations */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Recent Donations</h3>
              <Link
                to="/member/donations"
                className="text-red-600 hover:text-red-700 text-sm font-semibold hover:underline transition-all"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {donationHistory.slice(0, 3).map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{donation.facility}</p>
                      <p className="text-sm text-gray-600">{donation.date} • {donation.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {donation.status}
                    </span>
                    <Link
                      to={`/member/donation/${donation.id}`}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Nearby Blood Requests */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Nearby Blood Requests</h3>
              <p className="text-gray-600 mt-1">Current requests in your area that match your blood type</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nearbyRequests.map((request) => (
              <div
                key={request.id}
                className="border-2 border-gray-100 rounded-xl p-6 hover:border-red-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{request.hospital}</h4>
                    <p className="text-sm text-gray-600 mt-1">Blood Type: {request.bloodType}</p>
                    <p className="text-sm text-gray-500 mt-1">{request.distance} away</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    request.urgency === 'urgent' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                  </span>
                </div>
                <Link
                  to={`/member/request/${request.id}`}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl w-full justify-center"
                >
                  Respond to Request
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/member/appointment/new"
              className="flex items-center p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl hover:from-red-100 hover:to-red-200 transition-all group border border-red-200"
            >
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-bold text-gray-900">Book Appointment</p>
                <p className="text-xs text-gray-600">Schedule donation</p>
              </div>
            </Link>

            <Link
              to="/member/donations"
              className="flex items-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group border border-blue-200"
            >
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-bold text-gray-900">View History</p>
                <p className="text-xs text-gray-600">All donations</p>
              </div>
            </Link>

            <Link
              to="/blood-types/a-positive"
              className="flex items-center p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all group border border-emerald-200"
            >
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-bold text-gray-900">Blood Type Info</p>
                <p className="text-xs text-gray-600">Learn compatibility</p>
              </div>
            </Link>

            <Link
              to="/member/profile"
              className="flex items-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group border border-purple-200"
            >
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-bold text-gray-900">My Profile</p>
                <p className="text-xs text-gray-600">Update details</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
