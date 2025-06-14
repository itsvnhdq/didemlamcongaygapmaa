import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Medical Team"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-800/50 to-red-600/30" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-white/20 text-white text-sm font-bold uppercase tracking-wider rounded-full mb-6">
              About Us
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
              Our Blood Donation
              <span className="block text-red-200">Initiative</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-red-100 max-w-4xl mx-auto leading-relaxed">
              Connecting donors with those in need to save lives through safe and efficient blood donation.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-red-100 text-red-600 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
              Our Mission
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Ensuring Safe Blood
              <span className="block text-red-600">For Everyone</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="text-xl text-gray-600 leading-relaxed">
                Our blood donation platform aims to bridge the gap between blood donors and recipients, making the process of blood donation more accessible, efficient, and transparent.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that by leveraging technology, we can help save more lives by ensuring timely access to safe blood for those who need it most.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through our platform, donors can easily schedule appointments, track their donation history, and learn about the impact of their contributions. Recipients and medical facilities can quickly find compatible donors, manage blood inventory, and respond to emergency situations.
              </p>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Lives Saved</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-black text-red-600">10,000+</div>
                      <p className="text-gray-600">Blood Units Collected</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-red-600">30,000+</div>
                      <p className="text-gray-600">Lives Potentially Saved</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-red-100 text-red-600 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
              Our Values
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Principles That
              <span className="block text-red-600">Guide Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The core values that drive our work and shape our decisions every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Accessibility",
                description: "We strive to make blood donation accessible to everyone who is eligible to donate, regardless of their location or background."
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Safety",
                description: "The safety of donors and recipients is our top priority. We adhere to the highest standards of safety and quality in all aspects of our operations."
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                title: "Transparency",
                description: "We believe in being transparent about our processes, the use of donated blood, and the impact of donations on recipients' lives."
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Innovation",
                description: "We continuously seek innovative ways to improve the blood donation experience and increase the efficiency of blood distribution."
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Community",
                description: "We foster a sense of community among donors, recipients, and healthcare providers, recognizing that we are all part of a life-saving network."
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Compassion",
                description: "Every action we take is driven by compassion for those in need and respect for the generosity of our donors."
              }
            ].map((value, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 group-hover:-translate-y-2 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg text-white">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-red-100 text-red-600 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
              Our Team
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Dedicated
              <span className="block text-red-600">Professionals</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Meet the passionate individuals committed to our life-saving mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Medical Director",
                description: "With over 15 years of experience in hematology, Dr. Johnson ensures that our blood donation processes meet the highest medical standards.",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              },
              {
                name: "Michael Chen",
                role: "Technology Lead",
                description: "Michael leads our technology team, developing innovative solutions to streamline the blood donation process and improve user experience.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              },
              {
                name: "Emily Rodriguez",
                role: "Community Outreach",
                description: "Emily works with local communities to raise awareness about the importance of blood donation and organize donation drives.",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              }
            ].map((member, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img 
                      className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      src={member.image} 
                      alt={member.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  <div className="p-8">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-full">
                        {member.role}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-center">{member.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-24 bg-gradient-to-br from-red-600 to-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-white/20 text-white text-sm font-bold uppercase tracking-wider rounded-full mb-4">
              Contact Us
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Get in Touch
            </h2>
            <p className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Have questions or want to learn more? Our team is here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-8">Main Office</h3>
                <div className="space-y-6">
                  {[
                    {
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                      info: ["123 Medical Center Drive", "Suite 456", "Healthville, HV 12345"]
                    },
                    {
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      ),
                      info: ["(555) 123-4567"]
                    },
                    {
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                      info: ["info@blooddonation.org"]
                    },
                    {
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      info: ["Monday - Friday: 9am - 5pm"]
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                        {item.icon}
                      </div>
                      <div className="space-y-1">
                        {item.info.map((line, i) => (
                          <p key={i} className="text-red-100">{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-8">Send us a message</h3>
              <form className="space-y-6">
                {[
                  { label: "Name", type: "text", id: "name" },
                  { label: "Email", type: "email", id: "email" }
                ].map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-bold text-white mb-2">{field.label}</label>
                    <input 
                      type={field.type} 
                      id={field.id} 
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-red-200 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm" 
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Message</label>
                  <textarea 
                    rows={4} 
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-red-200 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm resize-none" 
                    placeholder="Enter your message"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-white text-red-600 py-4 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
