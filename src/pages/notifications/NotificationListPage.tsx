import React, { useState } from 'react';
import { Bell, Search, Filter, Mail, MessageSquare, Trash2, Eye, MoreVertical } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'sms' | 'system';
  recipient: string;
  status: 'sent' | 'failed' | 'pending';
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Booking Confirmation',
    message: 'Your booking for Room 302 has been confirmed.',
    type: 'email',
    recipient: 'john.doe@example.com',
    status: 'sent',
    createdAt: '2026-03-10 09:00',
  },
  {
    id: '2',
    title: 'Check-in Reminder',
    message: 'Don\'t forget to check in today!',
    type: 'sms',
    recipient: '+1234567890',
    status: 'sent',
    createdAt: '2026-03-10 08:30',
  },
  {
    id: '3',
    title: 'System Alert',
    message: 'New maintenance request for Room 101.',
    type: 'system',
    recipient: 'Admin',
    status: 'sent',
    createdAt: '2026-03-10 08:00',
  },
];

export default function NotificationListPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm">View and manage all system notifications</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Bell size={18} />
            Send Notification
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-bottom border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockNotifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {notification.type === 'email' && <Mail className="text-blue-500" size={20} />}
                    {notification.type === 'sms' && <MessageSquare className="text-green-500" size={20} />}
                    {notification.type === 'system' && <Bell className="text-amber-500" size={20} />}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{notification.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {notification.recipient}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                      notification.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {notification.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notification.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
