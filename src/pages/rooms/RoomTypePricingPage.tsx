import React from 'react';
import { 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Plus, 
  MoreVertical, 
  Save, 
  RefreshCw,
  Info
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockRoomTypes } from '../../data/mockRoomTypes';

export default function RoomTypePricingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const roomType = mockRoomTypes.find(rt => rt.id === id) || mockRoomTypes[0];

  const pricingRules = [
    { id: 'PR-001', name: 'Weekend Surcharge', type: 'Percentage', value: 15, period: 'Fri-Sun', status: 'Active' },
    { id: 'PR-002', name: 'Holiday Season', type: 'Fixed', value: 100, period: 'Dec 15 - Jan 5', status: 'Active' },
    { id: 'PR-003', name: 'Early Bird Discount', type: 'Percentage', value: -10, period: '30+ days in advance', status: 'Active' },
    { id: 'PR-004', name: 'Last Minute Deal', type: 'Percentage', value: -20, period: 'Within 24 hours', status: 'Inactive' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/rooms/types')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-light mb-1">Pricing Strategy</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">{roomType.name} • Base Price: ${roomType.basePrice}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
            <RefreshCw size={14} />
            Reset Defaults
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Base Pricing & Dynamic Rules */}
        <div className="lg:col-span-2 space-y-8">
          {/* Base Price Card */}
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif">Base Pricing Configuration</h3>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Info size={16} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">Standard Rate</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={16} />
                  <input 
                    type="number" 
                    defaultValue={roomType.basePrice}
                    className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">Member Rate</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={16} />
                  <input 
                    type="number" 
                    defaultValue={roomType.basePrice * 0.9}
                    className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Rules List */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#1a1a1a]/5 flex items-center justify-between">
              <h3 className="text-lg font-serif">Dynamic Pricing Rules</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-[#1a1a1a]/5 transition-colors">
                <Plus size={12} />
                Add Rule
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                    <th className="px-6 py-4">Rule Name</th>
                    <th className="px-6 py-4">Adjustment</th>
                    <th className="px-6 py-4">Period / Condition</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]/5">
                  {pricingRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-[#f8f9fa] transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">{rule.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium ${rule.value > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {rule.value > 0 ? '+' : ''}{rule.value}{rule.type === 'Percentage' ? '%' : '$'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/60">
                          <Calendar size={12} />
                          <span>{rule.period}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                          rule.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
                        }`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/40">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Summary */}
        <div className="space-y-8">
          {/* Market Insight Card */}
          <div className="bg-[#1a1a1a] text-white p-8 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrendingUp size={120} />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="text-lg font-serif">Market Insight</h3>
              <p className="text-sm text-white/60 font-light leading-relaxed">
                Your current base price is 12% lower than the local market average for this room type. 
                Consider a 5% increase for the upcoming peak season.
              </p>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Market Avg</p>
                  <p className="text-xl font-serif">$168</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Your Rank</p>
                  <p className="text-xl font-serif">#4 of 12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Revenue Impact</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#1a1a1a]/60">Projected Monthly Rev</span>
                <span className="text-sm font-medium">$42,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#1a1a1a]/60">Avg Daily Rate (ADR)</span>
                <span className="text-sm font-medium">$158.40</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#1a1a1a]/60">RevPAR</span>
                <span className="text-sm font-medium">$134.64</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
