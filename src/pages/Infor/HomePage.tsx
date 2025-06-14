import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, UserRole } from '../../App';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Blood Donation"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-800/50 to-red-600/30" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative max-w-7xl mx-auto py-32 px-4 sm:py-40 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-tight">
              Donate Blood,
              <span className="block text-red-200">Save Lives</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-red-100 max-w-4xl mx-auto leading-relaxed">
              Your blood donation can save up to three lives. Join our community of heroes and help those in need.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className="group inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-full text-lg font-bold hover:bg-red-50 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/25"
              >
                <span>Register as Donor</span>
                <svg className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              {(user?.role === UserRole.Staff || user?.role === UserRole.Admin) && (
                <Link
                  to="/appointment/newAppointment"
                  className="group inline-flex items-center px-8 py-4 bg-red-800/80 backdrop-blur-sm text-white rounded-full text-lg font-bold hover:bg-red-900/80 transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
                >
                  <svg className="mr-3 h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Emergency Request</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Facility Introduction */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-red-100 text-red-600 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
              Our Facility
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              State-of-the-art
              <span className="block text-red-600">Medical Center</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our medical facility is equipped with the latest technology and staffed by experienced professionals dedicated to safe and efficient blood donation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
                title: "Modern Equipment",
                description: "Our facility uses the latest medical equipment to ensure safe and comfortable blood donation experiences."
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: "Expert Staff",
                description: "Our team of medical professionals is highly trained and dedicated to providing excellent care."
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Safety First",
                description: "We follow strict safety protocols to protect both donors and recipients throughout the donation process."
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Quick Process",
                description: "Our efficient process ensures that your donation experience is quick and convenient."
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="flex items-start space-x-6 p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Blood Type Cards */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-red-100 text-red-600 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
              Blood Types
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Understanding Blood
              <span className="block text-red-600">Compatibility</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Learn about different blood types and their compatibility for transfusions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { type: "A+", donate: "A+, AB+", receive: "A+, A-, O+, O-", population: "~35.7%" },
              { type: "O+", donate: "O+, A+, B+, AB+", receive: "O+, O-", population: "~37.4%" },
              { type: "B+", donate: "B+, AB+", receive: "B+, B-, O+, O-", population: "~8.5%" },
              { type: "AB+", donate: "AB+ only", receive: "All blood types", population: "~3.4%" }
            ].map((blood, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 group-hover:-translate-y-4">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-2xl font-black text-white">{blood.type}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 rounded-xl p-4">
                      <p className="text-sm font-bold text-red-700 mb-1">Can donate to:</p>
                      <p className="text-gray-900 font-semibold">{blood.donate}</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-sm font-bold text-green-700 mb-1">Can receive from:</p>
                      <p className="text-gray-900 font-semibold">{blood.receive}</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm font-bold text-blue-700 mb-1">Population:</p>
                      <p className="text-gray-900 font-semibold">{blood.population}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/blood-types"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full text-lg font-bold hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <span>Learn More About Blood Types</span>
              <svg className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Blog Posts */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-red-100 text-red-600 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
              Blog
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Featured
              <span className="block text-red-600">Stories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Read about experiences and insights from our donors and medical professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                category: "Experience",
                title: "My First Blood Donation Experience",
                excerpt: "I was nervous about donating blood for the first time, but the staff made it a comfortable and rewarding experience.",
                author: { name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
                date: "Mar 16, 2025",
                readTime: "4 min read",
                link: "/blog/my-first-donation"
              },
              {
                image: "https://images.unsplash.com/photo-1584118624012-df056829fbd0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                category: "Medical",
                title: "The Importance of Regular Blood Donation",
                excerpt: "Regular blood donation not only saves lives but also provides health benefits for the donors themselves.",
                author: { name: "Dr. Michael Chen", avatar: "https://randomuser.me/api/portraits/men/46.jpg" },
                date: "Apr 2, 2025",
                readTime: "6 min read",
                link: "/blog/importance-of-blood-donation"
              },
              {
                image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                category: "Event",
                title: "Community Blood Drive Success",
                excerpt: "Our recent community blood drive collected over 100 units of blood, potentially saving up to 300 lives.",
                author: { name: "Emily Rodriguez", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
                date: "Apr 12, 2025",
                readTime: "3 min read",
                link: "/blog/community-blood-drive"
              }
            ].map((post, index) => (
              <article key={index} className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img 
                    className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    src={post.image} 
                    alt={post.title} 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <Link to={post.link} className="block group-hover:text-red-600 transition-colors">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>
                  </Link>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img className="h-10 w-10 rounded-full ring-2 ring-gray-200" src={post.author.avatar} alt={post.author.name} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
                        <p className="text-xs text-gray-500">{post.date}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/blog"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full text-lg font-bold hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <span>View All Blog Posts</span>
              <svg className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Donation Process */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-red-100 text-red-600 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              The Blood Donation
              <span className="block text-red-600">Process</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Learn what to expect when you donate blood at our facility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              { number: "1", title: "Registration", description: "Sign up online or in person. Complete a brief health questionnaire to ensure eligibility." },
              { number: "2", title: "Health Check", description: "Our staff will check your temperature, blood pressure, pulse, and hemoglobin levels." },
              { number: "3", title: "Donation", description: "The actual donation takes only 8-10 minutes. You'll be comfortable in a donation chair." },
              { number: "4", title: "Recovery", description: "Rest and enjoy refreshments for 15 minutes while your body adjusts to the donation." },
              { number: "5", title: "Processing", description: "Your donation is tested, processed, and prepared for patients in need." },
              { number: "6", title: "Saving Lives", description: "Your donation is delivered to hospitals and used to help patients in need." }
            ].map((step, index) => (
              <div key={index} className="group relative">
                <div className="text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <span className="text-2xl font-black text-white">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/appointment/newAppointment"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full text-lg font-bold hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Book an Appointment</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Contact Section */}
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
              Have questions about blood donation? Our team is here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
                <div className="space-y-6">
                  {[
                    {
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                      info: ["Slot E2a - 7, D1 road, SHTP, Long Thanh My District", "Thu Duc City, HCMC, Vietnam"]
                    },
                    {
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      ),
                      info: ["(123) 456-7890"]
                    },
                    {
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                      info: ["noreply.blooddonationstation@gmail.com"]
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
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Operating Hours</h3>
                <div className="space-y-3 text-red-100">
                  <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                  <p>Saturday: 9:00 AM - 5:00 PM</p>
                  <p>Sunday: Closed</p>
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

export default HomePage;