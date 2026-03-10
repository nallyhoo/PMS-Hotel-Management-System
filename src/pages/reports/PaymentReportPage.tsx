import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { Download, CreditCard, DollarSign, Landmark, Wallet, Calendar, Filter } from 'lucide-react';
import { paymentReportData } from '../../data/mockReports';

const COLORS = ['#1a1a1a', '#1a1a1a80', '#1a1a1a40', '#1a1a1a10'];

export default function PaymentReportPage() {
  const totalAmount = paymentReportData.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Payment Report</h1>
          <p className="text-sm text-[#1a1a1a]/60">Transaction analysis and payment method distribution</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors text-sm font-medium">
            <Calendar size={18} />
            <span>This Month</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign size={20} className="text-[#1a1a1a]/40" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Total Processed</p>
          </div>
          <p className="text-3xl font-serif font-medium">${totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard size={20} className="text-[#1a1a1a]/40" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Card Payments</p>
          </div>
          <p className="text-3xl font-serif font-medium">58%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <Landmark size={20} className="text-[#1a1a1a]/40" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Bank Transfers</p>
          </div>
          <p className="text-3xl font-serif font-medium">22%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <Wallet size={20} className="text-[#1a1a1a]/40" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Digital Wallets</p>
          </div>
          <p className="text-3xl font-serif font-medium">12%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Payment Method Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentReportData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {paymentReportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {paymentReportData.map((item, index) => (
              <div key={item.method} className="flex items-center justify-between p-2 rounded-lg bg-[#f8f9fa]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs text-[#1a1a1a]/60">{item.method}</span>
                </div>
                <span className="text-xs font-medium text-[#1a1a1a]">${item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Volume by Method</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentReportData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="method" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8f9fa' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="#1a1a1a" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
