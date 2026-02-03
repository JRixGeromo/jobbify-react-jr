import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  Building2,
  Mail,
  Bell,
  Shield,
  CreditCard,
  Users,
  Palette,
  Globe,
  UserCog,
  Calendar,
  FileText,
  Package,
  Bot,
  Zap,
  AppWindow,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const settings = [
    {
      category: 'Price Book',
      icon: <Package className="h-5 w-5" />,
      items: [
        {
          name: 'Services',
          description: 'Manage service offerings',
          link: '/services',
        },
        {
          name: 'Products',
          description: 'Manage product catalog',
          link: '/services?type=product',
        },
        {
          name: 'Materials',
          description: 'Manage materials inventory',
          link: '/services?type=material',
        },
      ],
    },
    {
      category: 'Company',
      icon: <Building2 className="h-5 w-5" />,
      items: [
        {
          name: 'Company Profile',
          description: 'Update your company information',
          link: '/settings/company/profile',
        },
        {
          name: 'Business Hours',
          description: 'Set your operating hours',
          link: '/settings/company/hours',
        },
        {
          name: 'Locations',
          description: 'Manage service locations',
          link: '/settings/company/locations',
        },
      ],
    },
    {
      category: 'Online Presence',
      icon: <Globe className="h-5 w-5" />,
      items: [
        {
          name: 'Online Booking',
          description: 'Configure booking availability',
          link: '/settings/online-booking',
        },
        {
          name: 'Online Forms',
          description: 'Create and manage web forms',
          link: '/settings/online-forms',
        },
        {
          name: 'Website Integration',
          description: 'Add booking to your website',
          link: '/settings/website-integration',
        },
      ],
    },
    {
      category: 'Staff',
      icon: <UserCog className="h-5 w-5" />,
      items: [
        {
          name: 'Staff Management',
          description: 'Manage team members',
          link: '/staff',
        },
        {
          name: 'Roles & Permissions',
          description: 'Configure access levels',
          link: '/settings/staff/roles',
        },
        {
          name: 'Scheduling',
          description: 'Staff availability and shifts',
          link: '/settings/staff/scheduling',
        },
      ],
    },
    {
      category: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      items: [
        {
          name: 'Email Notifications',
          description: 'Configure email alerts',
          link: '/settings/notifications/email',
        },
        {
          name: 'SMS Notifications',
          description: 'Configure SMS alerts',
          link: '/settings/notifications/sms',
        },
        {
          name: 'In-App Notifications',
          description: 'Manage app notifications',
          link: '/settings/notifications/app',
        },
      ],
    },
    {
      category: 'Security',
      icon: <Shield className="h-5 w-5" />,
      items: [
        {
          name: 'Password',
          description: 'Update your password',
          link: '/settings/security',
        },
        {
          name: 'Two-Factor Auth',
          description: 'Enable 2FA security',
          link: '/settings/security/2fa',
        },
        {
          name: 'API Keys',
          description: 'Manage API access',
          link: '/settings/security/api',
        },
      ],
    },
    {
      category: 'Billing',
      icon: <CreditCard className="h-5 w-5" />,
      items: [
        {
          name: 'Subscription Management',
          description: 'Manage your subscription and billing details',
          link: '/settings/billing/subscription',
        },
        {
          name: 'Payment Methods',
          description: 'Update payment details',
          link: '/settings/billing/payment',
        },
        {
          name: 'Billing History',
          description: 'View past invoices',
          link: '/settings/billing/history',
        },
      ],
    },
    {
      category: 'Team',
      icon: <Users className="h-5 w-5" />,
      items: [
        {
          name: 'Roles & Permissions',
          description: 'Manage access levels',
          link: '/settings/team/roles',
        },
        {
          name: 'Invitations',
          description: 'Invite team members',
          link: '/settings/team/invites',
        },
        {
          name: 'Activity Log',
          description: 'View team activity',
          link: '/settings/team/activity',
        },
      ],
    },
    {
      category: 'Appearance',
      icon: <Palette className="h-5 w-5" />,
      items: [
        {
          name: 'Theme',
          description: 'Customize the look and feel',
          link: '/settings/appearance',
        },
        {
          name: 'Branding',
          description: 'Update logos and colors',
          link: '/settings/appearance/branding',
        },
        {
          name: 'Email Templates',
          description: 'Customize email designs',
          link: '/settings/appearance/email-templates',
        },
      ],
    },
    {
      category: 'Integrations',
      icon: <AppWindow className="h-5 w-5" />,
      items: [
        {
          name: 'AI',
          description: 'Configure AI assistants and tools',
          link: '/settings/integrations/ai',
        },
        {
          name: 'Automations',
          description: 'Set up workflow automations',
          link: '/settings/integrations/automations',
        },
        {
          name: 'App Store',
          description: 'Browse and install integrations',
          link: '/settings/integrations/apps',
        },
      ],
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold text-slate-800 mt-4">Settings</h1>
        <p className="text-slate-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((section) => (
          <div
            key={section.category}
            className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden"
          >
            <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
              <div className="flex items-center gap-2">
                <span className="text-purple-600">{section.icon}</span>
                <h2 className="text-lg font-semibold text-slate-800">
                  {section.category}
                </h2>
              </div>
            </div>
            <div className="divide-y divide-purple-100">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  className="block px-6 py-4 hover:bg-purple-50 transition-colors"
                >
                  <h3 className="font-medium text-slate-800">{item.name}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
