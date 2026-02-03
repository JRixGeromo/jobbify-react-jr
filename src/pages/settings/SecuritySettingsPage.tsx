import React from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Shield, Key, Smartphone, History, AlertCircle } from 'lucide-react';

export default function SecuritySettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold text-slate-800 mt-4">
          Security Settings
        </h1>
        <p className="text-slate-600">
          Manage your account security and authentication
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Password Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-emerald-100">
            <div className="border-b border-emerald-100 px-6 py-4 bg-emerald-50">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Password
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                Update Password
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-lg shadow-sm border border-emerald-100">
            <div className="border-b border-emerald-100 px-6 py-4 bg-emerald-50">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Two-Factor Authentication
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-medium text-slate-800">
                    Authenticator App
                  </h3>
                  <p className="text-sm text-slate-600">
                    Use an authentication app to generate codes
                  </p>
                </div>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-800">
                    SMS Authentication
                  </h3>
                  <p className="text-sm text-slate-600">
                    Receive codes via text message
                  </p>
                </div>
                <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                  Configure
                </button>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-lg shadow-sm border border-emerald-100">
            <div className="border-b border-emerald-100 px-6 py-4 bg-emerald-50">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                  API Keys
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-800">
                      Production API Key
                    </h3>
                    <p className="text-sm text-slate-600">
                      Last used 2 hours ago
                    </p>
                  </div>
                  <button className="text-emerald-600 hover:text-emerald-700">
                    Regenerate
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-800">
                      Development API Key
                    </h3>
                    <p className="text-sm text-slate-600">
                      Last used 5 days ago
                    </p>
                  </div>
                  <button className="text-emerald-600 hover:text-emerald-700">
                    Regenerate
                  </button>
                </div>
                <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 w-full">
                  Generate New API Key
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Security Status */}
          <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Security Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-sm text-slate-600">
                  Password strength: Strong
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <p className="text-sm text-slate-600">2FA: Not enabled</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-sm text-slate-600">
                  Last login: 2 hours ago
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <History className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-800">Password changed</p>
                  <p className="text-xs text-slate-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-800">Failed login attempt</p>
                  <p className="text-xs text-slate-500">3 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-800">API key generated</p>
                  <p className="text-xs text-slate-500">1 week ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Devices */}
          <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Connected Devices
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      iPhone 12
                    </p>
                    <p className="text-xs text-slate-500">Last active: Now</p>
                  </div>
                </div>
                <button className="text-red-600 text-sm">Remove</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      MacBook Pro
                    </p>
                    <p className="text-xs text-slate-500">
                      Last active: 1 hour ago
                    </p>
                  </div>
                </div>
                <button className="text-red-600 text-sm">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
