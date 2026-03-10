import React, { useState } from 'react';
import { Percent, Plus, Trash2, Edit2, Save, Info } from 'lucide-react';

interface Tax {
  id: string;
  name: string;
  rate: number;
  type: 'percentage' | 'fixed';
  appliesTo: 'room' | 'service' | 'all';
  status: 'active' | 'inactive';
}

const initialTaxes: Tax[] = [
  { id: '1', name: 'VAT', rate: 10, type: 'percentage', appliesTo: 'all', status: 'active' },
  { id: '2', name: 'City Tax', rate: 2.5, type: 'fixed', appliesTo: 'room', status: 'active' },
  { id: '3', name: 'Service Charge', rate: 5, type: 'percentage', appliesTo: 'service', status: 'active' },
];

export default function TaxSettingsPage() {
  const [taxes, setTaxes] = useState(initialTaxes);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Settings</h1>
          <p className="text-gray-500 text-sm">Configure taxes and service charges for billing</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} />
          Add New Tax
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applies To</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {taxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{tax.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{tax.type}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {tax.type === 'percentage' ? `${tax.rate}%` : `$${tax.rate.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 capitalize">
                        {tax.appliesTo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
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
              <Percent size={20} className="text-indigo-600" />
              Tax Calculation
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Tax Inclusive Pricing</p>
                  <p className="text-xs text-gray-500">Show prices with tax included</p>
                </div>
                <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out bg-gray-200 rounded-full cursor-pointer">
                  <div className="absolute left-0 w-5 h-5 transition duration-200 ease-in-out transform bg-white border border-gray-200 rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Compound Tax</p>
                  <p className="text-xs text-gray-500">Calculate tax on top of other taxes</p>
                </div>
                <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out bg-gray-200 rounded-full cursor-pointer">
                  <div className="absolute left-0 w-5 h-5 transition duration-200 ease-in-out transform bg-white border border-gray-200 rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
              <Save size={18} />
              Save Settings
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex gap-3">
              <Info className="text-gray-400 shrink-0" size={20} />
              <p className="text-xs text-gray-600 leading-relaxed">
                Tax settings affect all new invoices and bookings. Existing invoices will not be modified automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
