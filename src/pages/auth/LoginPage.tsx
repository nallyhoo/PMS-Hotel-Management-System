import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login logic
    console.log('Logging in with:', email);
    // Redirect to dashboard
    navigate('/dashboard/main');
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Please enter your credentials to access the management console."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">
            Email Address
          </label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-[#1a1a1a]/10 rounded-none px-4 py-3 focus:outline-none focus:border-[#1a1a1a] transition-colors font-light"
            placeholder="name@grandview.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">
              Password
            </label>
            <Link 
              to="/auth/forgot-password" 
              className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#1a1a1a]/10 rounded-none px-4 py-3 focus:outline-none focus:border-[#1a1a1a] transition-colors font-light"
              placeholder="••••••••"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40 hover:text-[#1a1a1a]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" className="w-4 h-4 border-[#1a1a1a]/10 rounded-none accent-[#1a1a1a]" />
          <label htmlFor="remember" className="text-xs text-[#1a1a1a]/60 font-light">
            Remember this device for 30 days
          </label>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#1a1a1a] text-white py-4 flex items-center justify-center gap-2 hover:bg-[#333] transition-colors uppercase tracking-[0.2em] text-xs font-medium"
        >
          <LogIn size={16} />
          Sign In
        </button>
      </form>
    </AuthLayout>
  );
}
