import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldX, HelpCircle } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

export default function AccountLockedPage() {
  return (
    <AuthLayout 
      title="Account Locked" 
      subtitle="For your security, access to this account has been temporarily suspended."
    >
      <div className="space-y-8">
        <div className="p-8 bg-white border border-red-100 text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-serif">Security Protocol Triggered</h3>
            <p className="text-sm text-[#1a1a1a]/60 font-light leading-relaxed">
              Multiple unsuccessful login attempts were detected. To protect your data, we've locked this account for 30 minutes.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            disabled
            className="w-full bg-[#1a1a1a]/10 text-[#1a1a1a]/40 py-4 flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-xs font-medium cursor-not-allowed"
          >
            Try Again in 24:15
          </button>
          
          <Link 
            to="/auth/forgot-password"
            className="w-full border border-[#1a1a1a] text-[#1a1a1a] py-4 flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-white transition-all uppercase tracking-[0.2em] text-xs font-medium"
          >
            <ShieldX size={16} />
            Verify Identity to Unlock
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-[#1a1a1a]/40">
          <HelpCircle size={14} />
          Contact IT Support: +1 (800) 555-0199
        </div>
      </div>
    </AuthLayout>
  );
}
