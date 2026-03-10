import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Smartphone } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

export default function TwoFactorPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate verification
    console.log('Verifying code:', code.join(''));
    // Redirect to dashboard
    navigate('/dashboard/main');
  };

  return (
    <AuthLayout 
      title="Security Verification" 
      subtitle="A verification code has been sent to your registered mobile device."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-center gap-3">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-16 text-center text-2xl font-serif bg-white border border-[#1a1a1a]/10 rounded-none focus:outline-none focus:border-[#1a1a1a] transition-colors"
            />
          ))}
        </div>

        <div className="text-center space-y-4">
          <p className="text-xs text-[#1a1a1a]/60 font-light">
            Didn't receive the code? <button type="button" className="text-[#1a1a1a] font-medium underline underline-offset-4">Resend via SMS</button>
          </p>
          
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-[#1a1a1a]/40">
            <Smartphone size={14} />
            Ending in •••• 8829
          </div>
        </div>

        <button 
          type="submit"
          disabled={code.some(d => !d)}
          className="w-full bg-[#1a1a1a] text-white py-4 flex items-center justify-center gap-2 hover:bg-[#333] transition-colors uppercase tracking-[0.2em] text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify Identity
        </button>

        <div className="p-4 border border-amber-100 bg-amber-50/50 flex gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-amber-900 mb-1">Security Notice</p>
            <p className="text-[10px] text-amber-800/70 leading-relaxed font-light">
              Never share your verification code with anyone. GrandView staff will never ask for this code.
            </p>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
