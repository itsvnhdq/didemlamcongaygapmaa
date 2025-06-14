import React, { useState } from "react";

interface DonationData {
  donorId: string;
  donorName: string;
  bloodType: string;
  dateOfBirth: string;
  gender: string;
  weight: string;
  height: string;
  temperature: string;
  bloodPressure: string;
  hemoglobinLevel: string;
  pulse: string;
  eligibilityStatus: boolean;
  healthNotes: string;
  donationType: string;
  amount: string;
  components: {
    redBloodCells: boolean;
    plasma: boolean;
    platelets: boolean;
    wholeBlood: boolean;
  };
  startTime: string;
  endTime: string;
  staffId: string;
  staffName: string;
  status: string;
  notes: string;
}

interface ProcessProps {
  onBackToOverview: () => void;
}

const Process: React.FC<ProcessProps> = ({ onBackToOverview }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [donationData, setDonationData] = useState<DonationData>({
    donorId: '12345',
    donorName: 'John Smith',
    bloodType: 'A+',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    weight: '',
    height: '',
    temperature: '',
    bloodPressure: '',
    hemoglobinLevel: '',
    pulse: '',
    eligibilityStatus: true,
    healthNotes: '',
    donationType: 'whole_blood',
    amount: '450',
    components: {
      redBloodCells: true,
      plasma: false,
      platelets: false,
      wholeBlood: true
    },
    startTime: '',
    endTime: '',
    staffId: 'STAFF001',
    staffName: 'Dr. Sarah Johnson',
    status: 'in-progress',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDonationData({
      ...donationData,
      [name]: value
    });
  };

  const handleComponentChange = (component: string) => {
    setDonationData({
      ...donationData,
      components: {
        ...donationData.components,
        [component]: !donationData.components[component as keyof typeof donationData.components]
      }
    });
  };

  const handleEligibilityChange = (eligible: boolean) => {
    setDonationData({
      ...donationData,
      eligibilityStatus: eligible
    });
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Donation process completed:', donationData);
    alert('Donation process completed successfully!');
    // Reset process
    setCurrentStep(1);
    onBackToOverview();
  };

  return (
    <>
      {/* Enhanced Donor Information Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Donor Information</h3>
            <p className="mt-1 text-gray-600">Personal details and medical history</p>
          </div>
          <span className="px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">
            Active Donor
          </span>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <dt className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Full Name</dt>
              <dd className="text-lg font-bold text-blue-900">{donationData.donorName}</dd>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <dt className="text-sm font-bold text-purple-800 uppercase tracking-wider mb-2">Donor ID</dt>
              <dd className="text-lg font-bold text-purple-900">{donationData.donorId}</dd>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <dt className="text-sm font-bold text-red-800 uppercase tracking-wider mb-2">Blood Type</dt>
              <dd className="text-lg font-bold text-red-900">{donationData.bloodType}</dd>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
              <dt className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Date of Birth</dt>
              <dd className="text-lg font-bold text-emerald-900">{donationData.dateOfBirth}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Enhanced Process Steps */}
      <div className="mb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-8 lg:space-y-0">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className={`rounded-2xl transition duration-500 ease-in-out h-16 w-16 flex items-center justify-center mb-4 ${
                currentStep >= 1 ? 'bg-gradient-to-br from-red-600 to-red-700 shadow-xl' : 'bg-gray-200'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={currentStep >= 1 ? 'text-white' : 'text-gray-500'}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-700">
                Health Check
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Step 1 of 3
              </div>
            </div>

            {/* Connector 1 */}
            <div className="hidden lg:flex flex-1 items-center justify-center px-4">
              <div className={`h-1 flex-1 transition duration-500 ease-in-out ${currentStep >= 2 ? 'bg-red-600' : 'bg-gray-300'} rounded-full`}></div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className={`rounded-2xl transition duration-500 ease-in-out h-16 w-16 flex items-center justify-center mb-4 ${
                currentStep >= 2 ? 'bg-gradient-to-br from-red-600 to-red-700 shadow-xl' : 'bg-gray-200'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={currentStep >= 2 ? 'text-white' : 'text-gray-500'}>
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-700">
                Donation
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Step 2 of 3
              </div>
            </div>

            {/* Connector 2 */}
            <div className="hidden lg:flex flex-1 items-center justify-center px-4">
              <div className={`h-1 flex-1 transition duration-500 ease-in-out ${currentStep >= 3 ? 'bg-red-600' : 'bg-gray-300'} rounded-full`}></div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className={`rounded-2xl transition duration-500 ease-in-out h-16 w-16 flex items-center justify-center mb-4 ${
                currentStep >= 3 ? 'bg-gradient-to-br from-red-600 to-red-700 shadow-xl' : 'bg-gray-200'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={currentStep >= 3 ? 'text-white' : 'text-gray-500'}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-700">
                Completion
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Step 3 of 3
              </div>
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="lg:hidden mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{currentStep}/3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Enhanced Health Check */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Health Assessment</h3>
            <p className="mt-2 text-gray-600">
              Comprehensive health evaluation to ensure donor safety and eligibility
            </p>
          </div>
          <div className="p-8">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <label htmlFor="weight" className="block text-sm font-bold text-gray-700 mb-2">
                    Weight (kg) *
                  </label>
                  <input
                    type="text"
                    name="weight"
                    id="weight"
                    value={donationData.weight}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Enter weight"
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-bold text-gray-700 mb-2">
                    Height (cm) *
                  </label>
                  <input
                    type="text"
                    name="height"
                    id="height"
                    value={donationData.height}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Enter height"
                  />
                </div>
                <div>
                  <label htmlFor="temperature" className="block text-sm font-bold text-gray-700 mb-2">
                    Temperature (°C) *
                  </label>
                  <input
                    type="text"
                    name="temperature"
                    id="temperature"
                    value={donationData.temperature}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="36.5"
                  />
                </div>
                <div>
                  <label htmlFor="bloodPressure" className="block text-sm font-bold text-gray-700 mb-2">
                    Blood Pressure *
                  </label>
                  <input
                    type="text"
                    name="bloodPressure"
                    id="bloodPressure"
                    value={donationData.bloodPressure}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label htmlFor="hemoglobinLevel" className="block text-sm font-bold text-gray-700 mb-2">
                    Hemoglobin Level *
                  </label>
                  <input
                    type="text"
                    name="hemoglobinLevel"
                    id="hemoglobinLevel"
                    value={donationData.hemoglobinLevel}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="12.5"
                  />
                </div>
                <div>
                  <label htmlFor="pulse" className="block text-sm font-bold text-gray-700 mb-2">
                    Pulse Rate *
                  </label>
                  <input
                    type="text"
                    name="pulse"
                    id="pulse"
                    value={donationData.pulse}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="mt-8">
                <label className="block text-sm font-bold text-gray-700 mb-4">Health Notes</label>
                <textarea
                  name="healthNotes"
                  value={donationData.healthNotes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="Any additional health observations..."
                />
              </div>

              <div className="mt-8">
                <label className="block text-sm font-bold text-gray-700 mb-4">Eligibility Assessment</label>
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input
                      id="eligible-yes"
                      name="eligibilityStatus"
                      type="radio"
                      checked={donationData.eligibilityStatus === true}
                      onChange={() => handleEligibilityChange(true)}
                      className="focus:ring-red-500 h-5 w-5 text-red-600 border-gray-300"
                    />
                    <label htmlFor="eligible-yes" className="ml-3 block text-sm font-semibold text-emerald-700">
                      ✓ Eligible for Donation
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="eligible-no"
                      name="eligibilityStatus"
                      type="radio"
                      checked={donationData.eligibilityStatus === false}
                      onChange={() => handleEligibilityChange(false)}
                      className="focus:ring-red-500 h-5 w-5 text-red-600 border-gray-300"
                    />
                    <label htmlFor="eligible-no" className="ml-3 block text-sm font-semibold text-red-700">
                      ✗ Not Eligible
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="px-8 py-6 bg-gray-50 rounded-b-2xl flex justify-between">
            <button
              type="button"
              onClick={onBackToOverview}
              className="inline-flex justify-center py-3 px-6 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Back to Overview
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={!donationData.eligibilityStatus}
              className={`inline-flex justify-center py-3 px-6 border border-transparent rounded-xl text-sm font-bold text-white transition-all shadow-lg ${
                donationData.eligibilityStatus 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-xl' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {donationData.eligibilityStatus ? 'Proceed to Donation' : 'Donor Not Eligible'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Enhanced Donation */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Donation Process</h3>
            <p className="mt-2 text-gray-600">
              Monitor and record the donation procedure details
            </p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Donation Type *</label>
                <select
                  name="donationType"
                  value={donationData.donationType}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                >
                  <option value="whole_blood">Whole Blood</option>
                  <option value="plasma">Plasma</option>
                  <option value="platelets">Platelets</option>
                  <option value="red_cells">Red Blood Cells</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount (ml) *</label>
                <input
                  type="text"
                  name="amount"
                  value={donationData.amount}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="450"
                />
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-bold text-gray-700 mb-4">Blood Components</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(donationData.components).map(([component, checked]) => (
                  <div key={component} className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-red-300 transition-all">
                    <input
                      id={component}
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleComponentChange(component)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor={component} className="ml-3 text-sm font-medium text-gray-700 capitalize">
                      {component.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={donationData.startTime}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={donationData.endTime}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">Process Notes</label>
              <textarea
                name="notes"
                value={donationData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="Any observations during the donation process..."
              />
            </div>
          </div>
          <div className="px-8 py-6 bg-gray-50 rounded-b-2xl flex justify-between">
            <button
              type="button"
              onClick={handlePreviousStep}
              className="inline-flex justify-center py-3 px-6 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Back to Health Check
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex justify-center py-3 px-6 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
            >
              Complete Donation
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Enhanced Completion */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Donation Completed</h3>
            <p className="mt-2 text-gray-600">
              Finalize the donation process and provide post-donation care instructions
            </p>
          </div>
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl mb-6">
                <svg className="h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Donation Successfully Completed</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                The blood donation has been successfully processed and recorded in the system.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 mb-8">
              <h4 className="text-lg font-bold text-blue-900 mb-6">Donation Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Donor</p>
                  <p className="text-blue-900 font-bold">{donationData.donorName}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Blood Type</p>
                  <p className="text-blue-900 font-bold">{donationData.bloodType}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Donation Type</p>
                  <p className="text-blue-900 font-bold capitalize">{donationData.donationType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Amount</p>
                  <p className="text-blue-900 font-bold">{donationData.amount} ml</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Duration</p>
                  <p className="text-blue-900 font-bold">{donationData.startTime} - {donationData.endTime}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Staff</p>
                  <p className="text-blue-900 font-bold">{donationData.staffName}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 border border-amber-200">
              <h4 className="text-lg font-bold text-amber-900 mb-4">Post-Donation Instructions</h4>
              <ul className="space-y-3 text-amber-800">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Rest for at least 15 minutes before leaving
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Drink plenty of fluids over the next 24 hours
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Avoid heavy lifting for the next 4-6 hours
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Keep the bandage on for at least 4 hours
                </li>
              </ul>
            </div>
          </div>
          <div className="px-8 py-6 bg-gray-50 rounded-b-2xl flex justify-between">
            <button
              type="button"
              onClick={handlePreviousStep}
              className="inline-flex justify-center py-3 px-6 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex justify-center py-3 px-6 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl"
            >
              Finalize & Return to Overview
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Process;
