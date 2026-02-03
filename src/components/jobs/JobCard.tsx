import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  DollarSign,
  ClipboardList,
  Repeat,
  Trash2,
  Edit2,
} from 'lucide-react';
import {
  getStatusColor,
  getRecurringColor,
  getStatusColorNew,
  getRecurringColor2,
} from '../../data/jobs';
import { JobStatus } from '@/types/jobs';
import { supabaseStorageURL as STORAGE_URL } from '@/lib/supabase';
import { DeleteJobButton } from '@/components/jobs/DeleteJobButton';
import '../../styles/responsive.css';

interface Service {
  name: string;
  price?: number;
}

interface Status {
  title: JobStatus;
}

interface JobCardProps {
  id: string;
  location: string;
  notes: string;
  recurringSchedule: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  imagePath: string;
  serviceName: string;
  statusName: string;
  price: number;
  refetchJobs?: () => void;
}

function JobCard({
  id,
  location,
  notes,
  recurringSchedule,
  scheduleDate,
  startTime,
  endTime,
  imagePath,
  serviceName,
  statusName,
  price,
  refetchJobs,
}: JobCardProps) {
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [notesInput, setNotesInput] = useState(notes);

  const recurringColor = getRecurringColor2(recurringSchedule) || 'bg-gray-200';
  const statusColor = getStatusColorNew(statusName) || 'bg-gray-200';
  const recurringLabel =
    recurringSchedule === 'one-time'
      ? 'One-time'
      : recurringSchedule.charAt(0).toUpperCase() + recurringSchedule.slice(1);

  const handleValidation = () => {
    if (!location) {
      setIsAddressValid(false);
    } else {
      setIsAddressValid(true);
    }
  };

  const handleRefresh = async () => {
    if (refetchJobs) {
      try {
        await refetchJobs(); // Call the refetch function
      } catch (error) {}
    }
  };

  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesInput(e.target.value);
  }, []);

  return (
    <div
      className="block cursor-pointer"
      onClick={(e) => {
        handleValidation();
        if (isAddressValid) {
          window.location.href = `/jobs/edit/${id}`;
        }
      }}
    >
      <div className="p-6 hover:bg-emerald-50 transition-colors relative">
        <div className="flex items-start gap-4">
          {imagePath ? (
            <img
              src={STORAGE_URL + '/' + imagePath}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              alt={serviceName || 'Service Image'}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  '/path/to/fallback-image.jpg'; // Replace with your fallback image path
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-sm text-gray-500">
              No Image
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-emerald-600 font-medium">{serviceName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${recurringColor}`}
                >
                  <Repeat className="h-3 w-3" />
                  {recurringLabel}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                >
                  {statusName}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                {location}
              </div>
              {!isAddressValid && (
                <div className="text-red-500 text-sm mt-1">
                  Address is required.
                </div>
              )}
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="h-4 w-4 mr-2 text-slate-400" />
                {startTime && endTime ? (
                  <span>
                    {startTime} - {endTime}
                  </span>
                ) : (
                  <span>Time not set</span>
                )}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <DollarSign className="h-4 w-4 mr-2 text-slate-400" />
                {price ? `${price}` : 'Price not available'}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <ClipboardList className="h-4 w-4 mr-2 text-slate-400" />
                <div dangerouslySetInnerHTML={{ __html: notes }} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 flex gap-2">
          <div onClick={(e) => e.stopPropagation()}>
            <DeleteJobButton jobId={id} onDeleted={handleRefresh} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
