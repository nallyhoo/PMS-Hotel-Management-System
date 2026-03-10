import React, { useState } from 'react';
import { Send, Users, Mail, MessageSquare, Bell, AlertCircle } from 'lucide-react';

export default function SendNotificationPage() {
  const [type, setType] = useState<'email' | 'sms' | 'system'>('email');
  const [recipientType, setRecipientType] = useState<'all' | 'guests' | 'staff' | 'specific'>('all');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Send Notification</h1>
        <p className="text-gray-500">Compose and send messages to guests or staff</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail size={20} className="text-indigo-600" />
              Message Content
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Enter notification subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
                <textarea
                  rows={6}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users size={20} className="text-indigo-600" />
              Recipients
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'all', label: 'All Users' },
                { id: 'guests', label: 'All Guests' },
                { id: 'staff', label: 'All Staff' },
                { id: 'specific', label: 'Specific' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setRecipientType(opt.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    recipientType === opt.id
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            
            {recipientType === 'specific' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email/Phone</label>
                <input
                  type="text"
                  placeholder="Enter email or phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Notification Type</h2>
            <div className="space-y-3">
              {[
                { id: 'email', label: 'Email Notification', icon: Mail, color: 'text-blue-500' },
                { id: 'sms', label: 'SMS Message', icon: MessageSquare, color: 'text-green-500' },
                { id: 'system', label: 'System Alert', icon: Bell, color: 'text-amber-500' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setType(opt.id as any)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    type === opt.id
                      ? 'bg-indigo-50 border-indigo-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <opt.icon className={opt.color} size={20} />
                  <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex gap-3">
              <AlertCircle className="text-indigo-600 shrink-0" size={20} />
              <p className="text-xs text-indigo-800 leading-relaxed">
                Notifications sent via SMS may incur additional charges depending on your provider settings.
              </p>
            </div>
          </div>

          <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
            <Send size={18} />
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}
