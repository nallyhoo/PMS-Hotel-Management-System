import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  ChevronRight, 
  Coffee,
  Clock,
  ArrowLeft,
  CheckCircle2,
  X,
  DoorOpen,
  User,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const menuItems = [
  { id: 1, name: 'Continental Breakfast', category: 'Breakfast', price: 22.00, image: 'https://picsum.photos/seed/breakfast/200/200' },
  { id: 2, name: 'Club Sandwich', category: 'Lunch', price: 18.00, image: 'https://picsum.photos/seed/sandwich/200/200' },
  { id: 3, name: 'Margherita Pizza', category: 'Dinner', price: 24.00, image: 'https://picsum.photos/seed/pizza/200/200' },
  { id: 4, name: 'Fruit Platter', category: 'Snacks', price: 15.00, image: 'https://picsum.photos/seed/fruit/200/200' },
  { id: 5, name: 'Mineral Water (Large)', category: 'Beverages', price: 5.00, image: 'https://picsum.photos/seed/water/200/200' },
  { id: 6, name: 'Orange Juice', category: 'Beverages', price: 7.00, image: 'https://picsum.photos/seed/juice/200/200' },
];

export default function RoomServiceOrderPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);
  const [roomNumber, setRoomNumber] = useState('');
  const [guestName, setGuestName] = useState('');

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    const existing = cart.find(c => c.id === id);
    if (existing.quantity > 1) {
      setCart(cart.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c));
    } else {
      setCart(cart.filter(c => c.id !== id));
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceCharge = subtotal * 0.15;
  const total = subtotal + serviceCharge;

  return (
    <div className="flex h-[calc(100vh-120px)] gap-8 overflow-hidden">
      {/* Menu Section */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/pos/dashboard')}
              className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Room Service Order</h1>
          </div>
        </div>

        {/* Room Info Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#1a1a1a]/5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
              <DoorOpen size={12} />
              Room Number
            </label>
            <input 
              type="text" 
              placeholder="e.g. 402"
              className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm font-medium"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
              <User size={12} />
              Guest Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm font-medium"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
          {menuItems.map((item) => (
            <motion.div 
              layout
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all"
            >
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold text-[#1a1a1a]">
                  ${item.price.toFixed(2)}
                </div>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-1">{item.category}</p>
                <h3 className="font-medium text-[#1a1a1a] group-hover:text-blue-600 transition-colors">{item.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white rounded-3xl border border-[#1a1a1a]/5 shadow-lg flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#1a1a1a]/5 flex items-center justify-between bg-[#f8f9fa]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Coffee size={20} />
            </div>
            <div>
              <h3 className="font-serif font-medium text-[#1a1a1a]">Room Order</h3>
              <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">{roomNumber ? `Room ${roomNumber}` : 'Select Room'}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <ShoppingCart size={48} />
              <p className="text-sm font-medium">No items selected.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-[#1a1a1a]">{item.name}</h4>
                  <p className="text-xs text-[#1a1a1a]/40">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 rounded-lg border border-[#1a1a1a]/10 flex items-center justify-center hover:bg-[#f8f9fa] transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 rounded-lg border border-[#1a1a1a]/10 flex items-center justify-center hover:bg-[#f8f9fa] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-[#f8f9fa] border-t border-[#1a1a1a]/5 space-y-4">
          <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-800 mb-2">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed">
              A 15% service charge is applied to all room service orders.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#1a1a1a]/40">Subtotal</span>
              <span className="font-medium text-[#1a1a1a]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#1a1a1a]/40">Service Charge (15%)</span>
              <span className="font-medium text-[#1a1a1a]">${serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-serif font-bold pt-2 border-t border-[#1a1a1a]/5">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0 || !roomNumber}
            onClick={() => navigate('/pos/billing/ORD-RS-NEW')}
            className="w-full bg-[#1a1a1a] text-white py-4 rounded-2xl font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-lg shadow-[#1a1a1a]/10 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            Send to Room
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
