import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Star,
  MapPin,
  UserCheck,
  UserPlus,
  Activity,
  PieChart,
  BarChart3,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import guestService from '../../api/guests';
import { format, subDays, parseISO } from 'date-fns';

export default function GuestAnalyticsPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30'); // days

  const { data: guestsData, isLoading } = useQuery({
    queryKey: ['guests', 'analytics'],
    queryFn: () => guestService.getGuests({ limit: 1000 }),
  });

  const guests = guestsData?.data || [];

  // Calculate analytics
  const totalGuests = guests.length;
  const activeGuests = guests.filter((g: any) => g.isActive !== false).length;
  const vipGuests = guests.filter((g: any) => g.vipStatus && g.vipStatus !== 'Regular').length;
  
  // Mock data for demo (in production, calculate from actual reservation data)
  const totalStays = Math.floor(totalGuests * 3.5);
  const avgStayDuration = 2.8;
  const repeatGuests = Math.floor(totalGuests * 0.45);
  
  // Loyalty tier distribution
  const tierDistribution = [
    { tier: 'Bronze', count: Math.floor(totalGuests * 0.4), color: 'bg-orange-500' },
    { tier: 'Silver', count: Math.floor(totalGuests * 0.25), color: 'bg-slate-400' },
    { tier: 'Gold', count: Math.floor(totalGuests * 0.2), color: 'bg-amber-400' },
    { tier: 'Platinum', count: Math.floor(totalGuests * 0.15), color: 'bg-purple-500' },
  ];

  // VIP distribution
  const vipDistribution = [
    { status: 'Regular', count: totalGuests - vipGuests, color: 'bg-slate-400' },
    { status: 'VIP', count: Math.floor(vipGuests * 0.7), color: 'bg-amber-500' },
    { status: 'VVIP', count: Math.floor(vipGuests * 0.3), color: 'bg-purple-500' },
  ];

  // Status distribution
  const statusDistribution = [
    { status: 'Active', count: activeGuests, color: 'bg-emerald-500' },
    { status: 'Inactive', count: totalGuests - activeGuests, color: 'bg-slate-300' },
  ];

  // Top countries (mock for demo)
  const topCountries = [
    { country: 'United States', count: Math.floor(totalGuests * 0.35) },
    { country: 'United Kingdom', count: Math.floor(totalGuests * 0.15) },
    { country: 'Canada', count: Math.floor(totalGuests * 0.12) },
    { country: 'Germany', count: Math.floor(totalGuests * 0.1) },
    { country: 'Australia', count: Math.floor(totalGuests * 0.08) },
  ];

  // Stats cards
  const stats = [
    { 
      label: 'Total Guests', 
      value: totalGuests.toLocaleString(), 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      change: '+12%'
    },
    { 
      label: 'Active Guests', 
      value: activeGuests.toLocaleString(), 
      icon: UserCheck, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      change: '+8%'
    },
    { 
      label: 'VIP Guests', 
      value: vipGuests.toLocaleString(), 
      icon: Star, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      change: '+15%'
    },
    { 
      label: 'Repeat Guests', 
      value: `${repeatGuests} (${Math.round(repeatGuests/totalGuests*100)}%)`, 
      icon: RefreshCcw, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      change: '+5%'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/guests')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light">Guest Analytics</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">
              Overview of guest demographics and trends
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <span className="text-xs font-medium text-emerald-600">{stat.change}</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">{stat.label}</p>
            <p className="text-2xl font-serif mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Loyalty Tier Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-[#1a1a1a]/40" />
            Loyalty Tier Distribution
          </h3>
          <div className="space-y-4">
            {tierDistribution.map((tier, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{tier.tier}</span>
                  <span className="text-sm text-[#1a1a1a]/60">{tier.count} guests ({Math.round(tier.count/totalGuests*100)}%)</span>
                </div>
                <div className="h-3 bg-[#f8f9fa] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${tier.color} rounded-full transition-all`} 
                    style={{ width: `${(tier.count/totalGuests)*100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VIP Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6 flex items-center gap-2">
            <Star size={20} className="text-[#1a1a1a]/40" />
            VIP Status Distribution
          </h3>
          <div className="space-y-4">
            {vipDistribution.map((vip, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{vip.status}</span>
                  <span className="text-sm text-[#1a1a1a]/60">{vip.count} guests ({Math.round(vip.count/totalGuests*100)}%)</span>
                </div>
                <div className="h-3 bg-[#f8f9fa] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${vip.color} rounded-full transition-all`} 
                    style={{ width: `${(vip.count/totalGuests)*100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6 flex items-center gap-2">
            <MapPin size={20} className="text-[#1a1a1a]/40" />
            Top Countries
          </h3>
          <div className="space-y-4">
            {topCountries.map((country, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#f8f9fa] flex items-center justify-center text-xs font-medium text-[#1a1a1a]/40">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium">{country.country}</span>
                </div>
                <span className="text-sm text-[#1a1a1a]/60">{country.count} guests</span>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Status */}
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6 flex items-center gap-2">
            <Activity size={20} className="text-[#1a1a1a]/40" />
            Guest Status
          </h3>
          <div className="space-y-4">
            {statusDistribution.map((status, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{status.status}</span>
                  <span className="text-sm text-[#1a1a1a]/60">{status.count} guests ({Math.round(status.count/totalGuests*100)}%)</span>
                </div>
                <div className="h-3 bg-[#f8f9fa] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${status.color} rounded-full transition-all`} 
                    style={{ width: `${(status.count/totalGuests)*100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-8 pt-6 border-t border-[#1a1a1a]/5">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[#f8f9fa] rounded-xl">
                <p className="text-2xl font-serif">{avgStayDuration}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40">Avg. Stay (nights)</p>
              </div>
              <div className="text-center p-4 bg-[#f8f9fa] rounded-xl">
                <p className="text-2xl font-serif">{totalStays}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40">Total Stays</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RefreshCcw({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-6.36 2.64L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9 9 0 0 0 6.36-2.64L21 16" />
      <path d="M21 21v-5h-5" />
    </svg>
  );
}
