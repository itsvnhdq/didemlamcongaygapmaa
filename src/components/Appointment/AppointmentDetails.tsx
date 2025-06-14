import React, { useState, useEffect } from 'react';

interface AppointmentDetailsProps {
  appointmentId?: string;
  date?: Date;
  staffId?: string;
}

interface Appointment {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    bloodType: string;
    phoneNumber: string;
    email: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'donation' | 'checkup' | 'consultation';
  notes: string;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ appointmentId, date, staffId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock appointments data - in production this would come from API
  const mockAppointments: Appointment[] = [
    {
      _id: '1',
      userId: {
        _id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        bloodType: 'A+',
        phoneNumber: '555-123-4567',
        email: 'john.doe@example.com'
      },
      date: '2025-05-19T00:00:00.000Z',
      startTime: '10:00',
      endTime: '10:30',
      status: 'scheduled',
      type: 'donation',
      notes: 'First time donor'
    },
    {
      _id: '2',
      userId: {
        _id: 'user2',
        firstName: 'Jane',
        lastName: 'Smith',
        bloodType: 'O-',
        phoneNumber: '555-234-5678',
        email: 'jane.smith@example.com'
      },
      date: '2025-05-19T00:00:00.000Z',
      startTime: '11:30',
      endTime: '12:00',
      status: 'scheduled',
      type: 'checkup',
      notes: 'Regular checkup'
    },
    {
      _id: '3',
      userId: {
        _id: 'user3',
        firstName: 'Robert',
        lastName: 'Johnson',
        bloodType: 'B+',
        phoneNumber: '555-345-6789',
        email: 'robert.johnson@example.com'
      },
      date: '2025-05-20T00:00:00.000Z',
      startTime: '14:00',
      endTime: '14:30',
      status: 'scheduled',
      type: 'consultation',
      notes: 'Discuss donation frequency'
    }
  ];

  useEffect(() => {
    // In a real implementation, we would fetch appointment data from the API
    // Example API call:
    /*
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        let url = '';
        
        if (appointmentId) {
          url = `/api/appointments/${appointmentId}`;
        } else if (date && staffId) {
          const formattedDate = date.toISOString().split('T')[0];
          url = `/api/staff/${staffId}/appointments?date=${formattedDate}`;
        } else if (date) {
          const formattedDate = date.toISOString().split('T')[0];
          url = `/api/appointments/date/${formattedDate}`;
        } else if (staffId) {
          url = `/api/staff/${staffId}/appointments`;
        }
        
        if (url) {
          const response = await axios.get(url);
          setAppointments(response.data);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load appointment data');
        setLoading(false);
      }
    };
    
    fetchAppointments();
    */

    // For now, use mock data
    setLoading(true);
    setTimeout(() => {
      if (date) {
        const dateStr = date.toISOString().split('T')[0];
        const filtered = mockAppointments.filter(
          app => new Date(app.date).toISOString().split('T')[0] === dateStr
        );
        setAppointments(filtered);
      } else if (appointmentId) {
        const appointment = mockAppointments.find(app => app._id === appointmentId);
        setAppointments(appointment ? [appointment] : []);
      } else {
        setAppointments(mockAppointments);
      }
      setLoading(false);
    }, 500);
  }, [appointmentId, date, staffId]);

  const handleStatusChange = (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled' | 'no-show') => {
    // In a real implementation, we would update the appointment status via API
    // Example API call:
    /*
    const updateStatus = async () => {
      try {
        await axios.put(`/api/appointments/${appointmentId}`, { status: newStatus });
        // Update local state
        setAppointments(prevAppointments => 
          prevAppointments.map(app => 
            app._id === appointmentId ? { ...app, status: newStatus } : app
          )
        );
      } catch (err) {
        setError('Failed to update appointment status');
      }
    };
    
    updateStatus();
    */

    // For now, update mock data
    setAppointments(prevAppointments => 
      prevAppointments.map(app => 
        app._id === appointmentId ? { ...app, status: newStatus } : app
      )
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'donation':
        return (
          <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'checkup':
        return (
          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'consultation':
        return (
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  if (appointments.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No appointments found for the selected date.
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getAppointmentTypeIcon(appointment.type)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.userId.firstName} {appointment.userId.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.startTime} - {appointment.endTime}
                    </div>
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {appointment.type}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {appointment.userId.email}
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {appointment.userId.phoneNumber}
                </div>
              </div>
              
              {appointment.notes && (
                <div className="mt-2 text-sm text-gray-700">
                  <div className="font-medium">Notes:</div>
                  <div>{appointment.notes}</div>
                </div>
              )}
              
              <div className="mt-3 flex justify-end space-x-3">
                {appointment.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(appointment._id, 'completed')}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleStatusChange(appointment._id, 'no-show')}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      No Show
                    </button>
                    <button
                      onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {appointment.status !== 'scheduled' && (
                  <button
                    onClick={() => handleStatusChange(appointment._id, 'scheduled')}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reschedule
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentDetails;
