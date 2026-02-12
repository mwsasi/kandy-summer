
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { Attendee } from '../types';

interface RegistrationFormProps {
  onComplete: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    ticketCount: 1,
    notes: '',
  });
  const [idProof, setIdProof] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size too large. Max 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdProof(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!idProof) {
      setError('ID Proof is required for free tickets.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAttendee: Attendee = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        ticketCount: formData.ticketCount,
        idProof: idProof,
        notes: formData.notes,
        registrationDate: new Date().toISOString()
      };

      storageService.saveAttendee(newAttendee);
      setIsSubmitting(false);
      setSuccess(true);
      
      setTimeout(() => {
        onComplete();
      }, 3000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-32 px-6 text-center">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <i className="fa-solid fa-check text-green-500 text-4xl animate-bounce"></i>
        </div>
        <h2 className="text-4xl font-bold mb-4">Registration Successful!</h2>
        <p className="text-slate-400 text-lg mb-8">
          We've sent your free tickets to <span className="text-white font-semibold">{formData.email}</span>. 
          See you at KCC on February 14th!
        </p>
        <div className="inline-block px-6 py-2 bg-slate-800 rounded-full text-slate-400 text-sm">
          Redirecting to home...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 px-6">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Secure Your Free Spot</h2>
        <p className="text-slate-400">Fill in the details below to claim your Early Bird tickets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Info Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-6 rounded-2xl border border-rose-500/20">
            <h4 className="font-bold text-rose-500 mb-2">Early Bird Special</h4>
            <p className="text-sm text-slate-300">Free tickets are available for a limited time. Maximum 4 per registration.</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-300">
              <i className="fa-solid fa-location-dot text-rose-500 w-5"></i>
              <span>KCC, Kandy City</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <i className="fa-solid fa-clock text-rose-500 w-5"></i>
              <span>Starts at 7:00 PM</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <i className="fa-solid fa-calendar text-rose-500 w-5"></i>
              <span>Feb 14, 2026 (Sat)</span>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Full Name</label>
              <input 
                required
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Email Address</label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Phone Number</label>
              <input 
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors"
                placeholder="+94 77 XXX XXXX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Free Tickets (Max 4)</label>
              <select 
                value={formData.ticketCount}
                onChange={(e) => setFormData({...formData, ticketCount: parseInt(e.target.value)})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors"
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num} Ticket{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">ID Proof Upload (NIC/Passport)</label>
            <div className="relative group">
              <input 
                required
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${idProof ? 'border-green-500/50 bg-green-500/5' : 'border-slate-800 hover:border-rose-500/50 hover:bg-white/5'}`}>
                {idProof ? (
                  <>
                    <i className="fa-solid fa-file-circle-check text-green-500 text-3xl mb-3"></i>
                    <span className="text-green-500 font-medium">ID Uploaded Successfully</span>
                    <span className="text-xs text-slate-500 mt-1">Click to replace</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up text-slate-500 text-3xl mb-3 group-hover:text-rose-500"></i>
                    <span className="text-slate-400">Drag & drop or <span className="text-rose-500">browse</span></span>
                    <span className="text-xs text-slate-600 mt-1">PNG, JPG up to 2MB</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Special Notes (Optional)</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors h-24 resize-none"
              placeholder="Any medical requirements or accessibility needs?"
            />
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 px-4 py-3 rounded-xl text-sm">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-xl shadow-rose-500/20 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin"></i>
                Processing...
              </>
            ) : (
              'Confirm Registration'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
