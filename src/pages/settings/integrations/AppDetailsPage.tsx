import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import {
  ArrowLeft,
  Globe,
  Download,
  Trash2,
  ExternalLink,
  Star,
  Check,
  Shield,
  Users,
  Clock,
} from 'lucide-react';

interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  category:
    | 'Accounting'
    | 'Marketing'
    | 'Automation'
    | 'Add-ons'
    | 'Communication';
  price: string;
  installed?: boolean;
  featured?: boolean;
  popular?: boolean;
  rating?: number;
  reviews?: number;
  publisher: string;
  website?: string;
  longDescription?: string;
}

const apps: App[] = [
  {
    id: 'xero',
    name: 'Xero',
    description:
      'Sync invoices, payments, and financial data with Xero accounting software.',
    longDescription: `Xero is beautiful online accounting software designed specifically for small businesses. Connect your bank accounts, reconcile transactions, send invoices, and get paid faster. With Xero's integration, you can:

    • Automatically sync invoices and payments
    • Reconcile transactions in real-time
    • Track expenses and bills
    • Generate financial reports
    • Manage payroll
    • Handle multi-currency transactions`,
    icon: 'https://logo.clearbit.com/xero.com',
    category: 'Accounting',
    price: 'Free',
    rating: 4.8,
    reviews: 256,
    publisher: 'Xero Ltd',
    popular: true,
    website: 'https://xero.com',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description:
      'Seamlessly integrate with QuickBooks for complete financial management.',
    longDescription: `QuickBooks integration provides comprehensive financial management capabilities for your business. Key features include:

    • Real-time financial data synchronization
    • Automated bookkeeping
    • Expense tracking
    • Invoice management
    • Tax preparation
    • Financial reporting and analytics`,
    icon: 'https://logo.clearbit.com/quickbooks.com',
    category: 'Accounting',
    price: 'Free',
    installed: true,
    rating: 4.7,
    reviews: 312,
    publisher: 'Intuit',
    popular: true,
    website: 'https://quickbooks.intuit.com',
  },
  // ... other apps
];

export default function AppDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = apps.find((a) => a.id === id);

  if (!app) {
    return <div>App not found</div>;
  }

  const handleInstallToggle = () => {
    // In a real app, this would make an API call to install/uninstall
    alert(
      app.installed
        ? 'App uninstalled successfully!'
        : 'App installed successfully!'
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/settings/integrations/apps"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to App Store
        </Link>
        <Breadcrumbs />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* App Header */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <div className="flex items-start gap-6">
              <img
                src={app.icon}
                alt={app.name}
                className="w-20 h-20 rounded-lg"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                      {app.name}
                    </h1>
                    <p className="text-purple-600">{app.publisher}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400 fill-current" />
                    <span className="font-medium text-slate-800">
                      {app.rating}
                    </span>
                    <span className="text-slate-500">
                      ({app.reviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={handleInstallToggle}
                    className={`inline-flex items-center px-4 py-2 rounded-lg ${
                      app.installed
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {app.installed ? (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Uninstall
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Install
                      </>
                    )}
                  </button>
                  {app.website && (
                    <a
                      href={app.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-purple-600 hover:text-purple-700"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              About {app.name}
            </h2>
            <div className="prose max-w-none">
              {app.longDescription?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-slate-600">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Category</p>
                <p className="font-medium text-slate-800">{app.category}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Price</p>
                <p className="font-medium text-slate-800">{app.price}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      app.installed ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <p className="font-medium text-slate-800">
                    {app.installed ? 'Installed' : 'Not Installed'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Key Features
            </h3>
            <div className="space-y-3">
              {app.longDescription
                ?.split('•')
                .slice(1)
                .map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{feature.trim()}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
