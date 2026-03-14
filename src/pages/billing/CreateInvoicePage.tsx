import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  User, 
  Calendar, 
  CreditCard, 
  Search,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import billingService from '../../api/billing';
import reservationService from '../../api/reservations';
import { toastSuccess, toastError } from '../../lib/toast';

export default function CreateInvoicePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, description: '', quantity: 1, rate: 0, amount: 0, itemType: 'Service' }
  ]);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [taxRate] = useState(10);

  // Fetch active reservations
  const { data: reservationsData, isLoading } = useQuery({
    queryKey: ['reservations', 'active'],
    queryFn: () => reservationService.getReservations({ status: 'Checked In', limit: 50 }),
  });

  const reservations = reservationsData?.data || [];
  const filteredReservations = reservations.filter((r: any) => 
    !searchTerm || 
    r.reservationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create invoice mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => billingService.createInvoice(data),
    onSuccess: (data) => {
      toastSuccess(`Invoice ${data.invoiceNumber} created successfully!`);
      navigate('/billing/invoices');
    },
    onError: (error: any) => {
      toastError(error.message || 'Failed to create invoice');
    },
  });

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, rate: 0, amount: 0, itemType: 'Service' }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReservation) {
      toastError('Please select a guest/reservation');
      return;
    }

    if (items.length === 0 || items.every(item => !item.description)) {
      toastError('Please add at least one item');
      return;
    }

    const invoiceItems = items
      .filter(item => item.description)
      .map(item => ({
        itemType: item.itemType,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.rate,
        amount: item.amount,
        taxRate: taxRate
      }));

    createMutation.mutate({
      reservationId: selectedReservation.reservationId,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || null,
      subTotal: subtotal,
      taxAmount: tax,
      discountAmount: 0,
      totalAmount: total,
      notes: notes || null,
      items: invoiceItems
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/billing/invoices')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Create New Invoice</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Draft a new billing document for a guest</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/billing/invoices')}
            className="px-6 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm disabled:opacity-50"
          >
            {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {createMutation.isPending ? 'Saving...' : 'Save Invoice'}
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Guest & Basic Info */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                  <User size={12} />
                  Guest Selection
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" />
                  <input 
                    type="text" 
                    placeholder="Search guest or reservation..."
                    className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {showDropdown && filteredReservations.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#1a1a1a]/10 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredReservations.slice(0, 5).map((r: any) => (
                        <button
                          key={r.reservationId}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-[#f8f9fa] transition-colors border-b border-[#1a1a1a]/5 last:border-0"
                          onClick={() => {
                            setSelectedReservation(r);
                            setSearchTerm(`${r.firstName} ${r.lastName} - ${r.reservationCode}`);
                            setShowDropdown(false);
                          }}
                        >
                          <p className="text-sm font-medium">{r.firstName} {r.lastName}</p>
                          <p className="text-xs text-[#1a1a1a]/40">{r.reservationCode}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {selectedReservation && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{selectedReservation.firstName} {selectedReservation.lastName}</p>
                      <p className="text-xs text-blue-600">{selectedReservation.reservationCode}</p>
                    </div>
                    <button type="button" onClick={() => { setSelectedReservation(null); setSearchTerm(''); }} className="text-blue-400 hover:text-blue-600">
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                  <Calendar size={12} />
                  Due Date
                </label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-8">
              <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-6">Invoice Items</h3>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-2 space-y-2">
                      {index === 0 && <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold block">Type</label>}
                      <select 
                        className="w-full px-3 py-3 bg-[#f8f9fa] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1a1a1a]/5"
                        value={item.itemType}
                        onChange={(e) => updateItem(item.id, 'itemType', e.target.value)}
                      >
                        <option value="Room">Room</option>
                        <option value="Service">Service</option>
                        <option value="Food">Food</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-span-5 space-y-2">
                      {index === 0 && <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold">Description</label>}
                      <input 
                        type="text" 
                        placeholder="Item description..."
                        className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-sm"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      {index === 0 && <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold text-center block">Qty</label>}
                      <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-sm text-center"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      {index === 0 && <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold text-right block">Amount</label>}
                      <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-sm text-right"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <div className="text-sm font-medium py-3 w-full text-right">
                        ${item.amount.toFixed(2)}
                      </div>
                      {items.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-3 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                type="button"
                onClick={addItem}
                className="mt-6 flex items-center gap-2 text-sm font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
              >
                <Plus size={16} />
                Add Another Item
              </button>
            </div>
          </div>
        </div>

        {/* Totals & Summary */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-2">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/40">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/40">Tax ({taxRate}%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#1a1a1a]/5">
                <span className="text-lg font-serif font-medium">Total</span>
                <span className="text-lg font-serif font-medium">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Notes & Terms</label>
            <textarea 
              rows={4}
              placeholder="Add any special notes or terms here..."
              className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-sm resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
