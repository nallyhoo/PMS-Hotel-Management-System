import React from 'react';
import { motion } from 'motion/react';
import { Hotel } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f2ed] flex flex-col md:flex-row font-sans text-[#1a1a1a]">
      {/* Left Side: Branding & Image */}
      <div className="hidden md:flex md:w-1/2 bg-[#1a1a1a] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Hotel Lobby" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-white max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                <Hotel className="w-6 h-6 text-[#f5f2ed]" />
              </div>
              <span className="text-2xl font-serif tracking-widest uppercase">GrandView</span>
            </div>
            <h1 className="text-5xl font-serif font-light leading-tight mb-6">
              The Art of <br />
              <span className="italic">Hospitality</span> Management
            </h1>
            <p className="text-white/60 font-light leading-relaxed">
              Welcome to GrandView PMS. Our sophisticated platform empowers your team to deliver exceptional guest experiences with precision and grace.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-12 left-12 flex gap-8 text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span>Est. 1924</span>
          <span>Excellence in Service</span>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-serif font-light mb-2">{title}</h2>
            {subtitle && <p className="text-sm text-[#1a1a1a]/60">{subtitle}</p>}
          </div>
          
          {children}
          
          <div className="mt-12 pt-8 border-t border-[#1a1a1a]/10 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#1a1a1a]/40">
            <span>&copy; 2026 GrandView PMS</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#1a1a1a] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#1a1a1a] transition-colors">Support</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
