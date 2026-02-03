import React from 'react';
import { Calendar, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import StatusCard from '../components/StatusCard';
import { jobs } from '../data/jobs';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { JobStatusChart } from '../components/dashboard/JobStatusChart';
import { ServiceDistributionChart } from '../components/dashboard/ServiceDistributionChart';

function Dashboard() {
  // console.log('All env variables:', import.meta.env);
  // console.log('VITE_REDIRECT_URL:', import.meta.env.VITE_REDIRECT_URL ?? 'Not defined');

  if (process.env.NODE_ENV === 'production') {
    console.log('[Vercel Debug]', {
      env: import.meta.env.VITE_REDIRECT_URL,
      mode: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600">Overview of your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatusCard
          icon={<Calendar className="h-6 w-6 text-purple-600" />}
          title="Today's Jobs"
          value="6"
          trend="2 completed"
        />
        <StatusCard
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          title="Scheduled"
          value="12"
          trend="Next 7 days"
        />
        <StatusCard
          icon={<DollarSign className="h-6 w-6 text-blue-600" />}
          title="Revenue"
          value="$2,450"
          trend="+15% this week"
        />
        <StatusCard
          icon={<CheckCircle2 className="h-6 w-6 text-purple-600" />}
          title="Completion Rate"
          value="95%"
          trend="Last 30 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
          <div className="border-b border-purple-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Revenue Overview
            </h2>
            <p className="text-sm text-slate-500">Last 7 days vs projected</p>
          </div>
          <div className="p-6">
            <RevenueChart />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
          <div className="border-b border-purple-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Job Status Distribution
            </h2>
            <p className="text-sm text-slate-500">Current status of all jobs</p>
          </div>
          <div className="p-6">
            <JobStatusChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
          <div className="border-b border-purple-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Service Performance
            </h2>
            <p className="text-sm text-slate-500">
              Jobs and revenue by service type
            </p>
          </div>
          <div className="p-6">
            <ServiceDistributionChart />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
        <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
          <h2 className="text-lg font-semibold text-slate-800">
            Today's Service Jobs
          </h2>
        </div>
        <div className="divide-y divide-purple-100">
          {/* {jobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))} */}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
