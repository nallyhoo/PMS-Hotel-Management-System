import React, { useState } from 'react';
import { CreditCard, Shield, Settings, ExternalLink, Save, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Gateway {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'not_connected';
  description: string;
}

const gateways: Gateway[] = [
  { id: 'stripe', name: 'Stripe', logo: 'https://picsum.photos/seed/stripe/100/100', status: 'connected', description: 'Accept credit cards and digital wallets globally.' },
  { id: 'paypal', name: 'PayPal', logo: 'https://picsum.photos/seed/paypal/100/100', status: 'not_connected', description: 'Allow guests to pay with their PayPal accounts.' },
  { id: 'square', name: 'Square', logo: 'https://picsum.photos/seed/square/100/100', status: 'not_connected', description: 'Integrated payment processing for in-person and online.' },
];

export default function PaymentGatewaySettingsPage() {
  const [selectedGateway, setSelectedGateway] = useState<string | null>('stripe');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment Gateways</h1>
        <p className="text-gray-500 text-sm">Connect and manage your payment processing services</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Available Gateways</h2>
          {gateways.map((gw) => (
            <button
              key={gw.id}
              onClick={() => setSelectedGateway(gw.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                selectedGateway === gw.id
                  ? 'bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={gw.logo} alt={gw.name} className="w-10 h-10 rounded-lg object-cover grayscale opacity-80" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{gw.name}</span>
                  {gw.status === 'connected' && <CheckCircle2 size={16} className="text-green-500" />}
                </div>
                <p className="text-xs text-gray-500 mt-1">{gw.status === 'connected' ? 'Connected' : 'Not Connected'}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedGateway ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                    {selectedGateway.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 capitalize">{selectedGateway} Configuration</h2>
                    <p className="text-sm text-gray-500">Configure your {selectedGateway} API keys and preferences</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                    Disconnect
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <Save size={18} />
                    Save
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Public Key / Client ID</label>
                    <input
                      type="password"
                      defaultValue="pk_test_************************"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                    <input
                      type="password"
                      defaultValue="sk_test_************************"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
                    <input
                      type="password"
                      defaultValue="whsec_************************"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Settings size={18} className="text-indigo-600" />
                    Gateway Options
                  </h3>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Test Mode</p>
                      <p className="text-xs text-gray-500">Enable sandbox environment for testing</p>
                    </div>
                    <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out bg-indigo-600 rounded-full cursor-pointer">
                      <div className="absolute right-0 w-5 h-5 transition duration-200 ease-in-out transform bg-white border border-indigo-600 rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Automatic Capture</p>
                      <p className="text-xs text-gray-500">Capture payments immediately after authorization</p>
                    </div>
                    <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out bg-gray-200 rounded-full cursor-pointer">
                      <div className="absolute left-0 w-5 h-5 transition duration-200 ease-in-out transform bg-white border border-gray-200 rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                  <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Ensure your Webhook URL is correctly configured in your {selectedGateway} dashboard to receive payment status updates.
                    <br />
                    <span className="font-bold">Webhook URL:</span> https://api.grandview.com/webhooks/{selectedGateway}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
              <CreditCard size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Select a Gateway</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">
                Choose a payment gateway from the list to configure its settings and connect it to your hotel.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
