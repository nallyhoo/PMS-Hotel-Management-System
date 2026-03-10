import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  ChevronRight, 
  Utensils,
  Clock,
  ArrowLeft,
  CheckCircle2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const menuItems = [
  { id: 1, name: 'Grilled Salmon', category: 'Main Course', price: 32.00, image: 'https://picsum.photos/seed/salmon/200/200' },
  { id: 2, name: 'Caesar Salad', category: 'Starters', price: 18.00, image: 'https://picsum.photos/seed/salad/200/200' },
  { id: 3, name: 'Beef Tenderloin', category: 'Main Course', price: 45.00, image: 'https://picsum.photos/seed/beef/200/200' },
  { id: 4, name: 'Truffle Pasta', category: 'Main Course', price: 28.00, image: 'https://picsum.photos/seed/pasta/200/200' },
  { id: 5, name: 'Chocolate Lava Cake', category: 'Desserts', price: 14.00, image: 'https://picsum.photos/seed/cake/200/200' },
  { id: 6, name: 'House Red Wine', category: 'Beverages', price: 12.00, image: 'https://picsum.photos/seed/wine/200/200' },
  { id: 7, name: 'Iced Latte', category: 'Beverages', price: 6.50, image: 'https://picsum.photos/seed/coffee/200/200' },
  { id: 8, name: 'Mushroom Risotto', category: 'Main Course', price: 24.00, image: 'https://picsum.photos/seed/risotto/200/200' },
];

const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

export default function RestaurantOrderPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const filteredItems = menuItems.filter(item => 
    (selectedCategory === 'All' || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Restaurant Order</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" />
              <input 
                type="text" 
                placeholder="Search menu..." 
                className="pl-10 pr-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-[#1a1a1a] text-white shadow-md' 
                  : 'bg-white text-[#1a1a1a]/60 border border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
          {filteredItems.map((item) => (
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
            <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] text-white flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h3 className="font-serif font-medium text-[#1a1a1a]">Current Order</h3>
              <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">Table T-12</p>
            </div>
          </div>
          <button className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <Utensils size={48} />
              <p className="text-sm font-medium">Your cart is empty.<br/>Select items from the menu.</p>
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
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#1a1a1a]/40">Subtotal</span>
              <span className="font-medium text-[#1a1a1a]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#1a1a1a]/40">Tax (10%)</span>
              <span className="font-medium text-[#1a1a1a]">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-serif font-bold pt-2 border-t border-[#1a1a1a]/5">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={() => navigate('/pos/billing/ORD-NEW')}
            className="w-full bg-[#1a1a1a] text-white py-4 rounded-2xl font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-lg shadow-[#1a1a1a]/10 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            Place Order
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
