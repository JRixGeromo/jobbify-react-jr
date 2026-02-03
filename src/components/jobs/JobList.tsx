import React from 'react';
import { Job } from '../../data/jobs';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JobNew } from '@/types/jobs';

interface JobListProps {
  jobs: JobNew[];
}

export function JobList({ jobs }: JobListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-emerald-100 overflow-hidden">
      <table className="min-w-full divide-y divide-emerald-100">
        <thead className="bg-emerald-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-emerald-100">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-emerald-50">
              <td className="px-6 py-4">
                <Link
                  to={`/jobs/${job.id}`}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  {job.services.name}
                </Link>
              </td>
              <td className="px-6 py-4 text-slate-600">{job.clients.id}</td>
              <td className="px-6 py-4">
                <div className="flex items-center text-slate-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {/* {job.schedule_date} {job.schedule_time} */}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-slate-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {job.location}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-slate-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {job.price}
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.statuses.title === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : job.statuses.title === 'In Progress'
                        ? 'bg-amber-100 text-amber-800'
                        : job.statuses.title === 'On Hold'
                          ? 'bg-purple-100 text-purple-800'
                          : job.statuses.title === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {job.statuses.title}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
