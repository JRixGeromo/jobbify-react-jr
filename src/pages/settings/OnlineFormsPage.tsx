import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import {
  ArrowLeft,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Copy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoModeNotice } from '../../components/DemoModeNotice';

interface FormField {
  id: string;
  type:
    | 'text'
    | 'email'
    | 'phone'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio';
  label: string;
  required: boolean;
  options?: string[];
}

interface WebForm {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  submissions: number;
  conversionRate: number;
  active: boolean;
}

export default function OnlineFormsPage() {
  const [forms, setForms] = useState<WebForm[]>([
    {
      id: '1',
      name: 'Service Request Form',
      description: 'General service request form for customers',
      fields: [
        { id: '1', type: 'text', label: 'Full Name', required: true },
        { id: '2', type: 'email', label: 'Email Address', required: true },
        { id: '3', type: 'phone', label: 'Phone Number', required: true },
        {
          id: '4',
          type: 'select',
          label: 'Service Type',
          required: true,
          options: ['Plumbing', 'HVAC', 'Electrical'],
        },
        { id: '5', type: 'textarea', label: 'Service Details', required: true },
      ],
      submissions: 145,
      conversionRate: 65,
      active: true,
    },
    {
      id: '2',
      name: 'Quote Request Form',
      description: 'Quote request form for potential customers',
      fields: [
        { id: '1', type: 'text', label: 'Full Name', required: true },
        { id: '2', type: 'email', label: 'Email Address', required: true },
        { id: '3', type: 'phone', label: 'Phone Number', required: true },
        { id: '4', type: 'textarea', label: 'Project Details', required: true },
      ],
      submissions: 89,
      conversionRate: 45,
      active: true,
    },
  ]);

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
          <FileText className="h-6 w-6 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Online Forms</h1>
            <p className="text-slate-600">Create and manage web forms</p>
          </div>
        </div>
      </div>

      <DemoModeNotice feature="Online forms" />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-lg shadow-sm border border-purple-100"
            >
              <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-slate-800">
                      {form.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-slate-400 hover:text-purple-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-purple-600">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-600 mb-4">
                  {form.description}
                </p>

                <div className="space-y-4">
                  {form.fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between py-2 border-b border-slate-100"
                    >
                      <div>
                        <p className="font-medium text-slate-800">
                          {field.label}
                        </p>
                        <p className="text-sm text-slate-600">
                          Type: {field.type}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </p>
                      </div>
                      {field.options && (
                        <div className="text-sm text-slate-500">
                          {field.options.length} options
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={() => {
                        setForms(
                          forms.map((f) =>
                            f.id === form.id ? { ...f, active: !f.active } : f
                          )
                        );
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    <span className="ms-3 text-sm font-medium text-slate-700">
                      {form.active ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}

          <button className="w-full py-4 border-2 border-dashed border-purple-200 rounded-lg text-purple-600 hover:text-purple-700 hover:border-purple-300">
            <Plus className="h-5 w-5 mx-auto" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Form Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Form Statistics
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Total Submissions</p>
                <p className="text-2xl font-semibold text-slate-800">
                  {forms.reduce((sum, form) => sum + form.submissions, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">
                  Average Conversion Rate
                </p>
                <p className="text-2xl font-semibold text-slate-800">
                  {Math.round(
                    forms.reduce((sum, form) => sum + form.conversionRate, 0) /
                      forms.length
                  )}
                  %
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Active Forms</p>
                <p className="text-2xl font-semibold text-slate-800">
                  {forms.filter((form) => form.active).length}
                </p>
              </div>
            </div>
          </div>

          {/* Embed Code */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Embed Code
              </h3>
              <button className="text-purple-600 hover:text-purple-700">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <pre className="p-3 bg-slate-100 rounded-lg text-xs text-slate-600 overflow-auto">
              {`<script src="https://forms.servicepro.com/embed.js"></script>
<div id="form-container" data-form-id="your-form-id"></div>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
