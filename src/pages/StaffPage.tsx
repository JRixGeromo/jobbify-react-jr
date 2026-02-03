import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, DollarSign, Award } from 'lucide-react';
import { staff as initialStaff } from '../data/staff';
import { Breadcrumbs } from '../components/Breadcrumbs';

export default function StaffPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs />
        <div className="mt-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Staff Management
            </h1>
            <p className="text-slate-600">
              Manage team members and their schedules
            </p>
          </div>
          <button
            onClick={() => navigate('/staff/new')}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Staff Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialStaff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg shadow-sm border border-emerald-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/staff/${member.id}/edit`)}
          >
            <div className="flex items-center">
              <img
                src={member.photo}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <h3 className="font-semibold text-slate-800">{member.name}</h3>
                <p className="text-sm text-emerald-600">{member.role}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="h-4 w-4 mr-2" />
                {member.workingHours[0].shifts[0].start} -{' '}
                {member.workingHours[0].shifts[0].end}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <DollarSign className="h-4 w-4 mr-2" />${member.chargeOutRate}
                /hour
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Award className="h-4 w-4 mr-2" />
                {member.skills.join(', ')}
              </div>
            </div>

            <div className="mt-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  member.status === 'Available'
                    ? 'bg-emerald-100 text-emerald-800'
                    : member.status === 'On Job'
                      ? 'bg-amber-100 text-amber-800'
                      : member.status === 'On Leave'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-800'
                }`}
              >
                {member.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
