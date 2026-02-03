import React from 'react';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BusinessHoursForm } from '../../../components/settings/BusinessHoursForm';
import { defaultBusinessHours } from '../../../data/business-hours';

export default function BusinessHoursPage() {
  const [hours, setHours] = React.useState(defaultBusinessHours);

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
          <Clock className="h-6 w-6 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Business Hours
            </h1>
            <p className="text-slate-600">
              Set your operating hours and availability
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-purple-100">
          <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
            <h2 className="text-lg font-semibold text-slate-800">
              Operating Hours
            </h2>
          </div>
          <div className="p-6">
            <BusinessHoursForm hours={hours} onChange={setHours} />
          </div>
        </div>
      </div>
    </div>
  );
}
