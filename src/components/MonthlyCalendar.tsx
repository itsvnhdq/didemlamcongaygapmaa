import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CalendarProps {
  staffId: string;
  onDateSelect: (date: Date) => void;
}

interface DayData {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasAppointments: boolean;
  appointmentCount: number;
}

const MonthlyCalendar: React.FC<CalendarProps> = ({ staffId, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<DayData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Mock appointment data - in production this would come from API
  const appointmentsByDate: Record<string, number> = {
    // Format: 'YYYY-MM-DD': count
    '2025-05-19': 3,
    '2025-05-20': 1,
    '2025-05-21': 5,
    '2025-05-22': 2,
    '2025-05-25': 4,
    '2025-05-28': 2,
    '2025-05-30': 1,
  };

  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0-6, where 0 is Sunday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Total days in the month
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Last day of previous month
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    
    const days: DayData[] = [];
    
    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const day = lastDayOfPrevMonth - i;
      const prevMonthDate = new Date(year, month - 1, day);
      const dateKey = formatDateKey(prevMonthDate);
      
      days.push({
        date: day,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false,
        isToday: false,
        hasAppointments: !!appointmentsByDate[dateKey],
        appointmentCount: appointmentsByDate[dateKey] || 0
      });
    }
    
    // Add days of current month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDayDate = new Date(year, month, day);
      const dateKey = formatDateKey(currentDayDate);
      
      days.push({
        date: day,
        month,
        year,
        isCurrentMonth: true,
        isToday: 
          day === today.getDate() && 
          month === today.getMonth() && 
          year === today.getFullYear(),
        hasAppointments: !!appointmentsByDate[dateKey],
        appointmentCount: appointmentsByDate[dateKey] || 0
      });
    }
    
    // Calculate how many days from next month to show to complete the grid
    const totalDaysToShow = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7;
    const daysFromNextMonth = totalDaysToShow - (daysFromPrevMonth + daysInMonth);
    
    // Add days from next month
    for (let day = 1; day <= daysFromNextMonth; day++) {
      const nextMonthDate = new Date(year, month + 1, day);
      const dateKey = formatDateKey(nextMonthDate);
      
      days.push({
        date: day,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
        isToday: false,
        hasAppointments: !!appointmentsByDate[dateKey],
        appointmentCount: appointmentsByDate[dateKey] || 0
      });
    }
    
    return days;
  };

  useEffect(() => {
    setCalendarDays(generateCalendarDays(currentDate));
    
    // In a real implementation, we would fetch appointment data from the API
    // Example API call:
    /*
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/staff/${staffId}/calendar/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`);
        // Process the data and update the calendar
        setLoading(false);
      } catch (err) {
        setError('Failed to load calendar data');
        setLoading(false);
      }
    };
    
    fetchAppointments();
    */
  }, [currentDate, staffId]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: DayData) => {
    const selectedDate = new Date(day.year, day.month, day.date);
    setSelectedDate(selectedDate);
    onDateSelect(selectedDate);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-full hover:bg-gray-200"
            aria-label="Previous month"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-2 py-1 text-sm rounded hover:bg-gray-200"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-full hover:bg-gray-200"
            aria-label="Next month"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-4 flex justify-center">
          <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-600">{error}</div>
      ) : (
        <div className="bg-white">
          <div className="grid grid-cols-7 gap-px border-b border-gray-200">
            {weekdays.map((day) => (
              <div key={day} className="text-center py-2 text-sm font-semibold text-gray-700">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  min-h-[80px] p-2 bg-white hover:bg-gray-50 cursor-pointer
                  ${day.isToday ? 'bg-red-50' : ''}
                  ${selectedDate && 
                    day.date === selectedDate.getDate() && 
                    day.month === selectedDate.getMonth() && 
                    day.year === selectedDate.getFullYear() 
                      ? 'ring-2 ring-inset ring-red-500' 
                      : ''}
                  ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                `}
              >
                <div className="flex justify-between">
                  <span className={`text-sm ${day.isToday ? 'font-bold' : ''}`}>
                    {day.date}
                  </span>
                  {day.hasAppointments && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {day.appointmentCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyCalendar;
