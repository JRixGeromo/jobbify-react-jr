import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  Wrench,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Clock,
  Package,
  Globe,
  Percent,
  Phone,
  CheckSquare,
  Settings,
  Activity,
  Receipt,
  CreditCard,
} from 'lucide-react';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const reports: ReportCard[] = [
  {
    id: 'jobs',
    title: 'Jobs',
    description: 'Job performance and completion metrics',
    icon: <Wrench className="h-6 w-6" />,
    color: 'bg-purple-500',
  },
  {
    id: 'sales',
    title: 'Sales',
    description: 'Revenue and sales performance',
    icon: <DollarSign className="h-6 w-6" />,
    color: 'bg-blue-500',
  },
  {
    id: 'job-statistics',
    title: 'Job Statistics',
    description: 'Detailed job analytics and trends',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'bg-emerald-500',
  },
  {
    id: 'leads',
    title: 'Leads Report',
    description: 'Lead generation and conversion tracking',
    icon: <Users className="h-6 w-6" />,
    color: 'bg-amber-500',
  },
  {
    id: 'estimates',
    title: 'Estimates',
    description: 'Estimate creation and conversion rates',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-red-500',
  },
  {
    id: 'timesheets',
    title: 'Timesheets',
    description: 'Staff hours and productivity analysis',
    icon: <Clock className="h-6 w-6" />,
    color: 'bg-indigo-500',
  },
  {
    id: 'items-services',
    title: 'Items and Services',
    description: 'Product and service performance metrics',
    icon: <Package className="h-6 w-6" />,
    color: 'bg-cyan-500',
  },
  {
    id: 'website-requests',
    title: 'Website Requests',
    description: 'Online form submissions and inquiries',
    icon: <Globe className="h-6 w-6" />,
    color: 'bg-teal-500',
  },
  {
    id: 'tax',
    title: 'Tax',
    description: 'Tax calculations and summaries',
    icon: <Percent className="h-6 w-6" />,
    color: 'bg-rose-500',
  },
  {
    id: 'call-tracking',
    title: 'Call Tracking',
    description: 'Phone call analytics and metrics',
    icon: <Phone className="h-6 w-6" />,
    color: 'bg-fuchsia-500',
  },
  {
    id: 'tasks',
    title: 'Tasks',
    description: 'Task completion and efficiency metrics',
    icon: <CheckSquare className="h-6 w-6" />,
    color: 'bg-lime-500',
  },
  {
    id: 'equipment',
    title: 'Equipment',
    description: 'Equipment usage and maintenance tracking',
    icon: <Settings className="h-6 w-6" />,
    color: 'bg-amber-500',
  },
  {
    id: 'activity',
    title: 'Activity',
    description: 'System-wide activity monitoring',
    icon: <Activity className="h-6 w-6" />,
    color: 'bg-violet-500',
  },
  {
    id: 'invoices',
    title: 'Invoices',
    description: 'Invoice status and payment tracking',
    icon: <Receipt className="h-6 w-6" />,
    color: 'bg-sky-500',
  },
  {
    id: 'payments',
    title: 'Payments',
    description: 'Payment processing and reconciliation',
    icon: <CreditCard className="h-6 w-6" />,
    color: 'bg-emerald-500',
  },
];

export default function ReportsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs />
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
          <p className="text-slate-600">
            View and analyze business performance metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => navigate(`/reports/${report.id}`)}
            className="bg-white rounded-lg shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${report.color} bg-opacity-10`}>
                {React.cloneElement(report.icon as React.ReactElement, {
                  className: `h-6 w-6 ${report.color.replace('bg-', 'text-')}`,
                })}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{report.title}</h3>
                <p className="text-sm text-slate-600">{report.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
