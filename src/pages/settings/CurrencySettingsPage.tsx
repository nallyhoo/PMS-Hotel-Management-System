import React, { useState } from 'react';
import { DollarSign, Plus, Trash2, RefreshCw, Check, Globe } from 'lucide-react';

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
}

const initialCurrencies: Currency[] = [
  { id: '1', code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0, isDefault: true },
  { id: '2', code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.92, isDefault: false },
  { id: '3', code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.79, isDefault: false },
  { id: '4', code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 150.45, isDefault: false },
];

export default function CurrencySettingsPage() {
  const [currencies, setCurrencies] = useState(initialCurrencies);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Currency Settings</h1>
          <p className="text-gray-500 text-sm">Manage currencies and exchange rates for your hotel</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw size={18} />
            Update Rates
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus size={18} />
            Add Currency
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Currency</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate (1 USD)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currencies.map((currency) => (
                  <tr key={currency.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {currency.code}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {currency.name}
                            {currency.isDefault && (
                              <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase">Default</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{currency.symbol}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{currency.exchangeRate.toFixed(4)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {!currency.isDefault && (
                          <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors" title="Set as Default">
                            <Check size={18} />
                          </button>
                        )}
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe size={20} className="text-indigo-600" />
              Global Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Currency</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-gray-50 cursor-not-allowed" disabled>
                  <option>USD - US Dollar</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Base currency is used for internal accounting and cannot be changed easily.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Display Format</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                  <option>$1,234.56</option>
                  <option>1.234,56 $</option>
                  <option>USD 1,234.56</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex gap-3">
              <DollarSign className="text-indigo-600 shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-indigo-900">Exchange Rates</h4>
                <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                  Exchange rates are used for display purposes only. All transactions are processed in the base currency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
