import React, { useState } from 'react';
import { 
  Wrench, 
  MapPin, 
  AlertCircle, 
  Camera, 
  Send,
  X,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MaintenanceRequestPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    category: 'General',
    priority: 'Medium',
    description: '',
    reportedBy: 'Alexander Wright'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">New Maintenance Request</h1>
        <p className="text-[#1a1a1a]/60 text-sm">Report a maintenance issue or request service</p>
      </div>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800"
          >
            <CheckCircle2 size={20} className="text-emerald-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Request submitted successfully!</p>
              <p className="text-xs opacity-80">Maintenance team has been notified. Request ID: MNT-2045</p>
            </div>
            <button onClick={() => setIsSubmitted(false)}>
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Location & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                <MapPin size={12} />
                Location / Room Number
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. Room 402, Lobby, Pool"
                className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                <Wrench size={12} />
                Category
              </label>
              <select 
                className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>General</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>HVAC</option>
                <option>Furniture</option>
                <option>IT / Tech</option>
              </select>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
              <AlertCircle size={12} />
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['Low', 'Medium', 'High'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`py-3 rounded-xl text-sm font-medium transition-all border ${
                    formData.priority === p 
                      ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                      : 'bg-white text-[#1a1a1a]/60 border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
              Issue Description
            </label>
            <textarea 
              required
              rows={4}
              placeholder="Please describe the issue in detail..."
              className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
              Attach Photos (Optional)
            </label>
            <div className="border-2 border-dashed border-[#1a1a1a]/5 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-[#f8f9fa] hover:border-[#1a1a1a]/10 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-[#f8f9fa] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera size={20} className="text-[#1a1a1a]/40" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#1a1a1a]">Click to upload or drag and drop</p>
                <p className="text-xs text-[#1a1a1a]/40 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50/50 p-4 rounded-xl flex gap-3 text-blue-800">
            <Info size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed opacity-80">
              Urgent requests (High Priority) will be automatically dispatched to the on-call maintenance technician immediately.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Submit Maintenance Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
