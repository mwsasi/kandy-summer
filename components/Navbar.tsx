
import React from 'react';
import { AppView, Organizer } from '../types';

interface NavbarProps {
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  organizer: Organizer | null;
  currentView: AppView;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, organizer, onLogout, currentView }) => {
  return (
    <nav className="sticky top-0 z-50 glass py-4 px-6 md:px-12 flex justify-between items-center border-b border-white/10">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate('home')}
      >
        <div className="w-10 h-10 festival-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <i className="fa-solid fa-music text-white text-xl"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tighter leading-none">KANDY<span className="text-rose-500">SUMMER</span></span>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Music Fest 2026</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <button 
          onClick={() => onNavigate('home')}
          className={`text-sm font-medium hover:text-rose-500 transition-colors ${currentView === 'home' ? 'text-rose-500' : 'text-slate-300'}`}
        >
          Home
        </button>
        <button 
          onClick={() => onNavigate('register')}
          className={`text-sm font-medium hover:text-rose-500 transition-colors ${currentView === 'register' ? 'text-rose-500' : 'text-slate-300'}`}
        >
          Tickets
        </button>
        {organizer ? (
          <>
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-medium hover:text-rose-500 transition-colors ${currentView === 'dashboard' ? 'text-rose-500' : 'text-slate-300'}`}
            >
              Dashboard
            </button>
            <div className="flex items-center gap-4 border-l border-white/20 pl-8">
              <span className="text-sm text-slate-400">Hi, <span className="text-white font-semibold">{organizer.name}</span></span>
              <button 
                onClick={onLogout}
                className="text-xs bg-slate-800 hover:bg-rose-900/40 text-rose-500 px-3 py-1 rounded-full border border-rose-500/30 transition-all"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <button 
            onClick={() => onNavigate('login')}
            className="text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-full shadow-lg shadow-rose-500/20 transition-all"
          >
            Organizer Portal
          </button>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button onClick={() => onNavigate(organizer ? 'dashboard' : 'login')} className="text-slate-300">
          <i className="fa-solid fa-user-circle text-2xl"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
