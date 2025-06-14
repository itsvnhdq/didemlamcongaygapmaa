import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BloodTypeInfoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('compatibility');
  
  const bloodTypes = [
    { type: 'A+', canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['A+', 'A-', 'O+', 'O-'], population: '35.7%' },
    { type: 'A-', canDonateTo: ['A+', 'A-', 'AB+', 'AB-'], canReceiveFrom: ['A-', 'O-'], population: '6.3%' },
    { type: 'B+', canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['B+', 'B-', 'O+', 'O-'], population: '8.5%' },
    { type: 'B-', canDonateTo: ['B+', 'B-', 'AB+', 'AB-'], canReceiveFrom: ['B-', 'O-'], population: '1.5%' },
    { type: 'AB+', canDonateTo: ['AB+'], canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], population: '3.4%' },
    { type: 'AB-', canDonateTo: ['AB+', 'AB-'], canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'], population: '0.6%' },
    { type: 'O+', canDonateTo: ['A+', 'B+', 'AB+', 'O+'], canReceiveFrom: ['O+', 'O-'], population: '37.4%' },
    { type: 'O-', canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], canReceiveFrom: ['O-'], population: '6.6%' }
  ];

  const bloodComponents = [
    { 
      name: 'Red Blood Cells', 
      description: 'The most common type of blood donation, used for trauma, surgery, and anemia.',
      compatibility: 'Must match ABO and Rh blood types.',
      storageLife: '42 days',
      donationFrequency: 'Every 56 days',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    { 
      name: 'Plasma', 
      description: 'The liquid portion of blood, used for burn patients, shock, and bleeding disorders.',
      compatibility: 'Plasma compatibility is the reverse of red blood cell compatibility.',
      storageLife: '1 year (frozen)',
      donationFrequency: 'Every 28 days',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    { 
      name: 'Platelets', 
      description: 'Tiny cells that help blood clot, used for cancer patients and surgery.',
      compatibility: 'Should match ABO type when possible, but not always required.',
      storageLife: '5 days',
      donationFrequency: 'Every 7 days, up to 24 times per year',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      name: 'Whole Blood', 
      description: 'Contains all components of blood, used in trauma situations and when specific components aren\'t needed.',
      compatibility: 'Must match ABO and Rh blood types.',
      storageLife: '35 days',
      donationFrequency: 'Every 56 days',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  const bloodFacts = [
    'One donation can save up to three lives.',
    'The average adult has about 10 pints of blood in their body.',
    'A healthy donor may donate red blood cells every 56 days.',
    'The actual blood donation usually takes less than 10-12 minutes.',
    'All donated blood is tested for HIV, hepatitis B and C, syphilis, and other infectious diseases.',
    'Type O negative blood is considered the universal donor type because it can be transfused to almost any patient in need.',
    'Type AB positive blood is known as the universal recipient type because individuals with this type can receive blood of any type.',
    'Blood makes up about 7% of your body\'s weight.',
    'There are four main blood types: A, B, AB, and O.',
    'Each blood type is also classified by Rh factor: positive or negative.'
  ];

  return (
    <div className="bg-white">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Blood Types"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-800/50 to-red-600/30" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-white/20 text-white text-sm font-bold uppercase tracking-wider rounded-full mb-6">
              Blood Types
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
              Understanding Blood
              <span className="block text-red-200">Compatibility</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-red-100 max-w-4xl mx-auto leading-relaxed">
              Learn about different blood types, compatibility, and donation requirements to save lives.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="relative bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { key: 'compatibility', label: 'Blood Compatibility', icon: '🔄' },
              { key: 'components', label: 'Blood Components', icon: '🧪' },
              { key: 'facts', label: 'Blood Facts', icon: '💡' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`${
                  activeTab === tab.key
                    ? 'border-red-500 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } group relative min-w-0 flex-1 overflow-hidden bg-white py-6 px-6 text-center text-sm font-bold uppercase tracking-wider border-b-4 hover:bg-gray-50 focus:z-10 transition-all duration-300`}
              >
                <span className="text-2xl mb-2 block">{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.key && (
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-24">
        {/* Blood Type Compatibility Tab */}
        {activeTab === 'compatibility' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-2 bg-red-100 text-red-600 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
                Compatibility
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Blood Type
                <span className="block text-red-600">Compatibility Chart</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Understanding blood type compatibility is crucial for safe transfusions.
              </p>
            </div>

            {/* Blood Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {bloodTypes.map((blood) => (
                <div key={blood.type} className="group relative">
                  <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 group-hover:-translate-y-4">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-2xl font-black text-white">{blood.type}</span>
                      </div>
                      <div className="text-sm font-bold text-gray-500">Population: {blood.population}</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-sm font-bold text-green-700 mb-2">Can donate to:</p>
                        <div className="flex flex-wrap gap-1">
                          {blood.canDonateTo.map((type) => (
                            <span key={type} className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm font-bold text-blue-700 mb-2">Can receive from:</p>
                        <div className="flex flex-wrap gap-1">
                          {blood.canReceiveFrom.map((type) => (
                            <span key={type} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Universal Donor and Recipient */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="group relative">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-red-200 group-hover:-translate-y-2">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mr-6 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-white font-black text-xl">O-</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Universal Donor</h3>
                      <p className="text-red-600 font-semibold">Type O Negative</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Type O negative blood can be given to anyone, regardless of their blood type. 
                    People with this blood type are called universal donors and are especially valuable in emergency situations.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-purple-200 group-hover:-translate-y-2">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-6 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-white font-black text-xl">AB+</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Universal Recipient</h3>
                      <p className="text-purple-600 font-semibold">Type AB Positive</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Type AB positive blood can receive blood from all blood types. 
                    People with this blood type are called universal recipients as they are compatible with any donor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blood Components Tab */}
        {activeTab === 'components' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-2 bg-red-100 text-red-600 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
                Components
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Blood
                <span className="block text-red-600">Components</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Blood can be separated into different components, each serving a specific purpose in medical treatments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bloodComponents.map((component, index) => (
                <div key={index} className="group relative">
                  <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 group-hover:-translate-y-2">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform shadow-lg text-white">
                        {component.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{component.name}</h3>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed mb-8">{component.description}</p>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-bold text-gray-700 mb-1">Compatibility:</p>
                        <p className="text-gray-900 text-sm">{component.compatibility}</p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm font-bold text-blue-700 mb-1">Storage Life:</p>
                        <p className="text-gray-900 text-sm font-semibold">{component.storageLife}</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-sm font-bold text-green-700 mb-1">Donation Frequency:</p>
                        <p className="text-gray-900 text-sm font-semibold">{component.donationFrequency}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blood Facts Tab */}
        {activeTab === 'facts' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-2 bg-red-100 text-red-600 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
                Facts
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Blood Donation
                <span className="block text-red-600">Facts</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Interesting facts about blood and blood donation that you might not know.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {bloodFacts.map((fact, index) => (
                <div key={index} className="group relative">
                  <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group-hover:-translate-y-2">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-1">{fact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodTypeInfoPage;
