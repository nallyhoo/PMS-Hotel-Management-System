
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ComposedChart
} from 'recharts';
import { Sun, Snowflake, TrendingUp, Calendar, Download, Filter } from 'lucide-react';
import { seasonalRevenueData } from '../../data/mockAnalytics';

const SeasonalRevenue: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-medium text-gray-900">Seasonal Revenue Analysis</h1>
          <p className="text-gray-500">Analyze revenue fluctuations and occupancy trends across different seasons.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seasonal Revenue & Occupancy */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Sun className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Seasonal Performance</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={seasonalRevenueData.seasonalTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="season" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="#f59e0b" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Holiday Impact */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Snowflake className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900">Holiday Revenue Impact</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonalRevenueData.holidayImpact}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="holiday" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Year-over-Year Comparison */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Year-over-Year Revenue</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={seasonalRevenueData.yearOverYear}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="current" name="Current Year" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="previous" name="Previous Year" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seasonal Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <h4 className="text-emerald-800 text-sm font-medium uppercase tracking-wider mb-2">Peak Season</h4>
            <p className="text-2xl font-bold text-emerald-900">Summer</p>
            <p className="text-emerald-600 text-sm mt-1">+45% Revenue Growth</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h4 className="text-blue-800 text-sm font-medium uppercase tracking-wider mb-2">Off-Peak Season</h4>
            <p className="text-2xl font-bold text-blue-900">Winter</p>
            <p className="text-blue-600 text-sm mt-1">Focus on Corporate</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 col-span-2">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-orange-800 text-sm font-medium uppercase tracking-wider mb-2">Next Major Holiday</h4>
                <p className="text-2xl font-bold text-orange-900">Easter Weekend</p>
              </div>
              <Calendar className="w-10 h-10 text-orange-300" />
            </div>
            <p className="text-orange-600 text-sm mt-1">Projected 85% Occupancy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalRevenue;
