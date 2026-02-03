import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Filter,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Modal } from '../components/ui/modal';
import { jobs } from '../data/jobs';
import { staff } from '../data/staff';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  crew?: string[];
  jobId?: string;
  status?: string;
  location?: string;
  description?: string;
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const navigate = useNavigate();

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const events: Event[] = jobs.map((job) => ({
    id: job.id,
    title: "",
    start: new Date(),
    // start: new Date(`${job.date} ${job.time}`),
    end: new Date(
      new Date().getTime() + 2 * 60 * 60 * 1000
      // new Date(`${job.date} ${job.time}`).getTime() + 2 * 60 * 60 * 1000
    ),
    crew: ['1', '2'],
    jobId: job.id,
    status: job.status,
    location: job.address,
    description: job.notes,
  }));

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800';
      case 'On Hold':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs />
        <div className="mt-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Schedule</h1>
            <p className="text-slate-600">
              Manage job schedules and crew assignments
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 rounded-lg border ${
                showFilters
                  ? 'border-purple-200 bg-purple-50 text-purple-700'
                  : 'border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 hover:text-purple-700'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Event
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Crew Members
              </label>
              <div className="space-y-2">
                {staff.map((member) => (
                  <label key={member.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCrew.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCrew([...selectedCrew, member.id]);
                        } else {
                          setSelectedCrew(
                            selectedCrew.filter((id) => id !== member.id)
                          );
                        }
                      }}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">
                      {member.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {[
                  'Scheduled',
                  'In Progress',
                  'On Hold',
                  'Completed',
                  'Cancelled',
                ].map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStatus.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStatus([...selectedStatus, status]);
                        } else {
                          setSelectedStatus(
                            selectedStatus.filter((s) => s !== status)
                          );
                        }
                      }}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-purple-100">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm text-purple-600 hover:text-purple-700"
            >
              Today
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(addDays(currentDate, -7))}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <ChevronLeft className="h-5 w-5 text-slate-600" />
              </button>
              <button
                onClick={() => setCurrentDate(addDays(currentDate, 7))}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <ChevronRight className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-8 divide-x divide-purple-100">
          {/* Time Labels */}
          <div className="pt-16">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-20 border-t border-purple-100 pr-2 text-right"
              >
                <span className="text-sm text-slate-500">
                  {format(new Date().setHours(hour, 0), 'h a')}
                </span>
              </div>
            ))}
          </div>

          {/* Days */}
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="relative">
              <div className="h-16 p-2 border-b border-purple-100 sticky top-0 bg-white z-10">
                <div className="text-sm font-medium text-slate-800">
                  {format(day, 'EEEE')}
                </div>
                <div className="text-sm text-slate-500">
                  {format(day, 'MMM d')}
                </div>
              </div>
              <div>
                {timeSlots.map((hour) => (
                  <div
                    key={hour}
                    className="h-20 border-t border-purple-100 relative"
                  >
                    {events
                      .filter(
                        (event) =>
                          isSameDay(event.start, day) &&
                          event.start.getHours() === hour
                      )
                      .map((event) => (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={`absolute inset-x-1 rounded-lg p-2 cursor-pointer ${getStatusColor(
                            event.status || 'Scheduled'
                          )}`}
                          style={{
                            top: '0.25rem',
                            minHeight: '4rem',
                          }}
                        >
                          <div className="text-sm font-medium">
                            {event.title}
                          </div>
                          <div className="text-xs mt-1">
                            {format(event.start, 'h:mm a')} -{' '}
                            {format(event.end, 'h:mm a')}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        title={selectedEvent ? 'Event Details' : 'Add Event'}
      >
        {selectedEvent ? (
          <div className="space-y-4">
            <h3 className="font-medium text-slate-800 text-lg">
              {selectedEvent.title}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4" />
                <span>
                  {format(selectedEvent.start, 'PPP p')} -{' '}
                  {format(selectedEvent.end, 'p')}
                </span>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-sm ${getStatusColor(
                    selectedEvent.status || 'Scheduled'
                  )}`}
                >
                  {selectedEvent.status}
                </span>
              </div>
              {selectedEvent.description && (
                <p className="text-sm text-slate-600 mt-2">
                  {selectedEvent.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-slate-600">Event creation form coming soon...</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
