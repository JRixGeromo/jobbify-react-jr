import React, { useState } from 'react';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import {
  ArrowLeft,
  Zap,
  Plus,
  Play,
  Pause,
  Settings,
  Clock,
  DollarSign,
  Mail,
  Bell,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  active: boolean;
  lastRun?: string;
  icon: React.ReactNode;
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: '1',
      name: 'Late Payment Reminder',
      description: 'Automatically send reminders for overdue invoices',
      trigger: 'Invoice overdue by 3 days',
      actions: [
        'Send email reminder to client',
        'Create follow-up task',
        'Add note to client record',
      ],
      active: true,
      lastRun: '2 hours ago',
      icon: <DollarSign className="h-5 w-5 text-purple-600" />,
    },
    {
      id: '2',
      name: 'Job Status Updates',
      description: 'Notify clients when job status changes',
      trigger: 'Job status changes',
      actions: ['Send client notification', 'Update calendar', 'Log activity'],
      active: true,
      lastRun: '1 hour ago',
      icon: <Bell className="h-5 w-5 text-purple-600" />,
    },
    {
      id: '3',
      name: 'Appointment Reminders',
      description: 'Send reminders before scheduled appointments',
      trigger: '24 hours before appointment',
      actions: [
        'Send SMS reminder',
        'Send email reminder',
        'Update staff schedule',
      ],
      active: true,
      lastRun: '30 minutes ago',
      icon: <Calendar className="h-5 w-5 text-purple-600" />,
    },
    {
      id: '4',
      name: 'Quote Follow-up',
      description: 'Follow up on sent quotes',
      trigger: 'Quote sent 48 hours ago',
      actions: [
        'Send follow-up email',
        'Create reminder task',
        'Update quote status',
      ],
      active: false,
      lastRun: '1 day ago',
      icon: <MessageSquare className="h-5 w-5 text-purple-600" />,
    },
  ]);

  const [showNewAutomation, setShowNewAutomation] = useState(false);

  const toggleAutomation = (id: string) => {
    setAutomations(
      automations.map((automation) =>
        automation.id === id
          ? { ...automation, active: !automation.active }
          : automation
      )
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/settings/integrations"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Integrations
        </Link>
        <Breadcrumbs />
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Workflow Automations
              </h1>
              <p className="text-slate-600">Automate your business processes</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewAutomation(true)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Automation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Automations */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100">
            <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
              <h2 className="text-lg font-semibold text-slate-800">
                Active Automations
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {automations.map((automation) => (
                <div
                  key={automation.id}
                  className="flex items-start justify-between border-b border-purple-100 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      {automation.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">
                        {automation.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        {automation.description}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            Trigger: {automation.trigger}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {automation.actions.map((action, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div className="w-4 h-4 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                              </div>
                              <span className="text-sm text-slate-600">
                                {action}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {automation.lastRun && (
                        <p className="text-sm text-slate-500">
                          Last run: {automation.lastRun}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {}}
                        className="p-1 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleAutomation(automation.id)}
                        className={`p-1 rounded-lg ${
                          automation.active
                            ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                            : 'text-slate-400 hover:text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {automation.active ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Automation Stats
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Active Automations</p>
                <p className="text-2xl font-semibold text-slate-800">
                  {automations.filter((a) => a.active).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Runs (24h)</p>
                <p className="text-2xl font-semibold text-slate-800">147</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Success Rate</p>
                <p className="text-2xl font-semibold text-emerald-600">98.2%</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                <div>
                  <p className="text-sm text-slate-800">
                    Payment reminder sent
                  </p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                <div>
                  <p className="text-sm text-slate-800">Job status updated</p>
                  <p className="text-xs text-slate-500">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <div>
                  <p className="text-sm text-slate-800">
                    SMS notification failed
                  </p>
                  <p className="text-xs text-slate-500">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Automation Modal */}
      {showNewAutomation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
              <h2 className="text-lg font-semibold text-slate-800">
                Create New Automation
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="Automation name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    rows={3}
                    placeholder="Describe what this automation does"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Trigger
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option>Select a trigger</option>
                    <option>Invoice becomes overdue</option>
                    <option>Job status changes</option>
                    <option>New quote created</option>
                    <option>Appointment scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Actions
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <select className="flex-1 rounded-lg border border-slate-300 px-3 py-2">
                        <option>Select an action</option>
                        <option>Send email</option>
                        <option>Send SMS</option>
                        <option>Create task</option>
                        <option>Update record</option>
                      </select>
                      <button className="p-2 text-purple-600 hover:text-purple-700">
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowNewAutomation(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowNewAutomation(false)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create Automation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
