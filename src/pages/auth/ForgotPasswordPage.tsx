import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle="We've sent recovery instructions to your registered email address."
      >
        <div className="space-y-8">
          <div className="p-6 bg-white border border-[#1a1a1a]/5 text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-[#1a1a1a]/20" />
            <p className="text-sm text-[#1a1a1a]/60 font-light leading-relaxed">
              If an account exists for that email, you will receive a link to reset your password shortly.
            </p>
          </div>
          
          <Link 
            to="/auth/login"
            className="w-full border border-[#1a1a1a] text-[#1a1a1a] py-4 flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-white transition-all uppercase tracking-[0.2em] text-xs font-medium"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">
            Email Address
          </label>
          <input 
            type="email" 
            required
            className="w-full bg-white border border-[#1a1a1a]/10 rounded-none px-4 py-3 focus:outline-none focus:border-[#1a1a1a] transition-colors font-light"
            placeholder="name@grandview.com"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-[#1a1a1a] text-white py-4 flex items-center justify-center gap-2 hover:bg-[#333] transition-colors uppercase tracking-[0.2em] text-xs font-medium"
        >
          Send Reset Link
        </button>

        <Link 
          to="/auth/login"
          className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors"
        >
          <ArrowLeft size={12} />
          Return to Login
        </Link>
      </form>
    </AuthLayout>
  );
}
