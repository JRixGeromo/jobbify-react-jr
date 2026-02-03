import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ArrowLeft, Palette, Image, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandToolkit } from '../../components/settings/BrandToolkit';
import { defaultCompanyProfile } from '../../data/company-profile';

export default function AppearanceSettingsPage() {
  const [brandSettings, setBrandSettings] = useState(
    defaultCompanyProfile.branding
  );
  const [logo, setLogo] = useState(defaultCompanyProfile.logo);
  const [theme, setTheme] = useState(() => {
    // Load initial theme from localStorage or default to 'light'
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Apply the theme class to the HTML element
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('system', theme === 'system');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
  };

  const handleBrandingUpdate = (newBranding: typeof brandSettings) => {
    setBrandSettings(newBranding);
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
          <Palette className="h-6 w-6 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Appearance</h1>
            <p className="text-slate-600">
              Customize your brand's look and feel
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BrandToolkit
            branding={brandSettings}
            logo={logo}
            onUpdate={handleBrandingUpdate}
            onLogoUpdate={setLogo}
          />

          {/* Theme Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100">
            <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Theme Settings
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Theme Mode
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={theme}
                    onChange={handleThemeChange}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Font Family
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="inter">Inter</option>
                    <option value="roboto">Roboto</option>
                    <option value="opensans">Open Sans</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Border Radius
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="none">None</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Email Templates */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100">
            <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Email Templates
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                  <p className="font-medium text-slate-800">Invoice Template</p>
                  <p className="text-sm text-slate-600">
                    Customize invoice email template
                  </p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                  <p className="font-medium text-slate-800">Quote Template</p>
                  <p className="text-sm text-slate-600">
                    Customize quote email template
                  </p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                  <p className="font-medium text-slate-800">
                    Reminder Template
                  </p>
                  <p className="text-sm text-slate-600">
                    Customize reminder email template
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Preview
            </h3>
            <div className="space-y-4">
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                <Image className="h-8 w-8 text-slate-400" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                <p className="font-medium text-slate-800">Reset to Defaults</p>
                <p className="text-sm text-slate-600">
                  Restore default appearance settings
                </p>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                <p className="font-medium text-slate-800">Import Theme</p>
                <p className="text-sm text-slate-600">
                  Import a theme configuration
                </p>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                <p className="font-medium text-slate-800">Export Theme</p>
                <p className="text-sm text-slate-600">
                  Export current theme settings
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
