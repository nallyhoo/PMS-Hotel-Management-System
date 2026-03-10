import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

export default function ResetPasswordPage() {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  if (success) {
    return (
      <AuthLayout 
        title="Password Updated" 
        subtitle="Your security credentials have been successfully updated."
      >
        <div className="space-y-8 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <p className="text-sm text-[#1a1a1a]/60 font-light leading-relaxed">
            Your password has been changed. You can now use your new password to sign in to your account.
          </p>
          <button 
            onClick={() => navigate('/auth/login')}
            className="w-full bg-[#1a1a1a] text-white py-4 flex items-center justify-center gap-2 hover:bg-[#333] transition-colors uppercase tracking-[0.2em] text-xs font-medium"
          >
            Sign In Now
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="New Password" 
      subtitle="Please choose a strong password to secure your management account."
    >
      <form onSubmit={(e) => { e.preventDefault(); setSuccess(true); }} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">
            New Password
          </label>
          <input 
            type="password" 
            required
            className="w-full bg-white border border-[#1a1a1a]/10 rounded-none px-4 py-3 focus:outline-none focus:border-[#1a1a1a] transition-colors font-light"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">
            Confirm Password
          </label>
          <input 
            type="password" 
            required
            className="w-full bg-white border border-[#1a1a1a]/10 rounded-none px-4 py-3 focus:outline-none focus:border-[#1a1a1a] transition-colors font-light"
            placeholder="••••••••"
          />
        </div>

        <div className="p-4 bg-[#1a1a1a]/5 space-y-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
            <ShieldCheck size={12} />
            Security Requirements
          </div>
          <ul className="text-[10px] text-[#1a1a1a]/60 space-y-1 list-disc pl-4 font-light">
            <li>Minimum 12 characters</li>
            <li>Include uppercase & lowercase</li>
            <li>Include at least one number</li>
            <li>Include a special character</li>
          </ul>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#1a1a1a] text-white py-4 flex items-center justify-center gap-2 hover:bg-[#333] transition-colors uppercase tracking-[0.2em] text-xs font-medium"
        >
          Update Password
        </button>
      </form>
    </AuthLayout>
  );
}
