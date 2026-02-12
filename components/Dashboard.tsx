
import React, { useState, useEffect } from 'react';
import { Attendee, Organizer } from '../types';
import { storageService } from '../services/storageService';

interface DashboardProps {
  organizer: Organizer;
}

const Dashboard: React.FC<DashboardProps> = ({ organizer }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTicketCount, setFilterTicketCount] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateSort, setDateSort] = useState<'newest' | 'oldest'>('newest');
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Custom delete confirmation state
  const [attendeeToDelete, setAttendeeToDelete] = useState<Attendee | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setAttendees(storageService.getAttendees());
  };

  const totalTickets = attendees.reduce((sum, a) => sum + a.ticketCount, 0);

  // Apply filters and sorting
  const filteredAttendees = attendees
    .filter(a => {
      const matchesSearch = 
        a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.phone.includes(searchTerm);
      
      const matchesTicketCount = filterTicketCount === 'all' || a.ticketCount.toString() === filterTicketCount;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'verified' && a.isVerified) || 
                           (filterStatus === 'pending' && !a.isVerified);
      
      return matchesSearch && matchesTicketCount && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.registrationDate).getTime();
      const dateB = new Date(b.registrationDate).getTime();
      return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAttendees.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAttendees.map(a => a.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Action Handlers
  const toggleVerify = (attendee: Attendee) => {
    const updated = { ...attendee, isVerified: !attendee.isVerified };
    storageService.updateAttendee(updated);
    refreshData();
    if (selectedAttendee?.id === attendee.id) {
      setSelectedAttendee(updated);
    }
  };

  const handleBulkStatusUpdate = (status: boolean) => {
    const attendeesList = storageService.getAttendees();
    selectedIds.forEach(id => {
      const attendee = attendeesList.find(a => a.id === id);
      if (attendee) {
        storageService.updateAttendee({ ...attendee, isVerified: status });
      }
    });
    setSelectedIds(new Set());
    refreshData();
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleting(true);
    // Reuse the delete confirmation modal by setting a dummy attendee or specific flag
    setAttendeeToDelete({ id: 'bulk', fullName: `${selectedIds.size} selected records` } as any);
  };

  const initiateDelete = (attendee: Attendee) => {
    setIsBulkDeleting(false);
    setAttendeeToDelete(attendee);
  };

  const confirmDelete = () => {
    if (isBulkDeleting) {
      selectedIds.forEach(id => storageService.deleteAttendee(id));
      setSelectedIds(new Set());
    } else if (attendeeToDelete) {
      storageService.deleteAttendee(attendeeToDelete.id);
    }
    refreshData();
    setAttendeeToDelete(null);
    setIsBulkDeleting(false);
  };

  const handleExportCSV = () => {
    if (filteredAttendees.length === 0) return;

    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Tickets', 'Registration Date', 'Status', 'Notes'];
    const csvRows = [
      headers.join(','),
      ...filteredAttendees.map(a => [
        `"${a.id}"`,
        `"${a.fullName.replace(/"/g, '""')}"`,
        `"${a.email}"`,
        `"${a.phone}"`,
        a.ticketCount,
        `"${new Date(a.registrationDate).toLocaleString()}"`,
        `"${a.isVerified ? 'Verified' : 'Pending'}"`,
        `"${(a.notes || '').replace(/"/g, '""')}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `KandyFest_Attendees_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 pb-32">
      {/* Header & Stats */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <i className="fa-solid fa-chart-line text-rose-500"></i>
            Festival Management
          </h1>
          <p className="text-slate-400">Welcome back, {organizer.name}. Managing registrations for KCC Rooftop.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          disabled={filteredAttendees.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <i className="fa-solid fa-file-export"></i>
          Export to CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass p-6 rounded-2xl border border-white/10">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Attendees</div>
          <div className="text-4xl font-black">{attendees.length}</div>
          <div className="text-xs text-green-500 mt-2"><i className="fa-solid fa-user-check mr-1"></i> Active registrations</div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Tickets</div>
          <div className="text-4xl font-black">{totalTickets}</div>
          <div className="text-xs text-rose-500 mt-2"><i className="fa-solid fa-bolt mr-1"></i> Free Early Bird</div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Verified</div>
          <div className="text-4xl font-black">{attendees.filter(a => a.isVerified).length}</div>
          <div className="text-xs text-blue-400 mt-2"><i className="fa-solid fa-shield-check mr-1"></i> IDs Inspected</div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Capacity Used</div>
          <div className="text-4xl font-black">{Math.min(100, Math.round((totalTickets / 500) * 100))}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3">
            <div 
              className="h-full bg-rose-500 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, Math.round((totalTickets / 500) * 100))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filters & Main List */}
      <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div className="flex items-center gap-4">
               <h3 className="text-xl font-bold flex items-center gap-2">
                <i className="fa-solid fa-id-card text-blue-500"></i>
                Registrations
                <span className="text-sm font-normal text-slate-500 ml-2">({filteredAttendees.length} results)</span>
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter name, email..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-500"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending Only</option>
              </select>

              <select 
                value={filterTicketCount}
                onChange={(e) => setFilterTicketCount(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-500"
              >
                <option value="all">All Tickets</option>
                <option value="1">1 Ticket</option>
                <option value="2">2 Tickets</option>
                <option value="3">3 Tickets</option>
                <option value="4">4 Tickets</option>
              </select>

              <select 
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value as 'newest' | 'oldest')}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-4 w-10">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-900 cursor-pointer"
                      checked={filteredAttendees.length > 0 && selectedIds.size === filteredAttendees.length}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-6 py-4">Attendee Info</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">ID Proof Preview</th>
                <th className="px-6 py-4">Reg. Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAttendees.length > 0 ? filteredAttendees.map(attendee => (
                <tr 
                  key={attendee.id} 
                  className={`hover:bg-white/5 transition-colors group ${selectedIds.has(attendee.id) ? 'bg-rose-500/5' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-900 cursor-pointer"
                        checked={selectedIds.has(attendee.id)}
                        onChange={() => toggleSelectOne(attendee.id)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-white group-hover:text-rose-400 transition-colors">{attendee.fullName}</div>
                      {attendee.isVerified && (
                        <i className="fa-solid fa-circle-check text-green-500 text-xs" title="Verified"></i>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono tracking-tighter">REF: {attendee.id.toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300">{attendee.email}</div>
                    <div className="text-[10px] text-slate-500">{attendee.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block w-fit ${
                        attendee.isVerified ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {attendee.isVerified ? 'VERIFIED' : 'PENDING'}
                      </span>
                      <span className="text-[10px] text-slate-500">Qty: {attendee.ticketCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:scale-125 hover:border-blue-500 transition-all bg-slate-800 shadow-xl"
                        onClick={() => setSelectedAttendee(attendee)}
                      >
                        <img src={attendee.idProof} className="w-full h-full object-cover" alt="ID Thumbnail" />
                      </div>
                      <button 
                        onClick={() => setSelectedAttendee(attendee)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider"
                      >
                        Review
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300">
                      {new Date(attendee.registrationDate).toLocaleDateString()}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(attendee.registrationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleVerify(attendee)}
                        className={`w-8 h-8 rounded-lg transition-all border ${
                          attendee.isVerified 
                            ? 'bg-green-600 text-white border-green-500' 
                            : 'bg-slate-800 text-slate-400 border-transparent hover:border-green-500/30 hover:text-green-500'
                        }`}
                        title={attendee.isVerified ? "Mark as Pending" : "Mark as Verified"}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <button 
                        onClick={() => initiateDelete(attendee)}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/30"
                        title="Delete Entry"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <i className="fa-solid fa-filter text-slate-600 text-2xl"></i>
                    </div>
                    <div className="text-slate-400 font-medium">No registrations match your search filters.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Action Bar - Sticky at bottom */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="glass px-8 py-4 rounded-2xl border border-rose-500/30 shadow-2xl flex items-center gap-8 bg-slate-900/90 backdrop-blur-xl">
            <div className="flex items-center gap-3 pr-8 border-r border-white/10">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {selectedIds.size}
              </div>
              <span className="text-sm font-bold text-white uppercase tracking-wider">Selected</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleBulkStatusUpdate(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-check-double"></i>
                Verify All
              </button>
              <button 
                onClick={() => handleBulkStatusUpdate(false)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-clock-rotate-left"></i>
                Set Pending
              </button>
              <button 
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-trash-can"></i>
                Bulk Delete
              </button>
              <button 
                onClick={() => setSelectedIds(new Set())}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced ID Proof Modal */}
      {selectedAttendee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-md">
          <div className="glass max-w-4xl w-full rounded-3xl border border-white/20 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/80">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedAttendee.isVerified ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                  <i className={`fa-solid ${selectedAttendee.isVerified ? 'fa-shield-check' : 'fa-fingerprint'} text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold leading-none">{selectedAttendee.fullName}</h3>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">
                    {selectedAttendee.isVerified ? 'DOCUMENT VERIFIED' : 'PENDING VERIFICATION'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAttendee(null)}
                className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-rose-500 transition-all shadow-xl group"
              >
                <i className="fa-solid fa-times group-hover:rotate-90 transition-transform"></i>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-grow p-4 md:p-10 overflow-y-auto bg-slate-950 flex flex-col lg:flex-row gap-10">
              {/* Image Section */}
              <div className="lg:w-2/3 flex flex-col gap-4">
                <div className="relative group rounded-2xl overflow-hidden bg-slate-900 border border-white/5 min-h-[400px] flex items-center justify-center">
                  <img 
                    src={selectedAttendee.idProof} 
                    alt="Attendee Identity Proof" 
                    className="max-h-[60vh] object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10">
                      SECURE PREVIEW
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 px-2 font-mono">
                  <span>REF_ID: {selectedAttendee.id}</span>
                  <span>UPLOADED: {new Date(selectedAttendee.registrationDate).toLocaleString()}</span>
                </div>
              </div>

              {/* Sidebar Section */}
              <div className="lg:w-1/3 flex flex-col gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Entry Details</h4>
                  
                  <div className="glass p-4 rounded-xl border border-white/10 space-y-3">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs text-slate-400">Tickets Claimed</span>
                      <span className="font-bold text-rose-500">{selectedAttendee.ticketCount} Free</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs text-slate-400">Verification</span>
                      <span className={`text-[10px] font-bold px-2 rounded ${selectedAttendee.isVerified ? 'bg-green-500 text-white' : 'bg-amber-500 text-black'}`}>
                        {selectedAttendee.isVerified ? 'PASSED' : 'PENDING'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Phone</span>
                      <span className="text-xs text-white">{selectedAttendee.phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Email</span>
                      <span className="text-xs text-white underline truncate ml-4">{selectedAttendee.email}</span>
                    </div>
                  </div>
                </div>

                {selectedAttendee.notes && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Attendee Notes</h4>
                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-sm text-slate-300 italic">
                      "{selectedAttendee.notes}"
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-10 space-y-3">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedAttendee.idProof;
                      link.download = `ID_${selectedAttendee.fullName.replace(/\s+/g, '_')}.png`;
                      link.click();
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-download"></i> Download Proof
                  </button>
                  <button 
                    onClick={() => toggleVerify(selectedAttendee)}
                    className={`w-full py-3 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                      selectedAttendee.isVerified ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    <i className={`fa-solid ${selectedAttendee.isVerified ? 'fa-undo' : 'fa-user-check'}`}></i>
                    {selectedAttendee.isVerified ? 'Mark as Pending' : 'Approve Registration'}
                  </button>
                  <button 
                    onClick={() => setSelectedAttendee(null)}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-all"
                  >
                    Close Viewer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {attendeeToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass max-w-md w-full rounded-3xl border border-white/20 p-8 shadow-2xl scale-in-center">
            <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <i className="fa-solid fa-triangle-exclamation text-rose-500 text-2xl"></i>
            </div>
            
            <h3 className="text-2xl font-bold text-center mb-2">
              {isBulkDeleting ? 'Bulk Delete?' : 'Delete Registration?'}
            </h3>
            <p className="text-slate-400 text-center mb-8">
              Are you sure you want to remove <span className="text-white font-bold">{attendeeToDelete.fullName}</span>? This action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setAttendeeToDelete(null);
                  setIsBulkDeleting(false);
                }}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/20"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
