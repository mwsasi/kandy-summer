
import React, { useState, useEffect } from 'react';
import { AppView, Organizer, Attendee } from './types';
import { storageService } from './services/storageService';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [currentOrganizer, setCurrentOrganizer] = useState<Organizer | null>(null);

  useEffect(() => {
    const session = storageService.getSession();
    if (session) {
      setCurrentOrganizer(session);
    }
  }, []);

  const handleLogout = () => {
    storageService.clearSession();
    setCurrentOrganizer(null);
    setView('home');
  };

  const navigate = (newView: AppView) => {
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView(newView);
  };

  const renderView = () => {
    switch (view) {
      case 'home':
        return <LandingPage onRegister={() => navigate('register')} />;
      case 'register':
        return <RegistrationForm onComplete={() => navigate('home')} />;
      case 'login':
        return <LoginForm 
          onSuccess={(organizer) => {
            setCurrentOrganizer(organizer);
            navigate('dashboard');
          }} 
          onSwitchToSignup={() => navigate('signup')}
        />;
      case 'signup':
        return <SignupForm 
          onSuccess={(organizer) => {
            setCurrentOrganizer(organizer);
            navigate('dashboard');
          }} 
          onSwitchToLogin={() => navigate('login')}
        />;
      case 'dashboard':
        return currentOrganizer ? (
          <Dashboard organizer={currentOrganizer} />
        ) : (
          <LoginForm 
            onSuccess={(organizer) => {
              setCurrentOrganizer(organizer);
              navigate('dashboard');
            }} 
            onSwitchToSignup={() => navigate('signup')}
          />
        );
      default:
        return <LandingPage onRegister={() => navigate('register')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onNavigate={navigate} 
        organizer={currentOrganizer} 
        onLogout={handleLogout}
        currentView={view}
      />
      <main className="flex-grow">
        {renderView()}
      </main>
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 festival-gradient rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-music text-white"></i>
            </div>
            <span className="text-xl font-bold tracking-tighter">KANDY<span className="text-rose-500">SUMMER</span></span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 Kandy Summer Music Fest. Celebrating music in the hills.</p>
          <div className="flex gap-4 text-xl text-slate-400">
            <a href="#" className="hover:text-rose-500 transition-colors"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="hover:text-rose-500 transition-colors"><i className="fa-brands fa-facebook"></i></a>
            <a href="#" className="hover:text-rose-500 transition-colors"><i className="fa-brands fa-tiktok"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
