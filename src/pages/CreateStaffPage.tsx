import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Staff } from '../data/staff';
import { StaffForm } from '../components/staff/StaffForm';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArrowLeft, UserPlus, Calendar, FileText } from 'lucide-react';

export default function CreateStaffPage() {
  const navigate = useNavigate();

  const handleSubmit = (data: Partial<Staff>) => {
    // Handle staff creation
    navigate('/staff');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/staff')}
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Staff
            </button>
            <Breadcrumbs />
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Send Invitation
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-6">
              <StaffForm
                onSubmit={handleSubmit}
                onCancel={() => navigate('/staff')}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                  <p className="font-medium text-slate-800">Save as Draft</p>
                  <p className="text-sm text-slate-600">
                    Continue editing later
                  </p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                  <p className="font-medium text-slate-800">
                    Schedule Training
                  </p>
                  <p className="text-sm text-slate-600">
                    Set up onboarding sessions
                  </p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                  <p className="font-medium text-slate-800">Assign Equipment</p>
                  <p className="text-sm text-slate-600">Manage work tools</p>
                </button>
              </div>
            </div>

            {/* Schedule Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Schedule Overview
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-slate-800">
                        View Calendar
                      </p>
                      <p className="text-sm text-slate-600">
                        Check availability
                      </p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-slate-800">
                        Job Assignments
                      </p>
                      <p className="text-sm text-slate-600">Manage workload</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Required Documents
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-800">
                      ID Verification
                    </p>
                    <p className="text-sm text-slate-600">
                      Government issued ID
                    </p>
                  </div>
                  <span className="text-amber-600 text-sm">Required</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-800">Certifications</p>
                    <p className="text-sm text-slate-600">
                      Professional qualifications
                    </p>
                  </div>
                  <span className="text-amber-600 text-sm">Required</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-800">Insurance</p>
                    <p className="text-sm text-slate-600">Liability coverage</p>
                  </div>
                  <span className="text-amber-600 text-sm">Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
