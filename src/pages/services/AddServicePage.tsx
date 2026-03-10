import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X, 
  Image as ImageIcon, 
  Clock, 
  Tag, 
  Layers, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function AddServicePage() {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    status: 'Active',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      navigate('/services/list');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/services/list')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Add New Service</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Create a new resort service or activity</p>
          </div>
        </div>
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
            <p className="text-sm font-medium">Service created successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                <Tag size={12} />
                Service Name
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. Deep Tissue Massage"
                className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                  <Layers size={12} />
                  Category
                </label>
                <select 
                  required
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category...</option>
                  <option>Wellness</option>
                  <option>Dining</option>
                  <option>Transport</option>
                  <option>Activities</option>
                  <option>Housekeeping</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                  <Clock size={12} />
                  Duration
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 60 min"
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Description</label>
              <textarea 
                rows={4}
                placeholder="Describe the service details, benefits, and requirements..."
                className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-2">Availability</h3>
            <div className="flex flex-wrap gap-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const newAvailability = formData.availability.includes(day)
                      ? formData.availability.filter(d => d !== day)
                      : [...formData.availability, day];
                    setFormData({...formData, availability: newAvailability});
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                    formData.availability.includes(day)
                      ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white'
                      : 'bg-white border-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:border-[#1a1a1a]/30'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-2">Pricing & Status</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold">Base Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 text-sm">$</span>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm font-medium"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold">Status</label>
                <select 
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Seasonal</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-xl flex gap-3 text-blue-800">
            <Info size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed opacity-80">
              New services will be immediately available for booking once set to "Active".
            </p>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Create Service
          </button>
        </div>
      </form>
    </div>
  );
}
