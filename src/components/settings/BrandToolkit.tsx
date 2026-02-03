import React from 'react';
import { Image, Upload, Palette, Eye } from 'lucide-react';

interface BrandToolkitProps {
  branding: {
    primaryColor: string;
    accentColor: string;
  };
  logo: string;
  onUpdate: (branding: { primaryColor: string; accentColor: string }) => void;
  onLogoUpdate: (logo: string) => void;
}

export function BrandToolkit({
  branding,
  logo,
  onUpdate,
  onLogoUpdate,
}: BrandToolkitProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-purple-100">
      <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-slate-800">
            Brand Toolkit
          </h2>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {/* Logo Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company Logo
            </label>
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                {logo ? (
                  <img
                    src={logo}
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image className="h-8 w-8 text-slate-400" />
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={logo}
                    onChange={(e) => onLogoUpdate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="https://"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Upload className="h-4 w-4" />
                  <span>Recommended size: 200x200px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Color Palette
            </label>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) =>
                      onUpdate({
                        ...branding,
                        primaryColor: e.target.value,
                      })
                    }
                    className="w-12 h-12 rounded border border-slate-300 p-1"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) =>
                      onUpdate({
                        ...branding,
                        primaryColor: e.target.value,
                      })
                    }
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) =>
                      onUpdate({
                        ...branding,
                        accentColor: e.target.value,
                      })
                    }
                    className="w-12 h-12 rounded border border-slate-300 p-1"
                  />
                  <input
                    type="text"
                    value={branding.accentColor}
                    onChange={(e) =>
                      onUpdate({
                        ...branding,
                        accentColor: e.target.value,
                      })
                    }
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Color Preview
            </label>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div
                  className="h-16 rounded-lg"
                  style={{ backgroundColor: branding.primaryColor }}
                ></div>
                <div className="grid grid-cols-4 gap-2">
                  {[0.8, 0.6, 0.4, 0.2].map((opacity) => (
                    <div
                      key={opacity}
                      className="h-8 rounded"
                      style={{
                        backgroundColor: branding.primaryColor,
                        opacity,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className="h-16 rounded-lg"
                  style={{ backgroundColor: branding.accentColor }}
                ></div>
                <div className="grid grid-cols-4 gap-2">
                  {[0.8, 0.6, 0.4, 0.2].map((opacity) => (
                    <div
                      key={opacity}
                      className="h-8 rounded"
                      style={{
                        backgroundColor: branding.accentColor,
                        opacity,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sample UI Elements */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sample UI Elements
            </label>
            <div className="p-4 bg-slate-50 rounded-lg space-y-4">
              <div className="flex items-center gap-4">
                <button
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: branding.accentColor }}
                >
                  Secondary Button
                </button>
              </div>
              <div
                className="px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: branding.primaryColor,
                  opacity: 0.1,
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: branding.primaryColor }}
                >
                  Alert Message
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: branding.primaryColor }}
                ></div>
                <span
                  className="text-sm font-medium"
                  style={{ color: branding.primaryColor }}
                >
                  Status Indicator
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
