
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { Organizer } from '../types';

interface SignupFormProps {
  onSuccess: (organizer: Organizer) => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const organizers = storageService.getOrganizers();
      if (organizers.find(o => o.email === formData.email)) {
        setError('An account with this email already exists.');
        setLoading(false);
        return;
      }

      const newOrganizer: Organizer = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      storageService.saveOrganizer(newOrganizer);
      storageService.setSession(newOrganizer);
      onSuccess(newOrganizer);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto py-24 px-6">
      <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-user-plus text-blue-500 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1">Start managing festival attendees</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Jane Organizer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
            <input 
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="jane@kandyfest.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
            <input 
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirm Password</label>
            <input 
              required
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 px-4 py-3 rounded-xl text-xs">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account? <button onClick={onSwitchToLogin} className="text-blue-500 font-bold hover:underline">Sign in instead</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
