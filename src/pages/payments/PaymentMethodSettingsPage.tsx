import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Shield, 
  Globe, 
  Smartphone, 
  Banknote,
  Settings,
  MoreVertical,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const initialMethods = [
  { id: 1, name: 'Stripe', type: 'Gateway', status: 'Active', icon: Globe, description: 'Accept credit cards, Apple Pay, and Google Pay' },
  { id: 2, name: 'PayPal', type: 'Wallet', status: 'Active', icon: Smartphone, description: 'Allow guests to pay with their PayPal balance' },
  { id: 3, name: 'Bank Transfer', type: 'Manual', status: 'Active', icon: Settings, description: 'Direct bank deposits with manual verification' },
  { id: 4, name: 'Cash', type: 'Manual', status: 'Active', icon: Banknote, description: 'Physical cash payments at the front desk' },
];

export default function PaymentMethodSettingsPage() {
  const [methods, setMethods] = useState(initialMethods);
  const [isSaved, setIsSaved] = useState(false);

  const toggleStatus = (id: number) => {
    setMethods(methods.map(m => 
      m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m
    ));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Payment Methods</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">Configure how you accept payments from guests</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm">
          <Plus size={16} />
          Add Payment Method
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
            <p className="text-sm font-medium">Settings updated successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map((method) => (
          <div key={method.id} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-[#1a1a1a]/5 ${
                  method.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  <method.icon size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-[#1a1a1a]">{method.name}</h3>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold">{method.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleStatus(method.id)}
                  className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
                >
                  {method.status === 'Active' ? (
                    <ToggleRight size={24} className="text-emerald-500" />
                  ) : (
                    <ToggleLeft size={24} className="text-gray-300" />
                  )}
                </button>
                <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/20">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-[#1a1a1a]/60 leading-relaxed">
              {method.description}
            </p>

            <div className="pt-4 border-t border-[#1a1a1a]/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${method.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                <span className="text-xs font-medium text-[#1a1a1a]/60">{method.status}</span>
              </div>
              <button className="text-xs font-semibold text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors">
                Configure Settings
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Settings */}
      <div className="bg-[#1a1a1a] rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Shield size={24} className="text-white/60" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-medium">Security & Compliance</h2>
            <p className="text-white/40 text-sm">Manage payment security and fraud prevention</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">3D Secure</h3>
            <p className="text-xs text-white/60 leading-relaxed">Require 3D Secure authentication for all online transactions to reduce chargebacks.</p>
            <button className="text-xs font-semibold text-emerald-400">Enabled</button>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Fraud Detection</h3>
            <p className="text-xs text-white/60 leading-relaxed">Automatically block suspicious transactions based on IP, location, and velocity.</p>
            <button className="text-xs font-semibold text-emerald-400">High Protection</button>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">PCI Compliance</h3>
            <p className="text-xs text-white/60 leading-relaxed">Your payment processing is fully PCI DSS Level 1 compliant through our gateway partners.</p>
            <button className="text-xs font-semibold text-white/40">View Certificate</button>
          </div>
        </div>
      </div>
    </div>
  );
}
