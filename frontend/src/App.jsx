import { useState, useEffect } from 'react'

// Navigation Component - Clean and friendly
function Navigation({ currentPage, setCurrentPage }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'program', label: 'Program' },
    { id: 'apply', label: 'Apply' },
    { id: 'support', label: 'Support Us' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 group"
          >
            {/* Logo placeholder - replace with actual logo */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                <span className="text-2xl">🔬</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-teal-700 leading-tight">CURE</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Academy</span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a 
              href="#register"
              className="ml-2 px-5 py-2 bg-coral-400 text-white font-medium rounded-full hover:bg-coral-500 transition-colors"
              style={{ backgroundColor: '#F4A574' }}
            >
              Register
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium ${
                  currentPage === item.id
                    ? 'text-teal-700 bg-teal-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a 
              href="#register"
              className="block mt-3 px-4 py-3 text-center text-white font-medium rounded-full"
              style={{ backgroundColor: '#F4A574' }}
            >
              Register Now
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

// Home Page
function HomePage({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Light and welcoming */}
      <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                Summer 2026 Registration Open
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Empowering the next generation of{' '}
                <span className="text-teal-600">cancer researchers</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Inspiring high school students to learn about cancer research through expert-led lectures and hands-on lab experiences.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => setCurrentPage('apply')}
                  className="px-8 py-4 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: '#F4A574' }}
                >
                  Join the Program
                </button>
                <button 
                  onClick={() => setCurrentPage('program')}
                  className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-teal-300 hover:text-teal-600 transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center">
                      <span className="text-3xl">👩‍🔬</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Cure Academy</h3>
                      <p className="text-gray-500 text-sm">Inspiring high school students to learn about cancer research</p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="text-4xl">🧬</div>
                    <div className="text-4xl">🔬</div>
                  </div>
                  <div className="bg-sky-50 rounded-2xl p-4">
                    <p className="text-center text-gray-600 font-medium">Our Partners</p>
                    <div className="flex justify-center gap-6 mt-3">
                      <div className="w-16 h-16 bg-lime-300 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-gray-800">Hk</span>
                      </div>
                      <div className="w-16 h-16 bg-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-white">Nb</span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-1">
                      <span className="text-xs text-gray-500">HYPOTHEkids</span>
                      <span className="text-xs text-gray-500">NYbioforce</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Benefits */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Program Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive program gives students everything they need to explore careers in cancer research.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '💡',
                title: 'Learn about cancer biology',
                desc: 'from expert professors',
                color: 'bg-amber-50 border-amber-200'
              },
              {
                icon: '🧪',
                title: 'Gain hands-on lab experience',
                desc: 'in real research settings',
                color: 'bg-teal-50 border-teal-200'
              },
              {
                icon: '👥',
                title: 'Connect with like-minded students',
                desc: 'and build lasting networks',
                color: 'bg-sky-50 border-sky-200'
              },
            ].map((benefit, i) => (
              <div key={i} className={`rounded-2xl p-8 border-2 ${benefit.color} text-center hover:shadow-lg transition-shadow`}>
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Program CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-teal-500 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join the Program</h2>
          <p className="text-teal-100 mb-8 text-lg">
            Ready to start your journey into cancer research?
          </p>
          <button 
            onClick={() => setCurrentPage('apply')}
            className="px-10 py-4 bg-white text-teal-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Join the Program
          </button>
        </div>
      </section>

      {/* Lecture Outline Preview */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Lecture Outline</h2>
            <p className="text-gray-600">5 weeks of comprehensive cancer biology education</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: '🧬', label: 'Cancer cell', color: 'bg-pink-100' },
              { icon: '🌿', label: 'Micro-environment', color: 'bg-green-100' },
              { icon: '⚡', label: 'Immune system', color: 'bg-amber-100' },
              { icon: '👤', label: 'Host', color: 'bg-sky-100' },
              { icon: '🌍', label: 'Environment', color: 'bg-emerald-100' },
            ].map((topic, i) => (
              <div key={i} className={`${topic.color} rounded-2xl p-6 text-center w-36 hover:shadow-lg transition-shadow`}>
                <div className="text-4xl mb-3">{topic.icon}</div>
                <p className="font-medium text-gray-700 text-sm">{topic.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button 
              onClick={() => setCurrentPage('program')}
              className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition-colors"
            >
              View Full Program
            </button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Partners</h2>
          </div>

          <div className="bg-sky-50 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="text-center">
                <div className="w-24 h-24 bg-lime-300 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="font-bold text-3xl text-gray-800">Hk</span>
                </div>
                <p className="font-semibold text-gray-700">HYPOTHEkids</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="font-bold text-3xl text-white">Nb</span>
                </div>
                <p className="font-semibold text-gray-700">NYbioforce</p>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-8 max-w-xl mx-auto">
              In collaboration with NY Bioforce, Cure Academy connects selected students to hands-on, paid biomedical research experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-6 bg-sky-50">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Stay up to date</h2>
          <p className="text-gray-600 mb-6">Get updates about registration, events, and program news.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-full border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none"
            />
            <button 
              className="px-8 py-3 text-white font-semibold rounded-full"
              style={{ backgroundColor: '#F4A574' }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

// About Page
function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            About <span className="text-teal-600">Cure Academy</span>
          </h1>
          <p className="text-lg text-gray-600">
            Inspiring the next generation of cancer researchers and physicians.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-4">
                Our Mission
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Nurture the next generation of cancer researchers and physicians
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Cure Academy is an educational program designed for students interested in learning about cancer through lecture series by physicians, scientists, and professors.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe that early exposure to biomedical research can spark lifelong passions and lead to groundbreaking discoveries in cancer treatment and prevention.
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl p-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Our Goal</h3>
                  <p className="text-gray-600">
                    Connect passionate students with hands-on research experiences and expert mentorship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-4">
              Our Partners
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              In Collaboration With
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-lime-300 rounded-xl flex items-center justify-center">
                  <span className="font-bold text-2xl text-gray-800">Hk</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">HYPOTHEkids</h3>
                  <p className="text-gray-500 text-sm">Educational Partner</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                HYPOTHEkids provides STEM education opportunities for students from diverse backgrounds.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="font-bold text-2xl text-white">Nb</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">NY Bioforce</h3>
                  <p className="text-gray-500 text-sm">Research Partner</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                NY Bioforce provides paid summer internships at cutting-edge research labs including Columbia University.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">What We Offer</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🔬', title: 'Research Experience', desc: 'Hands-on lab work' },
              { icon: '📚', title: 'Expert Education', desc: 'Learn from professionals' },
              { icon: '🤝', title: 'Mentorship', desc: 'Personal guidance' },
              { icon: '💰', title: 'Paid Internship', desc: 'Summer opportunities' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// Program Page
function ProgramPage({ setCurrentPage }) {
  const speakers = [
    { name: 'Dr. Rebecca Schmitt', lecture: 'Cancer Cell', color: 'bg-pink-100' },
    { name: 'Dr. Colleen Sweeney', lecture: 'Tumor Microenvironment', color: 'bg-green-100' },
    { name: 'Dr. Maly Fenelus', lecture: 'The Role of Immune System in Cancer', color: 'bg-amber-100' },
    { name: 'Dr. Patrick McGrillivray', lecture: 'Understanding the Patient', color: 'bg-sky-100' },
    { name: 'Dr. Justin Colacino', lecture: 'Environments Impact on Cancer', color: 'bg-emerald-100' },
  ]

  const timeline = [
    { dates: 'June 22-26, 2026', topic: 'Cancer Cell', icon: '🧬' },
    { dates: 'June 29-July 3, 2026', topic: 'Tumor Microenvironment', icon: '🌿' },
    { dates: 'July 6-10, 2026', topic: 'The Immune System in Cancer', icon: '⚡' },
    { dates: 'July 13-17, 2026', topic: 'The Role of the Host', icon: '👤' },
    { dates: 'July 20-25, 2026', topic: 'Environmental Impacts on Cancer', icon: '🌍' },
  ]

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our <span className="text-teal-600">Program</span>
          </h1>
          <p className="text-lg text-gray-600">
            A two-phase journey from foundational learning to hands-on research.
          </p>
        </div>
      </section>

      {/* Program Benefits Banner */}
      <section className="py-12 px-6 bg-teal-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Program Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '💡', title: 'Learn about cancer biology', sub: 'from expert professors' },
              { icon: '🧪', title: 'Gain hands-on', sub: 'lab experience' },
              { icon: '👥', title: 'Connect with', sub: 'like-minded students' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-gray-600 text-sm">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 1 */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <span className="font-bold text-teal-700">1</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Phase 1: Lecture Series</h2>
              <p className="text-gray-600">Foundations of Cancer Biology • Summer 2026</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Program Details</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-teal-500 mt-1">✓</span>
                    Open to high school students in any grade
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-500 mt-1">✓</span>
                    5-week virtual program (June-July 2026)
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-500 mt-1">✓</span>
                    1-2 hours per week
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-500 mt-1">✓</span>
                    Led by physicians, scientists, and professors
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-500 mt-1">✓</span>
                    Free program - flexible schedule
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-amber-200">
                <h3 className="font-semibold text-gray-800 mb-4">📅 Important Dates</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Registration Deadline</span>
                    <span className="font-bold text-amber-600">March 1, 2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Program Start</span>
                    <span className="font-semibold text-gray-800">June 22, 2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Program End</span>
                    <span className="font-semibold text-gray-800">July 25, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lecture Outline */}
          <h3 className="text-xl font-bold text-gray-800 mb-6">Lecture Outline</h3>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: '🧬', label: 'Cancer cell', color: 'bg-pink-100' },
              { icon: '🌿', label: 'Micro-environment', color: 'bg-green-100' },
              { icon: '⚡', label: 'Immune system', color: 'bg-amber-100' },
              { icon: '👤', label: 'Host', color: 'bg-sky-100' },
              { icon: '🌍', label: 'Environment', color: 'bg-emerald-100' },
            ].map((topic, i) => (
              <div key={i} className={`${topic.color} rounded-xl p-5 text-center w-32`}>
                <div className="text-3xl mb-2">{topic.icon}</div>
                <p className="font-medium text-gray-700 text-sm">{topic.label}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <h3 className="text-xl font-bold text-gray-800 mb-6">Schedule</h3>
          <div className="space-y-4">
            {timeline.map((week, i) => (
              <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{week.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{week.topic}</p>
                  <p className="text-sm text-gray-500">{week.dates}</p>
                </div>
                <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section className="py-16 px-6 bg-sky-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">Lectures & Speakers</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {speakers.slice(0, 3).map((speaker, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className={`w-20 h-20 ${speaker.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="font-bold text-gray-800">{speaker.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Lecture: {speaker.lecture}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {speakers.slice(3).map((speaker, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className={`w-20 h-20 ${speaker.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="font-bold text-gray-800">{speaker.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Lecture: {speaker.lecture}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 2 */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <span className="font-bold text-cyan-700">2</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Phase 2: Research Internship</h2>
              <p className="text-gray-600">NY Bioforce Partnership • Summer 2027</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-6 md:p-8 mb-8 border-2 border-cyan-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💰</span>
              <p className="font-semibold text-gray-800">
                This is a <span className="text-cyan-600">paid, hands-on summer internship</span> available to up to five selected students.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Eligibility</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-500 mt-1">•</span>
                  Graduating in 2027 or 2028
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-500 mt-1">•</span>
                  At least 16 years old by July 1, 2027
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-500 mt-1">•</span>
                  Strong engagement in Phase 1 lectures
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-500 mt-1">•</span>
                  Meet NY Bioforce eligibility criteria
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-800">Winter 2027</p>
                  <p className="text-sm text-gray-600">NY Bioforce application opens</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-800">Spring 2027</p>
                  <p className="text-sm text-gray-600">50 hours, Saturday sessions at Columbia University</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-800">Summer 2027</p>
                  <p className="text-sm text-gray-600">25 hours/week for 6 weeks in research lab</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-teal-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join?</h2>
          <p className="text-teal-100 mb-8">Registration deadline: March 1, 2026</p>
          <button 
            onClick={() => setCurrentPage('apply')}
            className="px-10 py-4 bg-white text-teal-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Register for Lecture Series
          </button>
        </div>
      </section>
    </div>
  )
}

// Apply Page
function ApplyPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            <span className="text-teal-600">Apply</span> Now
          </h1>
          <p className="text-lg text-gray-600">
            Take the first step towards your future in cancer research.
          </p>
        </div>
      </section>

      {/* Application Card */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Deadline Banner */}
          <div className="rounded-2xl p-6 mb-8 text-center" style={{ backgroundColor: '#F4A574' }}>
            <p className="text-white font-bold text-lg">
              📅 Registration Deadline: <span className="text-2xl">March 1, 2026</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Register for the Lecture Series
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Cure Academy is an educational program designed for students interested in learning about cancer through lecture series by physicians, scientists, and professors.
            </p>

            {/* Who Can Apply */}
            <div className="bg-teal-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">Who Can Apply?</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="text-teal-500 text-xl">✓</span>
                  High school students in any grade
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-teal-500 text-xl">✓</span>
                  Interest in medicine and cancer research
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-teal-500 text-xl">✓</span>
                  Ability to attend virtual lectures (1-2 hours/week)
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="text-center">
              <a 
                href="#register" 
                className="inline-block px-10 py-4 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: '#F4A574' }}
              >
                Register for Lecture Series
              </a>
              <p className="mt-4 text-gray-500 text-sm">
                Free program • Virtual attendance • Flexible schedule
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {[
                {
                  q: 'Is there a cost to participate?',
                  a: 'No, the Phase 1 lecture series is completely free. The Phase 2 internship is actually paid!'
                },
                {
                  q: 'Can I participate if I have other summer commitments?',
                  a: 'Yes! The lectures are scheduled to allow students to participate in other summer activities.'
                },
                {
                  q: 'Do I need prior knowledge of biology?',
                  a: 'No prior specialized knowledge is required. We start with foundational concepts.'
                },
                {
                  q: 'How are students selected for Phase 2?',
                  a: 'Selection is based on engagement during lectures, motivation, and meeting NY Bioforce eligibility criteria.'
                },
              ].map((faq, i) => (
                <details key={i} className="group bg-gray-50 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
                    <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 text-gray-600">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Support Page
function SupportPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            <span className="text-teal-600">Support</span> Our Mission
          </h1>
          <p className="text-lg text-gray-600">
            Help us empower the next generation of cancer researchers.
          </p>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Donate */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-100">
              <div className="text-5xl mb-4">💝</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Make a Donation</h2>
              <p className="text-gray-600 mb-6">
                Your donation helps us provide free educational programs and paid research opportunities to students.
              </p>
              <a 
                href="#donate"
                className="inline-block px-8 py-3 text-white font-semibold rounded-full"
                style={{ backgroundColor: '#F4A574' }}
              >
                Donate Now
              </a>
            </div>

            {/* Volunteer */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border-2 border-teal-100">
              <div className="text-5xl mb-4">🤝</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Involved</h2>
              <p className="text-gray-600 mb-6">
                We're looking for passionate individuals to contribute their expertise and time.
              </p>
              <a 
                href="#volunteer"
                className="inline-block px-8 py-3 bg-teal-500 text-white font-semibold rounded-full hover:bg-teal-600 transition-colors"
              >
                Volunteer With Us
              </a>
            </div>
          </div>

          {/* Volunteer Opportunities */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">Ways to Get Involved</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: '👨‍🏫', title: 'Guest Instructor', desc: 'Share your expertise by leading a lecture session.' },
                { icon: '🎓', title: 'Student Mentor', desc: 'Guide and support students exploring research careers.' },
                { icon: '🔬', title: 'Research Partner', desc: 'Host students in your lab for hands-on experiences.' },
                { icon: '📢', title: 'Ambassador', desc: 'Help spread the word about Cure Academy.' },
              ].map((role, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{role.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{role.title}</h3>
                      <p className="text-gray-600 text-sm">{role.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-sky-50 rounded-2xl p-8 text-center">
              <p className="text-gray-700 mb-4">
                If you are interested in volunteering as a guest instructor or student mentor at Cure Academy, please complete the form below.
              </p>
              <a 
                href="#volunteer-form"
                className="inline-block px-8 py-3 bg-teal-500 text-white font-semibold rounded-full hover:bg-teal-600 transition-colors"
              >
                Complete Volunteer Form
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Contact Page
function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your message! We\'ll get back to you soon.')
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            <span className="text-teal-600">Contact</span> Us
          </h1>
          <p className="text-lg text-gray-600">
            Have questions? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              
              <a 
                href="mailto:cureacademyinfo@gmail.com"
                className="flex items-center gap-4 bg-teal-50 rounded-xl p-5 hover:bg-teal-100 transition-colors mb-6"
              >
                <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">✉️</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">cureacademyinfo@gmail.com</p>
                </div>
              </a>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {['Instagram', 'Twitter', 'LinkedIn'].map((platform) => (
                    <a
                      key={platform}
                      href="#"
                      className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 hover:bg-teal-500 hover:text-white transition-all shadow-sm"
                    >
                      {platform[0]}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none bg-white"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none bg-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none bg-white"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="program">Program Questions</option>
                    <option value="application">Application Help</option>
                    <option value="volunteer">Volunteering</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none bg-white resize-none"
                    placeholder="Your message..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Footer Component
function Footer({ setCurrentPage }) {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                <span className="text-xl">🔬</span>
              </div>
              <span className="font-bold text-xl text-teal-700">Cure Academy</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-sm">
              Empowering the next generation of cancer researchers through education and hands-on research experiences.
            </p>
            <a 
              href="mailto:cureacademyinfo@gmail.com"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              cureacademyinfo@gmail.com
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { id: 'about', label: 'About Us' },
                { id: 'program', label: 'Program' },
                { id: 'apply', label: 'Apply' },
                { id: 'support', label: 'Support Us' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => setCurrentPage(link.id)}
                    className="text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Partners</h4>
            <ul className="space-y-2 text-gray-600">
              <li>HYPOTHEkids</li>
              <li>NY Bioforce</li>
              <li>Columbia University</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Cure Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />
      case 'about':
        return <AboutPage />
      case 'program':
        return <ProgramPage setCurrentPage={setCurrentPage} />
      case 'apply':
        return <ApplyPage />
      case 'support':
        return <SupportPage />
      case 'contact':
        return <ContactPage />
      default:
        return <HomePage setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default App