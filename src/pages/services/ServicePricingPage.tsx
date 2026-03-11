import React, { useState } from 'react';
import { 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Info,
  TrendingUp,
  Percent
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const initialRules = [
  { id: 1, name: 'Weekend Surcharge', type: 'Percentage', value: '15%', condition: 'Sat-Sun', status: 'Active' },
  { id: 2, name: 'Early Bird Discount', type: 'Fixed', value: '-$20.00', condition: 'Before 10 AM', status: 'Active' },
  { id: 3, name: 'Seasonal Peak', type: 'Percentage', value: '25%', condition: 'Dec-Jan', status: 'Inactive' },
];

export default function ServicePricingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [rules, setRules] = useState(initialRules);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/services/list')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Pricing Rules</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Configure dynamic pricing for Spa Treatment ({id})</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm">
          <Plus size={16} />
          Add Rule
        </button>
      </div>

      <AnimatePresence>
        {isSaved && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800 shadow-sm"
          >
            <CheckCircle2 size={20} className="text-emerald-600" />
            <p className="text-sm font-medium">Pricing rules updated successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Base Price Card */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest">Base Service Price</p>
                <p className="text-2xl font-serif font-medium text-[#1a1a1a]">$120.00</p>
              </div>
            </div>
            <button className="text-sm font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors">
              Edit Base Price
            </button>
          </div>

          {/* Dynamic Rules List */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#1a1a1a]/5">
              <h3 className="font-serif text-lg font-medium">Dynamic Pricing Rules</h3>
            </div>
            <div className="divide-y divide-[#1a1a1a]/5">
              {rules.map((rule) => (
                <div key={rule.id} className="p-6 flex items-center justify-between hover:bg-[#f8f9fa] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      rule.type === 'Percentage' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {rule.type === 'Percentage' ? <Percent size={18} /> : <DollarSign size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#1a1a1a]">{rule.name}</h4>
                      <p className="text-xs text-[#1a1a1a]/40 flex items-center gap-2">
                        <Clock size={12} />
                        {rule.condition}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${rule.value.startsWith('-') ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {rule.value}
                      </p>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        rule.status === 'Active' ? 'text-emerald-500' : 'text-gray-400'
                      }`}>
                        {rule.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60">
                        <TrendingUp size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#1a1a1a] rounded-2xl p-8 text-white space-y-6">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Pricing Strategy</h3>
            <div className="space-y-4">
              <p className="text-xs text-white/60 leading-relaxed">
                Dynamic pricing allows you to automatically adjust service rates based on demand, time of day, or seasonal factors.
              </p>
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Active Rules</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Revenue Impact</span>
                  <span className="font-medium text-emerald-400">+12.5%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-4">
            <div className="flex items-center gap-2 text-blue-800">
              <Info size={18} />
              <h4 className="text-sm font-semibold">Pro Tip</h4>
            </div>
            <p className="text-xs text-blue-700/70 leading-relaxed">
              Combine early bird discounts with weekend surcharges to optimize staff scheduling and maximize revenue during peak hours.
            </p>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Pricing Rules
          </button>
        </div>
      </div>
    </div>
  );
}
