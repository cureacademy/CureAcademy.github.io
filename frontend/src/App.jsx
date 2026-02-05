import { useState, useEffect } from 'react'
import { Microscope, Lightbulb, FlaskConical, Users, Mail, ArrowRight, Calendar, CheckCircle, MapPin, ExternalLink, Heart } from 'lucide-react'

// Navigation Component
function Navigation({ currentPage, setCurrentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Added state for mobile toggle
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'program', label: 'Program' },
    { id: 'apply', label: 'Apply' },
    { id: 'support', label: 'Support Us' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <button onClick={() => setCurrentPage('home')} className="flex items-center gap-3">
          <div className="bg-teal-700 p-2 rounded-lg text-white shrink-0">
            <Microscope size={24} />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="font-bold text-xl text-teal-700 tracking-tighter leading-none uppercase">CURE ACADEMY</span>
            <span className="hidden xs:block text-[10px] text-gray-500 uppercase font-medium mt-1">Inspiring students in cancer research</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`text-sm font-medium transition-colors ${currentPage === item.id ? 'text-teal-600 font-bold' : 'text-gray-600 hover:text-teal-600'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <span className="text-2xl">✕</span> : <span className="text-2xl">☰</span>}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t mt-4 flex flex-col gap-4 pb-6 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id)
                setMobileMenuOpen(false)
              }}
              className={`text-left text-lg font-medium px-4 py-2 ${currentPage === item.id ? 'text-teal-600 bg-teal-50' : 'text-gray-600'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

// Home Page
function HomePage({ setCurrentPage }) {
  return (
    <div className="pt-24 min-h-screen">
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
          Empowering the next generation of cancer researchers
        </h1>
        <div className="flex justify-center gap-12 mb-12">
          <div className="text-center">
            <p className="text-gray-400 font-bold mb-4 text-xs uppercase tracking-widest">Our Partners</p>
            <div className="flex gap-4 justify-center">
              <a href="https://www.hypothekids.org/" target="_blank" className="px-4 py-2 bg-[#D4E157] font-bold border-2 border-black text-sm uppercase hover:shadow-md transition-shadow">HYPOTHEkids</a>
              <a href="https://www.hypothekids.org/nybioforce" target="_blank" className="px-4 py-2 bg-[#00BCD4] text-white font-bold border-2 border-black text-sm uppercase hover:shadow-md transition-shadow">NYbioforce</a>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setCurrentPage('apply')}
          className="group px-10 py-4 bg-[#F4A574] text-white font-bold rounded-full shadow-lg hover:brightness-110 transition-all flex items-center gap-2 mx-auto"
        >
          Join the Program <ArrowRight size={20} />
        </button>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-teal-900 tracking-tight">Program Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 bg-white rounded-3xl shadow-sm">
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6">
                <Lightbulb size={32} />
              </div>
              <p className="font-bold text-gray-800 leading-snug">Learn about cancer biology from expert professors</p>
            </div>
            <div className="p-10 bg-white rounded-3xl shadow-sm">
              <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-6">
                <FlaskConical size={32} />
              </div>
              <p className="font-bold text-gray-800 leading-snug">Gain hands-on lab experience</p>
            </div>
            <div className="p-10 bg-white rounded-3xl shadow-sm">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                <Users size={32} />
              </div>
              <p className="font-bold text-gray-800 leading-snug">Connect with like-minded students</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// About Page
function AboutPage() {
  return (
    <div className="pt-32 px-6 max-w-4xl mx-auto pb-20 text-left">
      <h2 className="text-3xl font-bold mb-6 text-teal-700">About Us</h2>
      <p className="text-2xl font-bold text-gray-800 mb-6 leading-tight">
        Our Mission: Nurture the next generation of cancer researchers and physicians
      </p>
      <div className="bg-teal-50 p-8 rounded-2xl border-l-4 border-teal-500 shadow-sm">
        <p className="text-gray-700 leading-relaxed text-lg">
          In collaboration with NY Bioforce, Cure Academy connects selected students to hands-on, paid biomedical research experiences.
        </p>
      </div>
    </div>
  )
}

// Program Page
function ProgramPage() {
  const timeline = [
    { date: "June 22-26, 2026", topic: "Cancer Cell", details: "Process of transformation, DNA damage, mutations, oncogenes, tumor suppressors, and genomic instability." },
    { date: "June 29-July 3, 2026", topic: "Tumor Microenvironment", details: "Cancer associated fibroblasts, neighborhood cells, immune infiltration, and metastatic process." },
    { date: "July 6-10, 2026", topic: "The Immune System in Cancer", details: "Understanding the role of the immune system in cancer." },
    { date: "July 13-17, 2026", topic: "The Role of the Host", details: "The patient as a whole." },
    { date: "July 20-25, 2026", topic: "Environmental Impacts on Cancer", details: "Understanding environmental factor and its role in cancer." }
  ]

  return (
    <div className="pt-32 px-6 max-w-5xl mx-auto pb-24 text-left">
      <h2 className="text-4xl font-bold mb-4 tracking-tight">The Program</h2>
      <p className="text-gray-600 mb-12 text-lg max-w-3xl leading-relaxed">
        Cure Academy is an educational program designed for students interested in learning about cancer through lecture series by physicians, scientists, and professors.
      </p>

      <div className="mb-20 border-t pt-12">
        <h3 className="text-2xl font-bold text-teal-800 mb-6 uppercase tracking-wider flex items-center gap-3">
          <CheckCircle className="text-teal-600" /> Phase 1: Foundations of Cancer Biology (Summer 2026)
        </h3>
        <p className="mb-6 text-gray-700 font-medium text-lg">Open to high school students in any grade interested in medicine and cancer research.</p>
        <ul className="space-y-4 text-gray-600 mb-10">
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-teal-100 p-1 rounded-full text-teal-600"><ArrowRight size={14} /></div>
            5-week virtual program (June-July) featuring virtual lectures led by professionals.
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-teal-100 p-1 rounded-full text-teal-600"><ArrowRight size={14} /></div>
            1-2 hours per week, unpaid, and scheduled for internship flexibility.
          </li>
        </ul>
        
        <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest flex items-center gap-2">
              <Calendar size={14} /> Timeline 2026
            </h4>
          </div>
          {timeline.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row md:gap-10 border-b border-gray-50 last:border-0 pb-6 last:pb-0 text-left">
              <span className="font-bold text-teal-600 md:w-56 shrink-0">{item.date}</span>
              <div>
                <p className="font-bold text-gray-800 text-lg mb-1">{item.topic}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-12 bg-sky-50 rounded-[2.5rem] border border-sky-100 shadow-sm">
        <h3 className="text-2xl font-bold text-sky-900 mb-4 uppercase tracking-wider flex items-center gap-3">
          <CheckCircle className="text-sky-600" /> Phase 2: Research Internship with NY Bioforce (Summer 2027)
        </h3>
        <p className="text-lg font-bold text-sky-700 mb-8 italic flex items-center gap-2">
          <MapPin size={20} /> In partnership with New York Bioforce
        </p>
        <p className="mb-8 text-gray-700 leading-relaxed text-lg">This paid, hands-on summer internship is available to up to five selected students graduating in 2027 or 2028 who will be at least 16 years old by July 1, 2027.</p>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white/60 p-8 rounded-2xl">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2 text-sm uppercase tracking-widest">Selection</h4>
            <p className="text-sm text-gray-600 leading-relaxed">Based on Phase 1 engagement, research motivation, and NY Bioforce eligibility.</p>
          </div>
          <div className="bg-white/60 p-8 rounded-2xl">
            <h4 className="font-bold text-gray-800 mb-4 border-b pb-2 text-sm uppercase tracking-widest">Schedule</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>Winter 2027:</strong> Application Opens</li>
              <li><strong>Spring 2027:</strong> Saturday sessions @ Columbia</li>
              <li><strong>Summer 2027:</strong> 25 hrs/week for 6 weeks in lab</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Apply Page
function ApplyPage() {
  return (
    <div className="pt-32 px-6 max-w-3xl mx-auto text-center pb-24">
      <h2 className="text-4xl font-bold mb-8 text-gray-900 tracking-tight">Application</h2>
      <div className="p-12 bg-white border-2 border-gray-100 rounded-[3rem] shadow-xl relative overflow-hidden">
        <p className="text-3xl font-black text-[#F4A574] mb-2 uppercase tracking-tighter">Deadline: March 1, 2026</p>
        <p className="text-gray-500 mb-10 font-bold text-lg italic text-center">Register for the lecture series</p>
        
        <a 
          href="https://docs.google.com/forms/d/1JlUqATRrP_X65XRmuz0Py2xUjfjQ9U3RTeVGXEoEFlQ/viewform?edit_requested=true" 
          target="_blank"
          className="inline-block px-10 py-5 bg-[#F4A574] text-white font-black rounded-full text-xl shadow-lg mb-12 hover:scale-105 transition-transform flex items-center gap-3 mx-auto justify-center"
        >
          OPEN REGISTRATION FORM <ExternalLink />
        </a>

        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center justify-center gap-2 text-center">Stay up to date</h3>
          <div className="flex flex-col gap-4">
            <input type="email" placeholder="Enter your email" className="p-4 rounded-2xl border-2 border-gray-200 focus:border-teal-400 outline-none text-center" />
            <button className="bg-[#F4A574] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:brightness-105 transition-all">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Support Page
function SupportPage() {
  return (
    <div className="pt-32 px-6 max-w-4xl mx-auto text-center pb-24">
      <h2 className="text-3xl font-bold mb-8 text-teal-800 uppercase tracking-widest">Support US</h2>
      <div className="p-12 bg-gray-50 rounded-[2.5rem] border border-gray-200 shadow-sm">
        <p className="text-xl text-gray-700 leading-relaxed font-medium mb-10 text-center">
          If you are interested in volunteering as a guest instructor or student mentor at Cure Academy, please complete the form below.
        </p>
        <a 
          href="https://docs.google.com/forms/d/1JlUqATRrP_X65XRmuz0Py2xUjfjQ9U3RTeVGXEoEFlQ/viewform?edit_requested=true"
          target="_blank"
          className="bg-teal-700 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest shadow-lg hover:bg-teal-800 transition-all inline-flex items-center gap-2"
        >
          <Heart size={20} /> Support Cure Academy
        </a>
      </div>
    </div>
  )
}

// Global Footer
function Footer() {
  return (
    <footer className="bg-gray-50 border-t py-20 px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-center md:text-left">
          <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-3">Contact Us</h3>
          <a href="mailto:cureacademyinfo@gmail.com" className="flex items-center gap-2 text-teal-700 font-bold text-xl justify-center md:justify-start hover:underline">
            <Mail size={24} />
            <span>cureacademyinfo@gmail.com</span>
          </a>
        </div>
        <div className="text-gray-400 text-sm font-medium">
          <p>© 2026 Cure Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  useEffect(() => { window.scrollTo(0, 0) }, [currentPage])

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage setCurrentPage={setCurrentPage} />
      case 'about': return <AboutPage />
      case 'program': return <ProgramPage />
      case 'apply': return <ApplyPage />
      case 'support': return <SupportPage />
      default: return <HomePage setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen font-sans bg-white selection:bg-teal-100 antialiased">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}