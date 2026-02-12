
import React from 'react';

interface LandingPageProps {
  onRegister: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onRegister }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-[600px] opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[80%] bg-blue-600 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[70%] bg-rose-600 blur-[120px] rounded-full"></div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto text-center">
        <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm animate-pulse">
          <span className="text-rose-400 text-sm font-semibold tracking-wide">✨ EARLY BIRD TICKETS NOW FREE</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
          KANDY SUMMER <br />
          <span className="gradient-text">MUSIC FEST</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          The ultimate musical journey in the hills. Join us for a night of rhythm, 
          nature, and unforgettable memories at the heart of Kandy City.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onRegister}
            className="w-full sm:w-auto px-10 py-5 bg-rose-500 hover:bg-rose-600 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-rose-500/40 transform hover:scale-105 transition-all"
          >
            Claim Free Tickets
          </button>
          <div className="px-8 py-5 glass rounded-2xl border border-white/10 flex items-center gap-3">
            <i className="fa-solid fa-calendar-check text-rose-500 text-xl"></i>
            <div className="text-left">
              <div className="text-sm font-bold text-white leading-tight">FEB 14, 2026</div>
              <div className="text-xs text-slate-400">Saturday Night</div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Stats/Details */}
      <section className="px-6 py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="glass p-8 rounded-3xl border border-white/10 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-map-location-dot text-blue-500 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold mb-4">The Venue</h3>
            <p className="text-slate-400">Kandy City Centre (KCC), rooftop arena. Panoramic views of the city lights and sacred lake.</p>
          </div>
          
          <div className="glass p-8 rounded-3xl border border-white/10 text-center border-rose-500/30">
            <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-ticket text-rose-500 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold mb-4">Free Entry</h3>
            <p className="text-slate-400">Early bird registration is completely free. Limit to 4 tickets per person. Registration mandatory.</p>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/10 text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-guitar text-amber-500 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold mb-4">Lineup</h3>
            <p className="text-slate-400">Top Sri Lankan artists and international DJs performing live under the summer stars.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-4 festival-gradient opacity-30 blur-2xl rounded-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070&auto=format&fit=crop" 
              alt="Music Festival vibe" 
              className="relative rounded-3xl shadow-2xl object-cover h-[500px] w-full"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Experience Kandy Like Never Before</h2>
            <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
              <p>
                Kandy Summer Music Fest is more than just a concert; it's a cultural explosion. Nestled in the historic city of Kandy, we bring together modern rhythms and traditional vibes.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-rose-500 flex-shrink-0 mt-1 flex items-center justify-center">
                    <i className="fa-solid fa-check text-[10px] text-white"></i>
                  </div>
                  <span>High-fidelity sound systems and immersive light shows.</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-rose-500 flex-shrink-0 mt-1 flex items-center justify-center">
                    <i className="fa-solid fa-check text-[10px] text-white"></i>
                  </div>
                  <span>Gourmet food stalls featuring Kandy's local delicacies.</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-rose-500 flex-shrink-0 mt-1 flex items-center justify-center">
                    <i className="fa-solid fa-check text-[10px] text-white"></i>
                  </div>
                  <span>Secure environment with professional management.</span>
                </li>
              </ul>
              <button 
                onClick={onRegister}
                className="mt-8 text-rose-500 font-bold flex items-center gap-2 hover:gap-4 transition-all"
              >
                Register your free spot now <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
