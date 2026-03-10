import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, X } from 'lucide-react';
import { mockSuppliers } from '../../data/mockSuppliers';

export default function EditSupplierPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    status: 'active',
    rating: 5.0,
  });

  useEffect(() => {
    const supplier = mockSuppliers.find(s => s.id === id);
    if (supplier) {
      setFormData({
        name: supplier.name,
        contactPerson: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        category: supplier.category,
        status: supplier.status,
        rating: supplier.rating,
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating supplier:', formData);
    navigate('/suppliers/list');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/suppliers/list')}
          className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Edit Supplier</h1>
          <p className="text-sm text-[#1a1a1a]/60">Update vendor information for {formData.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Supplier Name</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Category</label>
              <select 
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Food & Beverage</option>
                <option>Housekeeping</option>
                <option>Maintenance & IT</option>
                <option>Office Supplies</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Contact Person</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Status</label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    checked={formData.status === 'active'}
                    onChange={() => setFormData({...formData, status: 'active'})}
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    checked={formData.status === 'inactive'}
                    onChange={() => setFormData({...formData, status: 'inactive'})}
                  />
                  <span className="text-sm">Inactive</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Phone Number</label>
              <input 
                required
                type="tel" 
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Physical Address</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20 resize-none"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </div>

        <div className="p-6 bg-[#f8f9fa] border-t border-[#1a1a1a]/5 flex justify-end gap-3">
          <button 
            type="button"
            onClick={() => navigate('/suppliers/list')}
            className="px-6 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-6 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            <span>Update Supplier</span>
          </button>
        </div>
      </form>
    </div>
  );
}
