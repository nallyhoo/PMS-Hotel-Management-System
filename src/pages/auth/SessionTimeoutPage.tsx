import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, RefreshCw, LogIn } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

export default function SessionTimeoutPage() {
  return (
    <AuthLayout 
      title="Session Expired" 
      subtitle="Your management session has timed out due to inactivity."
    >
      <div className="space-y-8">
        <div className="p-8 bg-white border border-[#1a1a1a]/5 text-center space-y-4">
          <div className="w-16 h-16 bg-[#1a1a1a]/5 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-[#1a1a1a]/40" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-serif">Security Timeout</h3>
            <p className="text-sm text-[#1a1a1a]/60 font-light leading-relaxed">
              For security reasons, GrandView PMS automatically ends sessions after 15 minutes of inactivity to protect sensitive guest information.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link 
            to="/auth/login"
            className="w-full bg-[#1a1a1a] text-white py-4 flex items-center justify-center gap-2 hover:bg-[#333] transition-colors uppercase tracking-[0.2em] text-xs font-medium"
          >
            <LogIn size={16} />
            Sign In Again
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full border border-[#1a1a1a] text-[#1a1a1a] py-4 flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-white transition-all uppercase tracking-[0.2em] text-xs font-medium"
          >
            <RefreshCw size={16} />
            Refresh Page
          </button>
        </div>

        <p className="text-center text-[10px] uppercase tracking-widest text-[#1a1a1a]/40">
          Any unsaved changes may have been lost.
        </p>
      </div>
    </AuthLayout>
  );
}
