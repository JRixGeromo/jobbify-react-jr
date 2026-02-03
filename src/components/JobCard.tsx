import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, ClipboardList } from 'lucide-react';

interface JobCardProps {
  id: string;
  client: string;
  service: string;
  address: string;
  time: string;
  price: string;
  status: string;
  statusColor: string;
  photo: string;
  notes: string;
}

function JobCard({
  id,
  client,
  service,
  address,
  time,
  price,
  status,
  statusColor,
  photo,
  notes,
}: JobCardProps) {
  return (
    <Link to={`/jobs/${id}`} className="block">
      <div className="p-6 hover:bg-emerald-50 transition-colors">
        <div className="flex items-start gap-4">
          <img
            src={photo}
            alt={`Job for ${client}`}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {client}
                </h3>
                <p className="text-emerald-600 font-medium">{service}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
              >
                {status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                {address}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="h-4 w-4 mr-2 text-slate-400" />
                {time}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <DollarSign className="h-4 w-4 mr-2 text-slate-400" />
                {price}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <ClipboardList className="h-4 w-4 mr-2 text-slate-400" />
                {notes}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default JobCard;
