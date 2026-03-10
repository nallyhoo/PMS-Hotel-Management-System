import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { Award, Target, Star, ShieldCheck } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

const performanceData = [
  { month: 'Jan', revpar: 145, adr: 180, gop: 42 },
  { month: 'Feb', revpar: 152, adr: 185, gop: 45 },
  { month: 'Mar', revpar: 168, adr: 195, gop: 48 },
  { month: 'Apr', revpar: 158, adr: 190, gop: 46 },
  { month: 'May', revpar: 182, adr: 210, gop: 52 },
  { month: 'Jun', revpar: 195, adr: 225, gop: 58 },
];

const kpiData = [
  { subject: 'Service', A: 120, B: 110, fullMark: 150 },
  { subject: 'Cleanliness', A: 98, B: 130, fullMark: 150 },
  { subject: 'Revenue', A: 86, B: 130, fullMark: 150 },
  { subject: 'Occupancy', A: 99, B: 100, fullMark: 150 },
  { subject: 'F&B', A: 85, B: 90, fullMark: 150 },
  { subject: 'Maintenance', A: 65, B: 85, fullMark: 150 },
];

export default function HotelPerformanceDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-light mb-1">Hotel Performance</h1>
        <p className="text-sm text-[#1a1a1a]/60 font-light">Strategic KPIs and operational efficiency metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="RevPAR" value="$182.50" change={5.4} isPositive={true} icon={Award} subtitle="Revenue per available room" />
        <StatCard title="ADR" value="$215.00" change={2.1} isPositive={true} icon={Target} subtitle="Average daily rate" />
        <StatCard title="GOPPAR" value="$54.20" change={8.7} isPositive={true} icon={Star} subtitle="Gross operating profit" />
        <StatCard title="Quality Score" value="9.4/10" change={0.2} isPositive={true} icon={ShieldCheck} subtitle="Guest satisfaction index" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6">Financial Trends</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revpar" stroke="#1a1a1a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="RevPAR" />
                <Line type="monotone" dataKey="adr" stroke="#9ca3af" strokeWidth={2} dot={{ r: 4 }} name="ADR" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6">Operational Radar</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={kpiData}>
                <PolarGrid stroke="#f0f0f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#1a1a1a' }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Current Period" dataKey="A" stroke="#1a1a1a" fill="#1a1a1a" fillOpacity={0.6} />
                <Radar name="Previous Period" dataKey="B" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
