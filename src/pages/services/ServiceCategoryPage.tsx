import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  Layers, 
  Tag, 
  ChevronRight, 
  MoreVertical,
  CheckCircle2,
  Save,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const initialCategories = [
  { id: 1, name: 'Wellness', count: 12, status: 'Active', color: 'bg-blue-50 text-blue-600' },
  { id: 2, name: 'Dining', count: 8, status: 'Active', color: 'bg-emerald-50 text-emerald-600' },
  { id: 3, name: 'Transport', count: 5, status: 'Active', color: 'bg-amber-50 text-amber-600' },
  { id: 4, name: 'Activities', count: 10, status: 'Active', color: 'bg-indigo-50 text-indigo-600' },
  { id: 5, name: 'Housekeeping', count: 7, status: 'Active', color: 'bg-gray-50 text-gray-600' },
];

export default function ServiceCategoryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(initialCategories);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory) return;
    const nextId = categories.length + 1;
    setCategories([...categories, { 
      id: nextId, 
      name: newCategory, 
      count: 0, 
      status: 'Active', 
      color: 'bg-gray-50 text-gray-600' 
    }]);
    setNewCategory('');
    setIsAdding(false);
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
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Service Categories</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Organize your services into logical groups</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
        >
          <Plus size={16} />
          New Category
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/10 shadow-sm flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Category Name</label>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="e.g. Spa & Wellness"
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="p-3 hover:bg-[#1a1a1a]/5 rounded-xl transition-colors text-[#1a1a1a]/40"
                >
                  <X size={20} />
                </button>
                <button 
                  type="submit"
                  className="bg-[#1a1a1a] text-white p-3 rounded-xl hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
                >
                  <Save size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${category.color}`}>
                <Layers size={24} />
              </div>
              <div>
                <h3 className="font-medium text-[#1a1a1a]">{category.name}</h3>
                <p className="text-xs text-[#1a1a1a]/40">{category.count} Services</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60">
                  <Edit2 size={16} />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
              <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/20">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
          <Tag size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-serif font-medium text-blue-900 mb-2">Organize for Efficiency</h3>
          <p className="text-sm text-blue-700/70 leading-relaxed">
            Categories help your staff quickly find services and allow for better reporting on service usage across different resort departments.
          </p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20">
          View Reports
        </button>
      </div>
    </div>
  );
}
