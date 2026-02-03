import React from 'react';
import { Job } from '../../data/jobs';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { JobNew } from '@/types/jobs';

interface JobTimelineProps {
  jobs: JobNew[];
}

export function JobTimeline({ jobs }: JobTimelineProps) {
  const sortedJobs = [...jobs].sort((a, b) => {
    // const dateA = new Date(`${a.schedule_date} ${a.schedule_time}`);
    const dateA = new Date(`${a.schedule_date}`);
    const dateB = new Date(`${b.schedule_date}`);
    // const dateB = new Date(`${b.schedule_date} ${b.schedule_time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const groupedJobs = sortedJobs.reduce(
    (groups, job) => {
      const date = job.schedule_date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(job);
      return groups;
    },
    {} as Record<string, JobNew[]>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-emerald-100 overflow-hidden">
      {Object.entries(groupedJobs).map(([date, dateJobs]) => (
        <div key={date}>
          <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100">
            <h3 className="text-sm font-medium text-slate-600">{date}</h3>
          </div>
          <div className="relative">
            {dateJobs.map((job, index) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="block relative pl-8 pr-6 py-6 hover:bg-emerald-50 transition-colors"
              >
                <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  {index < dateJobs.length - 1 && (
                    <div className="absolute top-6 bottom-0 w-0.5 bg-emerald-100" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800">
                      {job.services.name}
                    </h4>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {/* {job.schedule_time} */}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {job.price}
                      </div>
                    </div>
                  </div>
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
