import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  Globe,
  Upload,
  Receipt,
  FileText,
  Mail,
  Phone,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BusinessHoursForm } from '../../components/settings/BusinessHoursForm';
import { defaultBusinessHours } from '../../data/business-hours';
import { defaultCompanyProfile } from '../../data/company-profile';
import { BrandToolkit } from '../../components/settings/BrandToolkit';

export default function CompanySettingsPage() {
  const [businessHours, setBusinessHours] = useState(defaultBusinessHours);
  const [brandSettings, setBrandSettings] = useState(
    defaultCompanyProfile.branding
  );
  const [logo, setLogo] = useState(defaultCompanyProfile.logo);

  const handleBrandingUpdate = (newBranding: typeof brandSettings) => {
    setBrandSettings(newBranding);
    // Here you would typically save to your backend
    alert('Brand settings updated successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/settings"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Link>
        <Breadcrumbs />
        <div className="mt-4 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Company Settings
            </h1>
            <p className="text-slate-600">
              Manage your company information and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Company Profile Link */}
          <Link
            to="/settings/company/profile"
            className="block bg-white rounded-lg shadow-sm border border-purple-100 hover:border-purple-200 transition-colors"
          >
            <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Company Profile
                  </h2>
                </div>
                <span className="text-sm text-purple-600">Edit →</span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Company Name</p>
                  <p className="font-medium text-slate-800">
                    {defaultCompanyProfile.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium text-slate-800">
                    {defaultCompanyProfile.email}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Brand Toolkit */}
          <BrandToolkit
            branding={brandSettings}
            logo={logo}
            onUpdate={handleBrandingUpdate}
            onLogoUpdate={setLogo}
          />

          {/* Business Hours */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100">
            <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Business Hours
                </h2>
              </div>
            </div>
            <div className="p-6">
              <BusinessHoursForm
                hours={businessHours}
                onChange={setBusinessHours}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/settings/company/profile"
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-purple-50"
              >
                <p className="font-medium text-slate-800">Edit Profile</p>
                <p className="text-sm text-slate-600">
                  Update company information
                </p>
              </Link>
              <Link
                to="/settings/appearance"
                className="block w-full text-left px-4 py-3 rounded-lg hover:bg-purple-50"
              >
                <p className="font-medium text-slate-800">
                  Customize Appearance
                </p>
                <p className="text-sm text-slate-600">
                  Manage branding and theme
                </p>
              </Link>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-50">
                <p className="font-medium text-slate-800">Export Settings</p>
                <p className="text-sm text-slate-600">Download configuration</p>
              </button>
            </div>
          </div>

          {/* Settings Status */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Settings Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <p className="text-sm text-slate-600">Profile Complete</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <p className="text-sm text-slate-600">Business Hours Set</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <p className="text-sm text-slate-600">Branding Configured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
