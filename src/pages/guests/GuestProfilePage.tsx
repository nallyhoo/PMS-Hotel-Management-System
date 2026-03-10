import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  History, 
  Settings, 
  FileText, 
  CreditCard, 
  Award,
  MoreVertical,
  Edit2,
  ExternalLink,
  Plus,
  Download,
  Trash2,
  ShieldCheck,
  Heart,
  Coffee,
  Wifi,
  Wind
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'history' | 'preferences' | 'documents' | 'loyalty' | 'billing';

export default function GuestProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>('history');

  // Mock guest data
  const guest = {
    id: id || 'G-1001',
    name: 'Alexander Wright',
    email: 'alex.wright@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Park Avenue, New York, NY 10001, USA',
    dob: '1985-06-12',
    nationality: 'American',
    loyaltyTier: 'Platinum',
    points: 12500,
    memberSince: '2022-03-15',
    totalSpent: 15420.00,
    totalStays: 12,
    status: 'Active'
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'history', label: 'Stay History', icon: History },
    { id: 'preferences', label: 'Preferences', icon: Heart },
    { id: 'loyalty', label: 'Loyalty & Points', icon: Award },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'billing', label: 'Payment History', icon: CreditCard },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-start gap-6">
          <button 
            onClick={() => navigate('/guests')}
            className="mt-2 p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-[#1a1a1a] text-white flex items-center justify-center text-3xl font-serif shadow-xl">
              AW
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-serif">{guest.name}</h1>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-[10px] font-bold uppercase tracking-widest border border-purple-100">
                  {guest.loyaltyTier} Member
                </span>
              </div>
              <p className="text-sm text-[#1a1a1a]/40 font-medium uppercase tracking-widest">{guest.id} • Member since {guest.memberSince}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a]/60">
                  <Mail size={14} /> {guest.email}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a]/60">
                  <Phone size={14} /> {guest.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
            <Edit2 size={14} /> Edit Profile
          </button>
          <button className="p-2 border border-[#1a1a1a]/10 rounded-xl hover:bg-[#f8f9fa] transition-colors">
            <MoreVertical size={18} className="text-[#1a1a1a]/60" />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Stays', value: guest.totalStays, sub: 'Nights: 42' },
          { label: 'Total Revenue', value: `$${guest.totalSpent.toLocaleString()}`, sub: 'Avg: $367 / night' },
          { label: 'Loyalty Points', value: guest.points.toLocaleString(), sub: 'Next Tier: 2,500 pts' },
          { label: 'Last Stay', value: '15 Feb 2026', sub: 'Room 402 • Deluxe' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">{stat.label}</p>
            <p className="text-2xl font-serif mb-1">{stat.value}</p>
            <p className="text-[10px] text-[#1a1a1a]/60 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#1a1a1a]/5 flex items-center gap-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 text-xs font-medium uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a1a1a]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 border-b border-[#1a1a1a]/5">
                      <th className="px-6 py-4">Stay Dates</th>
                      <th className="px-6 py-4">Room</th>
                      <th className="px-6 py-4">Reservation ID</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]/5">
                    {[
                      { dates: '10 Feb - 15 Feb 2026', room: '402 • Deluxe', id: 'RES-9283', amount: '$1,850.00', status: 'Completed' },
                      { dates: '12 Jan - 15 Jan 2026', room: '105 • Standard', id: 'RES-8172', amount: '$720.00', status: 'Completed' },
                      { dates: '20 Dec - 24 Dec 2025', room: 'Suite 2 • Presidential', id: 'RES-7061', amount: '$4,200.00', status: 'Completed' },
                    ].map((stay, idx) => (
                      <tr key={idx} className="text-sm hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-6 py-4 font-medium">{stay.dates}</td>
                        <td className="px-6 py-4 text-[#1a1a1a]/60">{stay.room}</td>
                        <td className="px-6 py-4 text-[#1a1a1a]/40 font-mono text-xs">{stay.id}</td>
                        <td className="px-6 py-4 font-medium">{stay.amount}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-widest">
                            {stay.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/40">
                            <Download size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div 
              key="preferences"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif">Room Preferences</h3>
                  <button className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 hover:text-[#1a1a1a]">Edit</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: Wind, label: 'Floor Level', value: 'High Floor Preferred' },
                    { icon: Coffee, label: 'Pillow Type', value: 'Memory Foam' },
                    { icon: Wifi, label: 'Connectivity', value: 'High-speed Business Wifi' },
                    { icon: Heart, label: 'Dietary', value: 'Vegetarian, Gluten-Free' },
                  ].map((pref, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-[#f8f9fa] rounded-xl">
                      <div className="p-2 bg-white rounded-lg text-[#1a1a1a]/40">
                        <pref.icon size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">{pref.label}</p>
                        <p className="text-sm font-medium">{pref.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
                <h3 className="text-lg font-serif">Internal Notes</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-900 leading-relaxed">
                      "Guest is a frequent business traveler. Prefers early check-in (around 10 AM) whenever possible. Always requests extra towels and sparkling water in the room."
                    </p>
                    <p className="text-[10px] text-amber-700/60 mt-2 font-medium uppercase tracking-widest">— Added by Front Desk Manager, 12 Jan 2026</p>
                  </div>
                  <button className="w-full py-3 border border-dashed border-[#1a1a1a]/20 rounded-xl text-xs font-medium text-[#1a1a1a]/40 hover:border-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-all flex items-center justify-center gap-2">
                    <Plus size={14} /> Add Internal Note
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'loyalty' && (
            <motion.div 
              key="loyalty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#1a1a1a] text-white p-10 rounded-3xl shadow-xl relative overflow-hidden">
                  <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">Current Tier</p>
                        <h3 className="text-4xl font-serif">Platinum Member</h3>
                      </div>
                      <Award size={48} className="text-purple-400 opacity-50" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <p className="text-xs font-medium">Progress to Diamond</p>
                        <p className="text-xs font-medium">12,500 / 15,000 pts</p>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 w-[83%] rounded-full shadow-[0_0_15px_rgba(192,132,252,0.5)]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 pt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Available Points</p>
                        <p className="text-2xl font-serif">12,500</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Points Expiring</p>
                        <p className="text-2xl font-serif">0</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Lifetime Points</p>
                        <p className="text-2xl font-serif">45,200</p>
                      </div>
                    </div>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                  <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                </div>

                <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
                  <h3 className="text-lg font-serif">Tier Benefits</h3>
                  <div className="space-y-4">
                    {[
                      'Complimentary Room Upgrades',
                      'Late Checkout (until 4 PM)',
                      'Welcome Amenity & Drink',
                      '25% Bonus Points on Stays',
                      'Executive Lounge Access',
                    ].map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-[#1a1a1a]/60">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div 
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { name: 'Passport Copy', type: 'PDF', date: '12 Jan 2026', size: '1.2 MB' },
                { name: 'Business Card', type: 'JPG', date: '10 Feb 2026', size: '450 KB' },
                { name: 'Company Authorization', type: 'PDF', date: '05 Nov 2025', size: '2.4 MB' },
              ].map((doc, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm group hover:border-[#1a1a1a]/20 transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-[#f8f9fa] rounded-xl text-[#1a1a1a]/40 group-hover:text-[#1a1a1a] transition-colors">
                      <FileText size={24} />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/40"><Download size={16} /></button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-400"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium mb-1">{doc.name}</h4>
                  <div className="flex items-center justify-between text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">
                    <span>{doc.type} • {doc.size}</span>
                    <span>Uploaded {doc.date}</span>
                  </div>
                </div>
              ))}
              <button className="bg-[#f8f9fa] border-2 border-dashed border-[#1a1a1a]/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[#1a1a1a]/30 transition-all group">
                <div className="p-3 bg-white rounded-xl text-[#1a1a1a]/20 group-hover:text-[#1a1a1a]/40 transition-colors">
                  <Plus size={24} />
                </div>
                <span className="text-xs font-medium text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]/60">Upload New Document</span>
              </button>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div 
              key="billing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 border-b border-[#1a1a1a]/5">
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]/5">
                    {[
                      { date: '15 Feb 2026', id: 'TXN-9283', method: 'Visa •••• 4242', amount: '$1,850.00', status: 'Success' },
                      { date: '15 Jan 2026', id: 'TXN-8172', method: 'Visa •••• 4242', amount: '$720.00', status: 'Success' },
                      { date: '24 Dec 2025', id: 'TXN-7061', method: 'Bank Transfer', amount: '$4,200.00', status: 'Success' },
                    ].map((txn, idx) => (
                      <tr key={idx} className="text-sm hover:bg-[#f8f9fa] transition-colors">
                        <td className="px-6 py-4 font-medium">{txn.date}</td>
                        <td className="px-6 py-4 text-[#1a1a1a]/40 font-mono text-xs">{txn.id}</td>
                        <td className="px-6 py-4 text-[#1a1a1a]/60">{txn.method}</td>
                        <td className="px-6 py-4 font-medium">{txn.amount}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-widest">
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/40">
                            <Download size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
