import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  CheckCircle2,
  User,
  Calendar,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import billingService from '../../api/billing';

interface InvoiceItem {
  itemId?: number;
  id?: number;
  itemType: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
}

export default function EditInvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [invoice, setInvoice] = useState<any>({
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    status: 'Pending',
    notes: '',
    FirstName: '',
    LastName: '',
    ReservationCode: ''
  });
  
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [taxRate, setTaxRate] = useState(10);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const data: any = await billingService.getInvoice(Number(id));
      if (data) {
        setInvoice({
          invoiceId: data.InvoiceID,
          invoiceNumber: data.InvoiceNumber,
          invoiceDate: data.InvoiceDate?.split('T')[0] || '',
          dueDate: data.DueDate?.split('T')[0] || '',
          status: data.Status,
          notes: data.Notes || '',
          FirstName: data.FirstName || '',
          LastName: data.LastName || '',
          ReservationCode: data.ReservationCode || ''
        });
        
        if (data.items && data.items.length > 0) {
          setItems(data.items.map((item: any) => ({
            itemId: item.ItemID,
            itemType: item.ItemType,
            description: item.Description,
            quantity: item.Quantity,
            unitPrice: item.UnitPrice,
            amount: item.Amount,
            taxRate: item.TaxRate || 0
          })));
        }
        
        if (data.TaxAmount && data.SubTotal) {
          setTaxRate((data.TaxAmount / data.SubTotal) * 100);
        }
      }
    } catch (err) {
      setError('Failed to load invoice');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { 
      id: Date.now(), 
      itemType: 'Other', 
      description: '', 
      quantity: 1, 
      unitPrice: 0, 
      amount: 0,
      taxRate 
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index] };
    
    if (field === 'itemType') item.itemType = value;
    else if (field === 'description') item.description = value;
    else if (field === 'quantity') {
      item.quantity = parseInt(value) || 0;
      item.amount = item.quantity * item.unitPrice;
    }
    else if (field === 'unitPrice') {
      item.unitPrice = parseFloat(value) || 0;
      item.amount = item.quantity * item.unitPrice;
    }
    else if (field === 'taxRate') {
      item.taxRate = parseFloat(value) || 0;
    }
    
    newItems[index] = item;
    setItems(newItems);
  };

  const recalculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = recalculateTotals();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const invoiceData = {
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        subTotal: subtotal,
        taxAmount: tax,
        discountAmount: 0,
        totalAmount: total,
        status: invoice.status,
        notes: invoice.notes,
        items: items.map(item => ({
          itemType: item.itemType,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
          taxRate: item.taxRate
        }))
      };

      await billingService.updateInvoice(Number(id), invoiceData);
      setIsSaved(true);
      setTimeout(() => {
        navigate(`/billing/details/${id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save invoice');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a1a1a]/40 mx-auto" />
        <p className="mt-4 text-[#1a1a1a]/40">Loading invoice...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/billing/details/${id}`)}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Edit Invoice {invoice.invoiceNumber}</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Modify existing billing details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/billing/details/${id}`)}
            className="px-6 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Update Invoice'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-800"
          >
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-sm font-medium">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSaved && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800"
          >
            <CheckCircle2 size={20} className="text-emerald-600" />
            <p className="text-sm font-medium">Invoice updated successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Guest Info (Read-only in Edit) */}
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                  <User size={12} />
                  Guest
                </label>
                <div className="px-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-sm font-medium text-[#1a1a1a]/60">
                  {invoice.FirstName} {invoice.LastName} ({invoice.ReservationCode || 'No Reservation'})
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                  <Calendar size={12} />
                  Due Date
                </label>
                <input 
                  type="date" 
                  value={invoice.dueDate}
                  onChange={(e) => setInvoice({...invoice, dueDate: e.target.value})}
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                />
              </div>
            </div>
            
            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                  Status
                </label>
                <select 
                  value={invoice.status}
                  onChange={(e) => setInvoice({...invoice, status: e.target.value})}
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                  Notes
                </label>
                <input 
                  type="text" 
                  value={invoice.notes || ''}
                  onChange={(e) => setInvoice({...invoice, notes: e.target.value})}
                  placeholder="Add notes..."
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
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
                  <div key={item.itemId || index} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-2 space-y-2">
                      {index === 0 && <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold">Type</label>}
                      <select 
                        className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                        value={item.itemType}
                        onChange={(e) => updateItem(index, 'itemType', e.target.value)}
                      >
                        <option value="Room">Room</option>
                        <option value="Service">Service</option>
                        <option value="Food">Food</option>
                        <option value="Beverage">Beverage</option>
                        <option value="Tax">Tax</option>
                        <option value="Discount">Discount</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-span-4 space-y-2">
                      {index === 0 && <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold">Description</label>}
                      <input 
                        type="text" 
                        placeholder="Item description..."
                        className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      {index === 0 && <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold text-center block">Qty</label>}
                      <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm text-center"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      {index === 0 && <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold text-right block">Rate</label>}
                      <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm text-right"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="flex-1 text-right text-sm font-medium py-3">
                        ${item.amount?.toFixed(2) || '0.00'}
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-3 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
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
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#1a1a1a]/40">Tax Rate (%)</span>
                <input 
                  type="number" 
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-20 px-3 py-1 bg-[#f8f9fa] border-none rounded-lg text-right text-sm font-medium"
                />
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

          {invoice.status === 'Paid' && (
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-amber-800">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed opacity-80">
                Editing a paid invoice will create an adjustment record in the billing history.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
