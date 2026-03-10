import React, { useState } from 'react';
import { Mail, Plus, Search, Edit2, Trash2, Copy, FileText } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: string;
  lastModified: string;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Booking Confirmation',
    subject: 'Your Booking at GrandView Hotel is Confirmed!',
    category: 'Reservations',
    lastModified: '2026-03-05',
  },
  {
    id: '2',
    name: 'Welcome Email',
    subject: 'Welcome to GrandView Hotel, {guest_name}!',
    category: 'Guest Relations',
    lastModified: '2026-02-28',
  },
  {
    id: '3',
    name: 'Invoice Receipt',
    subject: 'Your Invoice from GrandView Hotel',
    category: 'Billing',
    lastModified: '2026-03-01',
  },
];

export default function EmailTemplatePage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-500 text-sm">Manage automated email communications</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} />
          Create Template
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Template Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject Line</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Modified</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{template.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {template.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {template.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.lastModified}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors" title="Duplicate">
                        <Copy size={18} />
                      </button>
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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
          <h3 className="font-semibold text-indigo-900 mb-2">Template Variables</h3>
          <p className="text-sm text-indigo-800 mb-4">Use these placeholders to personalize your emails:</p>
          <div className="flex flex-wrap gap-2">
            {['{guest_name}', '{booking_id}', '{check_in}', '{check_out}', '{room_number}', '{hotel_name}'].map(tag => (
              <code key={tag} className="px-2 py-1 bg-white rounded border border-indigo-200 text-xs font-mono text-indigo-600">
                {tag}
              </code>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
