import React, { useState } from "react";
import BlogManagement from '../Blog/BlogComponents';
import Sidebar from "../Layout/Sidebar";

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    desktop: false,
    emergencyAlerts: true,
    systemUpdates: false,
    reportReminders: true
  });
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    maintenanceMode: false,
    auditLogging: true,
    dataRetention: '365',
    sessionTimeout: '30'
  });

  const sections = [
    {
      id: 'general',
      title: 'General Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: 'System preferences and regional settings'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      description: 'Password policies and access controls'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 19.462A17.013 17.013 0 003 12c0-9.75 7.5-17.25 17.25-17.25S37.5 2.25 37.5 12a17.013 17.013 0 00-1.868 7.462M14 10V9a2 2 0 00-2-2H8a2 2 0 00-2 2v1m8 0V9a2 2 0 012-2h4a2 2 0 012 2v1m-8 0v6a2 2 0 002 2h4a2 2 0 002-2v-6" />
        </svg>
      ),
      description: 'Alert preferences and communication settings'
    },
    {
      id: 'blog',
      title: 'Blog Management',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      description: 'Manage blog posts and articles'
    },
    {
      id: 'system',
      title: 'System Configuration',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      description: 'Advanced system and backup settings'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      description: 'Third-party services and API configurations'
    }
  ];

  const ToggleSwitch = ({ enabled, onChange, label, description, size = 'default' }: any) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1">
        <h4 className={`font-semibold text-gray-900 ${size === 'small' ? 'text-sm' : 'text-base'}`}>{label}</h4>
        <p className={`text-gray-500 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`${enabled ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gray-200'} 
          relative inline-flex ${size === 'small' ? 'h-5 w-9' : 'h-6 w-11'} 
          flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
          focus:ring-red-500 focus:ring-offset-2 shadow-sm`}
      >
        <span className={`${enabled ? (size === 'small' ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0'} 
          pointer-events-none inline-block ${size === 'small' ? 'h-4 w-4' : 'h-5 w-5'} 
          transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
      </button>
    </div>
  );

  const StatCard = ({ title, value, icon, color, trend }: any) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-semibold ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.positive ? '↗' : '↘'} {trend.value}
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-8">
            {/* System Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="System Uptime"
                value="99.97%"
                icon={<svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                color="bg-green-100"
                trend={{ positive: true, value: "+0.02%" }}
              />
              <StatCard
                title="Active Users"
                value="1,247"
                icon={<svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6 6 0 00-9 5.197m0 0A9.014 9.014 0 0021 15c0-4.418-4.03-8-9-8s-9 3.582-9 8" /></svg>}
                color="bg-blue-100"
                trend={{ positive: true, value: "+12%" }}
              />
              <StatCard
                title="Blood Units"
                value="8,942"
                icon={<svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                color="bg-red-100"
                trend={{ positive: true, value: "+5.3%" }}
              />
              <StatCard
                title="Facilities"
                value="24"
                icon={<svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                color="bg-purple-100"
                trend={{ positive: false, value: "-1" }}
              />
            </div>

            {/* System Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">System Preferences</h3>
                </div>
                <div className="space-y-1 divide-y divide-gray-100">
                  <ToggleSwitch
                    enabled={systemSettings.autoBackup}
                    onChange={(val: boolean) => setSystemSettings({...systemSettings, autoBackup: val})}
                    label="Automatic Backup"
                    description="Enable daily automated system backups"
                  />
                  <ToggleSwitch
                    enabled={systemSettings.maintenanceMode}
                    onChange={(val: boolean) => setSystemSettings({...systemSettings, maintenanceMode: val})}
                    label="Maintenance Mode"
                    description="Put system in maintenance mode for updates"
                  />
                  <ToggleSwitch
                    enabled={systemSettings.auditLogging}
                    onChange={(val: boolean) => setSystemSettings({...systemSettings, auditLogging: val})}
                    label="Audit Logging"
                    description="Track all system activities and changes"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Regional Settings</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Timezone</label>
                    <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all">
                      <option>UTC+07:00 (Bangkok, Hanoi, Jakarta)</option>
                      <option>UTC+00:00 (London, Dublin, Lisbon)</option>
                      <option>UTC-05:00 (New York, Toronto, Bogotá)</option>
                      <option>UTC+09:00 (Tokyo, Seoul, Osaka)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Language</label>
                    <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all">
                      <option>English (US)</option>
                      <option>Vietnamese</option>
                      <option>French</option>
                      <option>Spanish</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Date Format</label>
                    <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                      <option>DD-MM-YYYY</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Password Policy</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Minimum Password Length</label>
                    <input type="number" defaultValue="8" min="6" max="32" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Password Expiry (days)</label>
                    <input type="number" defaultValue="90" min="30" max="365" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all" />
                  </div>
                  <div className="space-y-3">
                    {[
                      'Require uppercase letters',
                      'Require lowercase letters', 
                      'Require numbers',
                      'Require special characters',
                      'Prevent password reuse'
                    ].map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                        <span className="text-sm text-gray-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Access Control</h3>
                </div>
                <div className="space-y-1 divide-y divide-gray-100">
                  <ToggleSwitch
                    enabled={true}
                    onChange={() => {}}
                    label="Two-Factor Authentication"
                    description="Require 2FA for all admin accounts"
                  />
                  <ToggleSwitch
                    enabled={false}
                    onChange={() => {}}
                    label="IP Whitelist"
                    description="Restrict access to specific IP addresses"
                  />
                  <ToggleSwitch
                    enabled={true}
                    onChange={() => {}}
                    label="Session Timeout"
                    description="Auto-logout inactive users after 30 minutes"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Security Events</h3>
              <div className="space-y-4">
                {[
                  { type: 'login', user: 'admin@hospital.com', time: '2 minutes ago', status: 'success' },
                  { type: 'password_change', user: 'staff@hospital.com', time: '1 hour ago', status: 'success' },
                  { type: 'failed_login', user: 'unknown@domain.com', time: '3 hours ago', status: 'warning' },
                  { type: 'permission_change', user: 'admin@hospital.com', time: '1 day ago', status: 'info' }
                ].map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        event.status === 'success' ? 'bg-green-500' :
                        event.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">{event.type.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-500">{event.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{event.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 19.462A17.013 17.013 0 003 12c0-9.75 7.5-17.25 17.25-17.25S37.5 2.25 37.5 12a17.013 17.013 0 00-1.868 7.462" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Notification Channels</h3>
                </div>
                <div className="space-y-1 divide-y divide-gray-100">
                  <ToggleSwitch
                    enabled={notifications.email}
                    onChange={(val: boolean) => setNotifications({...notifications, email: val})}
                    label="Email Notifications"
                    description="Receive notifications via email"
                  />
                  <ToggleSwitch
                    enabled={notifications.sms}
                    onChange={(val: boolean) => setNotifications({...notifications, sms: val})}
                    label="SMS Notifications"
                    description="Critical alerts via SMS"
                  />
                  <ToggleSwitch
                    enabled={notifications.push}
                    onChange={(val: boolean) => setNotifications({...notifications, push: val})}
                    label="Push Notifications"
                    description="Browser and mobile notifications"
                  />
                  <ToggleSwitch
                    enabled={notifications.desktop}
                    onChange={(val: boolean) => setNotifications({...notifications, desktop: val})}
                    label="Desktop Notifications"
                    description="System desktop notifications"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Alert Types</h3>
                </div>
                <div className="space-y-1 divide-y divide-gray-100">
                  <ToggleSwitch
                    enabled={notifications.emergencyAlerts}
                    onChange={(val: boolean) => setNotifications({...notifications, emergencyAlerts: val})}
                    label="Emergency Blood Requests"
                    description="Critical blood shortage alerts"
                    size="small"
                  />
                  <ToggleSwitch
                    enabled={true}
                    onChange={() => {}}
                    label="System Errors"
                    description="Technical issues and failures"
                    size="small"
                  />
                  <ToggleSwitch
                    enabled={notifications.systemUpdates}
                    onChange={(val: boolean) => setNotifications({...notifications, systemUpdates: val})}
                    label="System Updates"
                    description="Maintenance and feature updates"
                    size="small"
                  />
                  <ToggleSwitch
                    enabled={notifications.reportReminders}
                    onChange={(val: boolean) => setNotifications({...notifications, reportReminders: val})}
                    label="Report Reminders"
                    description="Weekly and monthly report schedules"
                    size="small"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Daily Summary</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all">
                    <option>8:00 AM</option>
                    <option>12:00 PM</option>
                    <option>6:00 PM</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Weekly Reports</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all">
                    <option>Monday</option>
                    <option>Friday</option>
                    <option>Sunday</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Emergency Frequency</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all">
                    <option>Immediate</option>
                    <option>Every 15 minutes</option>
                    <option>Every hour</option>
                    <option>Once daily</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'blog':
        return <BlogManagement />;

      case 'system':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Data Management</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Data Retention Period (days)</label>
                    <input 
                      type="number" 
                      value={systemSettings.dataRetention}
                      onChange={(e) => setSystemSettings({...systemSettings, dataRetention: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Session Timeout (minutes)</label>
                    <input 
                      type="number" 
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all" 
                    />
                  </div>
                  <div className="pt-4">
                    <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg">
                      Export System Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Backup & Recovery</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">Last backup: Today, 3:00 AM</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">Next backup: Tomorrow, 3:00 AM</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all">
                      Create Backup
                    </button>
                    <button className="border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                      Restore Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Hospital Management System', status: 'connected', icon: '🏥', color: 'bg-green-100' },
                { name: 'Email Service (SendGrid)', status: 'connected', icon: '📧', color: 'bg-green-100' },
                { name: 'SMS Provider (Twilio)', status: 'disconnected', icon: '💬', color: 'bg-red-100' },
                { name: 'Analytics (Google)', status: 'connected', icon: '📊', color: 'bg-green-100' },
                { name: 'Payment Gateway', status: 'pending', icon: '💳', color: 'bg-yellow-100' },
                { name: 'Cloud Storage', status: 'connected', icon: '☁️', color: 'bg-green-100' }
              ].map((integration, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${integration.color}`}>
                      <span className="text-2xl">{integration.icon}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      integration.status === 'connected' ? 'bg-green-100 text-green-800' :
                      integration.status === 'disconnected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {integration.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{integration.name}</h3>
                  <button className={`w-full py-2 rounded-lg font-medium transition-all ${
                    integration.status === 'connected' 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                  }`}>
                    {integration.status === 'connected' ? 'Configure' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Select a section</div>;
    }
  };

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between py-6 space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage your blood donation system configuration and preferences
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search settings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80 pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all shadow-sm"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Settings Menu</h2>
                <nav className="space-y-2">
                  {filteredSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                      }`}
                    >
                      <span className="flex-shrink-0">{section.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${activeSection === section.id ? 'text-white' : ''}`}>
                          {section.title}
                        </p>
                        <p className={`text-xs ${activeSection === section.id ? 'text-red-100' : 'text-gray-500'}`}>
                          {section.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;