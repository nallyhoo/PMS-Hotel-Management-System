import React from 'react';
import { Settings, Clock, Shield, Bell, Save, Database } from 'lucide-react';

export default function SystemConfigurationPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
          <p className="text-gray-500 text-sm">Fine-tune system-wide behaviors and preferences</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
          <Save size={18} />
          Save Settings
        </button>
      </div>

      <div className="space-y-6">
        {/* Reservation Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Clock size={20} className="text-indigo-600" />
            Reservation & Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
              <input
                type="time"
                defaultValue="14:00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
              <input
                type="time"
                defaultValue="11:00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                <option>UTC -8:00 (Pacific Time)</option>
                <option>UTC +0:00 (GMT)</option>
                <option>UTC +7:00 (ICT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Shield size={20} className="text-indigo-600" />
            Security & Access
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Require 2FA for all staff accounts</p>
              </div>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-gray-200 rounded-full cursor-pointer">
                <div className="absolute left-0 w-6 h-6 transition duration-200 ease-in-out transform bg-white border border-gray-200 rounded-full shadow-sm translate-x-6 border-indigo-600"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Session Timeout</p>
                <p className="text-sm text-gray-500">Auto logout after 30 minutes of inactivity</p>
              </div>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-gray-200 rounded-full cursor-pointer">
                <div className="absolute left-0 w-6 h-6 transition duration-200 ease-in-out transform bg-white border border-gray-200 rounded-full shadow-sm translate-x-6 border-indigo-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* System Maintenance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Database size={20} className="text-indigo-600" />
            Data Management
          </h2>
          <div className="flex gap-4">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Export System Data
            </button>
            <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
