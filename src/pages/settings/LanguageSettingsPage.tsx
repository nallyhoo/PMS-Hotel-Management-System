import React, { useState } from 'react';
import { Languages, Plus, Trash2, Check, Globe, AlertCircle } from 'lucide-react';

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

const initialLanguages: Language[] = [
  { id: '1', code: 'en', name: 'English', nativeName: 'English', isDefault: true, status: 'active' },
  { id: '2', code: 'fr', name: 'French', nativeName: 'Français', isDefault: false, status: 'active' },
  { id: '3', code: 'es', name: 'Spanish', nativeName: 'Español', isDefault: false, status: 'active' },
  { id: '4', code: 'de', name: 'German', nativeName: 'Deutsch', isDefault: false, status: 'inactive' },
];

export default function LanguageSettingsPage() {
  const [languages, setLanguages] = useState(initialLanguages);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Language Settings</h1>
          <p className="text-gray-500 text-sm">Manage system languages and translations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} />
          Add Language
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Language</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {languages.map((lang) => (
                  <tr key={lang.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {lang.name}
                          {lang.isDefault && (
                            <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase">Default</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{lang.nativeName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono uppercase">{lang.code}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        lang.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {lang.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {!lang.isDefault && (
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
              Localization
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default System Language</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                  <option>English (US)</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Auto-detect Language</p>
                  <p className="text-xs text-gray-500">Based on guest's browser</p>
                </div>
                <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out bg-indigo-600 rounded-full cursor-pointer">
                  <div className="absolute right-0 w-5 h-5 transition duration-200 ease-in-out transform bg-white border border-indigo-600 rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex gap-3">
              <AlertCircle className="text-blue-600 shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-blue-900">Translation Status</h4>
                <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                  System is 100% translated for English. French and Spanish are at 85% completion.
                </p>
                <button className="mt-2 text-xs font-bold text-blue-700 hover:underline">Manage Translations</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
