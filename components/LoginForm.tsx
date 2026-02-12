
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { Organizer } from '../types';

interface LoginFormProps {
  onSuccess: (organizer: Organizer) => void;
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const organizers = storageService.getOrganizers();
      const user = organizers.find(o => o.email === email && o.password === password);

      if (user) {
        storageService.setSession(user);
        onSuccess(user);
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto py-24 px-6">
      <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 festival-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-user-shield text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold">Organizer Login</h2>
          <p className="text-slate-400 text-sm mt-1">Access the festival dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors"
              placeholder="organizer@kandyfest.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs text-rose-500 hover:underline">Forgot?</a>
            </div>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 px-4 py-3 rounded-xl text-xs">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-slate-400 text-sm">
            New organizer? <button onClick={onSwitchToSignup} className="text-rose-500 font-bold hover:underline">Create an account</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
