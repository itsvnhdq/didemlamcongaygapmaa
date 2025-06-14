import React, { useState } from 'react';

interface DonationData {
  period: string;
  donations: number;
  bloodType?: string;
}

interface DonationTrendsChartProps {
  className?: string;
}

const DonationTrendsChart: React.FC<DonationTrendsChartProps> = ({ className = "" }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedBloodType, setSelectedBloodType] = useState<string>('all');

  // Mock data for demonstration
  const mockWeeklyData: DonationData[] = [
    { period: 'Mon', donations: 25 },
    { period: 'Tue', donations: 18 },
    { period: 'Wed', donations: 32 },
    { period: 'Thu', donations: 28 },
    { period: 'Fri', donations: 35 },
    { period: 'Sat', donations: 22 },
    { period: 'Sun', donations: 15 }
  ];

  const mockMonthlyData: DonationData[] = [
    { period: 'Jan', donations: 450 },
    { period: 'Feb', donations: 380 },
    { period: 'Mar', donations: 520 },
    { period: 'Apr', donations: 470 },
    { period: 'May', donations: 590 },
    { period: 'Jun', donations: 510 }
  ];

  const currentData = selectedPeriod === 'weekly' ? mockWeeklyData : mockMonthlyData;
  const maxValue = Math.max(...currentData.map(item => item.donations));

  const bloodTypes = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Donation Trends</h3>
        <div className="flex items-center space-x-3">
          {/* Blood Type Filter */}
          <select
            value={selectedBloodType}
            onChange={(e) => setSelectedBloodType(e.target.value)}
            className="rounded-md border-gray-300 text-sm focus:border-red-500 focus:ring-red-500"
          >
            {bloodTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Blood Types' : type}
              </option>
            ))}
          </select>
          
          {/* Period Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedPeriod('weekly')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === 'weekly'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setSelectedPeriod('monthly')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === 'monthly'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-4">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart bars */}
        <div className="ml-8 h-full flex items-end justify-between space-x-2">
          {currentData.map((item, index) => (
            <div key={item.period} className="flex flex-col items-center group">
              {/* Bar */}
              <div className="relative flex items-end">
                <div
                  className="bg-gradient-to-t from-red-500 to-red-400 rounded-t-sm transition-all duration-300 hover:from-red-600 hover:to-red-500 cursor-pointer group-hover:shadow-lg"
                  style={{
                    height: `${(item.donations / maxValue) * 200}px`,
                    width: '32px',
                    minHeight: '4px'
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.donations} donations
                  </div>
                </div>
              </div>
              
              {/* X-axis label */}
              <span className="text-xs text-gray-600 mt-2 font-medium">
                {item.period}
              </span>
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 ml-8 pointer-events-none">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <div
              key={index}
              className="absolute w-full border-t border-gray-100"
              style={{ bottom: `${ratio * 200}px` }}
            />
          ))}
        </div>
      </div>

      {/* Chart Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {currentData.reduce((sum, item) => sum + item.donations, 0)}
          </p>
          <p className="text-sm text-gray-500">
            Total {selectedPeriod === 'weekly' ? 'This Week' : 'Last 6 Months'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {Math.round(currentData.reduce((sum, item) => sum + item.donations, 0) / currentData.length)}
          </p>
          <p className="text-sm text-gray-500">Daily Average</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {Math.max(...currentData.map(item => item.donations))}
          </p>
          <p className="text-sm text-gray-500">Peak Day</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-4 flex justify-end">
        <button className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-md hover:bg-red-50 transition-colors">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Chart
        </button>
      </div>
    </div>
  );
};

export default DonationTrendsChart;
