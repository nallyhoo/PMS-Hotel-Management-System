import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit2, 
  XCircle, 
  CheckCircle2, 
  Printer, 
  Mail, 
  CreditCard, 
  MessageSquare, 
  History,
  User,
  Calendar,
  Bed,
  MapPin,
  Clock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockReservations } from '../../data/mockReservations';
import { format } from 'date-fns';

export default function ReservationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  
  // For demo, we'll use the first reservation if ID is not found
  const reservation = mockReservations.find(r => r.id === id) || mockReservations[0];

  const tabs = ['Overview', 'Guest Details', 'Billing', 'Notes', 'History'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/reservations/list')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-serif font-light">{reservation.id}</h1>
              <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                reservation.status === 'Checked In' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                reservation.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                'bg-gray-50 text-gray-600 border-gray-100'
              }`}>
                {reservation.status}
              </span>
            </div>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Created on {format(new Date(reservation.createdAt), 'MMM dd, yyyy')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors border border-[#1a1a1a]/10" title="Print Invoice">
            <Printer size={18} className="text-[#1a1a1a]/60" />
          </button>
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors border border-[#1a1a1a]/10" title="Email Confirmation">
            <Mail size={18} className="text-[#1a1a1a]/60" />
          </button>
          <div className="h-8 w-px bg-[#1a1a1a]/10 mx-1"></div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
            <Edit2 size={14} />
            Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-red-700 transition-colors">
            <XCircle size={14} />
            Cancel
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex border-b border-[#1a1a1a]/10">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-xs font-medium uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a1a1a]"></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm min-h-[400px]">
            {activeTab === 'Overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#1a1a1a]/40">
                      <Calendar size={18} />
                      <span className="text-[10px] uppercase tracking-widest font-semibold">Stay Dates</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5">
                        <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Check-in</p>
                        <p className="text-sm font-medium">{format(new Date(reservation.checkIn), 'EEE, MMM dd, yyyy')}</p>
                        <p className="text-[10px] text-[#1a1a1a]/40 mt-1">From 02:00 PM</p>
                      </div>
                      <ChevronRight size={16} className="text-[#1a1a1a]/20" />
                      <div className="flex-1 p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5">
                        <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Check-out</p>
                        <p className="text-sm font-medium">{format(new Date(reservation.checkOut), 'EEE, MMM dd, yyyy')}</p>
                        <p className="text-[10px] text-[#1a1a1a]/40 mt-1">Until 11:00 AM</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#1a1a1a]/40">
                      <Bed size={18} />
                      <span className="text-[10px] uppercase tracking-widest font-semibold">Room Assignment</span>
                    </div>
                    <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{reservation.roomType}</p>
                        <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mt-1">
                          {reservation.roomNumber ? `Room ${reservation.roomNumber}` : 'Not Assigned'}
                        </p>
                      </div>
                      <button className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a] hover:underline">
                        Change Room
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#1a1a1a]/40">
                    <MessageSquare size={18} />
                    <span className="text-[10px] uppercase tracking-widest font-semibold">Special Requests</span>
                  </div>
                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                    <p className="text-sm text-amber-900 font-light leading-relaxed italic">
                      "Guest requested a high floor room with a view of the park. Also requested a late check-in around 8 PM."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'History' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {[
                  { time: 'Today, 02:15 PM', user: 'Sarah Jenkins', action: 'Guest checked in and room key assigned.' },
                  { time: 'Yesterday, 10:30 AM', user: 'System', action: 'Automated confirmation email sent to guest.' },
                  { time: 'Mar 08, 04:45 PM', user: 'Alexander Wright', action: 'Room assignment changed from 401 to 402.' },
                  { time: 'Mar 01, 11:20 AM', user: 'Guest (Web)', action: 'Reservation created via official website.' },
                ].map((log, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-10 text-right shrink-0">
                      <div className="w-2 h-2 bg-[#1a1a1a]/20 rounded-full mx-auto mt-1.5 relative z-10"></div>
                      {idx < 3 && <div className="w-px h-full bg-[#1a1a1a]/5 mx-auto -mt-1"></div>}
                    </div>
                    <div className="pb-6">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">{log.time}</p>
                      <p className="text-sm font-medium mb-1">{log.action}</p>
                      <p className="text-xs text-[#1a1a1a]/40 font-light">By {log.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Summary & Actions */}
        <div className="space-y-8">
          {/* Guest Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-sm font-bold">
                {reservation.guestName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-serif">{reservation.guestName}</h3>
                <p className="text-xs text-[#1a1a1a]/40 font-light">VIP Member • Gold Tier</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-[#1a1a1a]/5">
              <div className="flex items-center gap-3 text-sm font-light text-[#1a1a1a]/60">
                <Mail size={14} />
                <span>j.moore@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-light text-[#1a1a1a]/60">
                <Clock size={14} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-light text-[#1a1a1a]/60">
                <MapPin size={14} />
                <span>Los Angeles, CA</span>
              </div>
            </div>
            <button className="w-full py-2 text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a] border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa] transition-colors">
              View Guest Profile
            </button>
          </div>

          {/* Payment Summary Card */}
          <div className="bg-[#1a1a1a] text-white p-6 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-lg font-serif">Billing Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-light text-white/60">
                <span>Room Charges</span>
                <span>$1,050.00</span>
              </div>
              <div className="flex justify-between text-sm font-light text-white/60">
                <span>Service Fees</span>
                <span>$120.00</span>
              </div>
              <div className="flex justify-between text-sm font-light text-white/60">
                <span>Taxes</span>
                <span>$80.00</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="text-xl font-serif font-medium">${reservation.amount.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl flex items-center gap-3">
              <CreditCard size={18} className="text-white/40" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Payment Method</p>
                <p className="text-xs font-medium">Visa ending in •••• 4421</p>
              </div>
              <div className="ml-auto">
                <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Paid</span>
              </div>
            </div>
            <button className="w-full py-3 bg-white text-[#1a1a1a] rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f5f2ed] transition-colors">
              Process Refund
            </button>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-2">Quick Actions</p>
            <button className="w-full p-4 bg-white border border-[#1a1a1a]/5 rounded-2xl shadow-sm flex items-center gap-4 hover:border-[#1a1a1a]/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <History size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Extend Stay</p>
                <p className="text-[10px] text-[#1a1a1a]/40 font-light">Add extra nights to booking</p>
              </div>
            </button>
            <button className="w-full p-4 bg-white border border-[#1a1a1a]/5 rounded-2xl shadow-sm flex items-center gap-4 hover:border-[#1a1a1a]/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Check Out Guest</p>
                <p className="text-[10px] text-[#1a1a1a]/40 font-light">Finalize billing and keys</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
