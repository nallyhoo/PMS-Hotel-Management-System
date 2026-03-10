import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  isPositive?: boolean;
  icon: React.ElementType;
  subtitle?: string;
}

export default function StatCard({ title, value, change, isPositive, icon: Icon, subtitle }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-[#1a1a1a]/5 rounded-xl">
          <Icon className="w-5 h-5 text-[#1a1a1a]" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-[#1a1a1a]/40 mb-1">{title}</p>
        <h3 className="text-2xl font-serif font-medium mb-1">{value}</h3>
        {subtitle && <p className="text-xs text-[#1a1a1a]/40 font-light">{subtitle}</p>}
      </div>
    </div>
  );
}
