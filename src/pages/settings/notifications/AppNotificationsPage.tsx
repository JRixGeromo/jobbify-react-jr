import React, { useState } from 'react';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { ArrowLeft, Bell, Plus, Trash2, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationSetting {
  id: string;
  type: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export default function AppNotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      type: 'New Job Assigned',
      description: 'When a new job is assigned to you',
      email: true,
      push: true,
      inApp: true,
    },
    {
      id: '2',
      type: 'Job Status Update',
      description: 'When a job status changes',
      email: true,
      push: true,
      inApp: true,
    },
    {
      id: '3',
      type: 'New Comment',
      description: 'When someone comments on your job',
      email: false,
      push: true,
      inApp: true,
    },
    {
      id: '4',
      type: 'Schedule Change',
      description: 'When your schedule is updated',
      email: true,
      push: true,
      inApp: true,
    },
  ]);

  const handleToggle = (id: string, field: 'email' | 'push' | 'inApp') => {
    setSettings(
      settings.map((setting) =>
        setting.id === id ? { ...setting, [field]: !setting[field] } : setting
      )
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/settings/notifications"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notifications
        </Link>
        <Breadcrumbs />
        <div className="mt-4 flex items-center gap-2">
          <Bell className="h-6 w-6 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              App Notifications
            </h1>
            <p className="text-slate-600">
              Manage your notification preferences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-purple-100">
          <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
            <h2 className="text-lg font-semibold text-slate-800">
              Notification Settings
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-start justify-between"
                >
                  <div>
                    <h3 className="font-medium text-slate-800">
                      {setting.type}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {setting.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={setting.email}
                        onChange={() => handleToggle(setting.id, 'email')}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-slate-600">Email</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={setting.push}
                        onChange={() => handleToggle(setting.id, 'push')}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-slate-600">Push</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={setting.inApp}
                        onChange={() => handleToggle(setting.id, 'inApp')}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-slate-600">In-App</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Push Notification Settings */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-purple-100">
          <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
            <h2 className="text-lg font-semibold text-slate-800">
              Push Notification Settings
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Browser Notifications
                </label>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Enable Browser Notifications
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mobile Push Notifications
                </label>
                <p className="text-sm text-slate-600">
                  Download our mobile app to receive push notifications on your
                  phone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-purple-100">
          <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
            <h2 className="text-lg font-semibold text-slate-800">
              Quiet Hours
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Enable Quiet Hours
                  </label>
                  <p className="text-sm text-slate-600">
                    Disable notifications during specific hours
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    defaultValue="22:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    defaultValue="07:00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
