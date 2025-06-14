import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AppointmentBookingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    facilityId: '',
    date: '',
    timeSlot: '',
    donationType: 'whole_blood',
    notes: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data
  const [facilities] = useState([
    { id: '1', name: 'Central Blood Bank', address: '123 Medical Center Drive, City', distance: '2.3 miles' },
    { id: '2', name: 'City Medical Center', address: '456 Hospital Road, City', distance: '4.7 miles' },
    { id: '3', name: 'Community Health Clinic', address: '789 Health Avenue, City', distance: '6.2 miles' }
  ]);

  const [availableDates] = useState([
    '2025-05-20',
    '2025-05-21',
    '2025-05-22',
    '2025-05-23',
    '2025-05-24'
  ]);

  const [timeSlots] = useState([
    { id: '1', time: '09:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: false },
    { id: '4', time: '12:00 PM', available: true },
    { id: '5', time: '01:00 PM', available: true },
    { id: '6', time: '02:00 PM', available: false },
    { id: '7', time: '03:00 PM', available: true },
    { id: '8', time: '04:00 PM', available: true }
  ]);

  const [donationTypes] = useState([
    { id: 'whole_blood', name: 'Whole Blood', description: 'Donation of whole blood, takes about 10 minutes', eligibilityPeriod: '56 days' },
    { id: 'plasma', name: 'Plasma', description: 'Donation of plasma only, takes about 45 minutes', eligibilityPeriod: '28 days' },
    { id: 'platelets', name: 'Platelets', description: 'Donation of platelets only, takes about 90 minutes', eligibilityPeriod: '7 days' },
    { id: 'double_red', name: 'Double Red Cells', description: 'Donation of red blood cells only, takes about 30 minutes', eligibilityPeriod: '112 days' }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.facilityId) newErrors.facilityId = 'Please select a facility';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.timeSlot) newErrors.timeSlot = 'Please select a time slot';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.donationType) newErrors.donationType = 'Please select a donation type';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep3()) {
      // Here we would typically send the data to the backend
      console.log('Form submitted:', formData);
      // For now, we'll just show a success message
      alert('Appointment booked successfully!');
      // Redirect would happen here
    }
  };

  const getSelectedFacility = () => {
    return facilities.find(facility => facility.id === formData.facilityId);
  };

  const getSelectedTimeSlot = () => {
    return timeSlots.find(slot => slot.id === formData.timeSlot)?.time;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getSelectedDonationType = () => {
    return donationTypes.find(type => type.id === formData.donationType)?.name;
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-4">
            Book Your Blood Donation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Schedule your next donation appointment and continue making a difference in lives
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-10">
            {/* Enhanced Progress Bar */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-8">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-sm transition-all duration-300 ${
                        step >= stepNumber 
                          ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-600 text-white shadow-lg' 
                          : 'border-gray-300 text-gray-400 bg-white'
                      }`}>
                        {step > stepNumber ? (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          stepNumber
                        )}
                      </div>
                      <div className="ml-4 text-left">
                        <p className={`text-sm font-semibold ${step >= stepNumber ? 'text-red-600' : 'text-gray-400'}`}>
                          Step {stepNumber}
                        </p>
                        <p className={`text-xs ${step >= stepNumber ? 'text-gray-700' : 'text-gray-400'}`}>
                          {stepNumber === 1 ? 'Select Facility' : 
                           stepNumber === 2 ? 'Choose Date & Time' : 'Confirm Details'}
                        </p>
                      </div>
                      {stepNumber < 3 && (
                        <div className={`w-16 h-0.5 ml-8 transition-all duration-300 ${
                          step > stepNumber ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Select Facility */}
              {step === 1 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Select a Donation Facility</h2>
                    <p className="text-lg text-gray-600">
                      Choose the most convenient location for your blood donation
                    </p>
                  </div>

                  <div className="space-y-6">
                    {facilities.map((facility) => (
                      <div key={facility.id} className="relative">
                        <input
                          id={`facility-${facility.id}`}
                          name="facilityId"
                          type="radio"
                          value={facility.id}
                          checked={formData.facilityId === facility.id}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <label
                          htmlFor={`facility-${facility.id}`}
                          className={`block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-red-300 transform hover:-translate-y-1 ${
                            formData.facilityId === facility.id
                              ? 'border-red-500 shadow-xl bg-gradient-to-r from-red-50 to-red-100'
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-xl ${
                                formData.facilityId === facility.id 
                                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">{facility.name}</h3>
                                <p className="text-gray-600 mt-1">{facility.address}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {facility.distance}
                              </span>
                              {formData.facilityId === facility.id && (
                                <div className="w-6 h-6 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                    {errors.facilityId && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">{errors.facilityId}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Choose Date & Time */}
              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Select Date & Time</h2>
                    <p className="text-lg text-gray-600">
                      Choose your preferred date and time slot for donation
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Date Selection */}
                    <div className="space-y-4">
                      <label htmlFor="date" className="block text-lg font-semibold text-gray-900">Select Date</label>
                      <select
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 text-lg border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Select a date</option>
                        {availableDates.map((date) => (
                          <option key={date} value={date}>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</option>
                        ))}
                      </select>
                      {errors.date && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm font-medium">{errors.date}</p>
                        </div>
                      )}
                    </div>

                    {/* Time Slot Selection */}
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-gray-900">Select Time Slot</label>
                      <div className="grid grid-cols-2 gap-3">
                        {timeSlots.map((slot) => (
                          <div key={slot.id}>
                            <input
                              type="radio"
                              id={`time-${slot.id}`}
                              name="timeSlot"
                              value={slot.id}
                              checked={formData.timeSlot === slot.id}
                              onChange={handleChange}
                              disabled={!slot.available}
                              className="hidden"
                            />
                            <label
                              htmlFor={`time-${slot.id}`}
                              className={`flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                                !slot.available
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                                  : formData.timeSlot === slot.id
                                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg border-2 border-red-600'
                                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-red-300 hover:bg-red-50'
                              }`}
                            >
                              {slot.time}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.timeSlot && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm font-medium">{errors.timeSlot}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm Details */}
              {step === 3 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Confirm Appointment Details</h2>
                    <p className="text-lg text-gray-600">
                      Review your selection and complete your booking
                    </p>
                  </div>

                  {/* Appointment Summary */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Appointment Summary</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Facility:</span>
                        <span className="text-gray-900 font-semibold">{getSelectedFacility()?.name}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Address:</span>
                        <span className="text-gray-900 font-semibold text-right">{getSelectedFacility()?.address}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Date:</span>
                        <span className="text-gray-900 font-semibold">{formData.date && new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-gray-600 font-medium">Time:</span>
                        <span className="text-gray-900 font-semibold">{getSelectedTimeSlot()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Donation Type */}
                  <div className="space-y-4">
                    <label htmlFor="donationType" className="block text-lg font-semibold text-gray-900">Donation Type</label>
                    <select
                      id="donationType"
                      name="donationType"
                      value={formData.donationType}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-lg border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all ${errors.donationType ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      {donationTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    {errors.donationType && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">{errors.donationType}</p>
                      </div>
                    )}
                    
                    {formData.donationType && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <p className="text-blue-800 font-medium">{donationTypes.find(type => type.id === formData.donationType)?.description}</p>
                        <p className="text-blue-600 text-sm mt-2">Eligibility period: {donationTypes.find(type => type.id === formData.donationType)?.eligibilityPeriod}</p>
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-4">
                    <label htmlFor="notes" className="block text-lg font-semibold text-gray-900">Additional Notes (Optional)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all"
                      placeholder="Any health concerns or special requirements?"
                    ></textarea>
                  </div>

                  {/* Terms Agreement */}
                  <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 pt-1">
                        <input
                          id="agreeToTerms"
                          name="agreeToTerms"
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                          className={`h-5 w-5 text-red-600 focus:ring-red-500 border-2 rounded transition-all ${errors.agreeToTerms ? 'border-red-500' : 'border-gray-300'}`}
                        />
                      </div>
                      <div className="text-sm">
                        <label htmlFor="agreeToTerms" className="font-medium text-gray-900 cursor-pointer">
                          I confirm that I meet the eligibility requirements and agree to the{' '}
                          <Link to="/terms" className="text-red-600 hover:text-red-700 font-semibold underline">
                            donation terms and conditions
                          </Link>
                        </label>
                        {errors.agreeToTerms && (
                          <div className="flex items-center space-x-2 text-red-600 mt-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs font-medium">{errors.agreeToTerms}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Navigation Buttons */}
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-lg font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-lg font-semibold rounded-xl text-white hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Continue
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-lg font-semibold rounded-xl text-white hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Book Appointment
                  </button>
                )}
              </div>
            </form>

            {/* Enhanced Help Section */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Need help with your appointment?{' '}
                <Link to="/contact" className="font-semibold text-red-600 hover:text-red-700 transition-colors">
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

export default AppointmentBookingPage;
