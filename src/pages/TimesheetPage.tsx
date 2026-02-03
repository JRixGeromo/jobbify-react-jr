import React, { useState } from 'react';
import {
  Plus,
  Clock,
  Calendar,
  Briefcase,
  Check,
  X,
  AlertCircle,
  Pencil,
  Trash2,
  Filter,
  ChevronDown,
} from 'lucide-react';
import {
  timeEntries as initialTimeEntries,
  TimeEntry,
} from '../data/timesheet';
import { jobs } from '../data/jobs';
import { Modal } from '../components/ui/modal';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  format,
  differenceInMinutes,
  parseISO,
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns';
import { TimeEntryForm } from '../components/timesheet/TimeEntryForm';

type DateRange = {
  start: Date;
  end: Date;
  label: string;
};

const dateRanges: DateRange[] = [
  {
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date()),
    label: 'Current Week',
  },
  {
    start: startOfWeek(subWeeks(new Date(), 1)),
    end: endOfWeek(subWeeks(new Date(), 1)),
    label: 'Last Week',
  },
  {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
    label: 'Current Month',
  },
  {
    start: startOfMonth(subMonths(new Date(), 1)),
    end: endOfMonth(subMonths(new Date(), 1)),
    label: 'Last Month',
  },
  {
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date(new Date().getFullYear(), 11, 31),
    label: 'This Year',
  },
  {
    start: new Date(new Date().getFullYear() - 1, 0, 1),
    end: new Date(new Date().getFullYear() - 1, 11, 31),
    label: 'Last Year',
  },
];

export default function TimesheetPage() {
  const [timeEntries, setTimeEntries] = useState(initialTimeEntries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>(dateRanges[0]);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    billableOnly: false,
    jobId: '',
    status: '',
    minHours: '',
    maxHours: '',
    customDateRange: {
      start: '',
      end: '',
    },
  });
  const [formData, setFormData] = useState<Partial<TimeEntry>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 60,
    description: '',
    billable: true,
    status: 'pending',
  });

  const calculateHours = (entry: TimeEntry) => {
    const start = parseISO(`${entry.date}T${entry.startTime}`);
    const end = parseISO(`${entry.date}T${entry.endTime}`);
    const totalMinutes = differenceInMinutes(end, start) - entry.breakDuration;
    return (totalMinutes / 60).toFixed(2);
  };

  const getStatusColor = (status: TimeEntry['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      setTimeEntries(
        timeEntries.map((entry) =>
          entry.id === editingEntry.id ? { ...entry, ...formData } : entry
        )
      );
    } else {
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        userId: 'tech1',
        ...(formData as Omit<TimeEntry, 'id' | 'userId'>),
      };
      setTimeEntries([...timeEntries, newEntry]);
    }
    handleCloseModal();
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setFormData(entry);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setTimeEntries(timeEntries.filter((entry) => entry.id !== id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 60,
      description: '',
      billable: true,
      status: 'pending',
    });
  };

  const filteredEntries = timeEntries.filter((entry) => {
    const entryDate = new Date(entry.date);
    const isInRange =
      filters.customDateRange.start && filters.customDateRange.end
        ? entryDate >= new Date(filters.customDateRange.start) &&
          entryDate <= new Date(filters.customDateRange.end)
        : entryDate >= selectedRange.start && entryDate <= selectedRange.end;

    const matchesBillable = filters.billableOnly ? entry.billable : true;
    const matchesJob = filters.jobId ? entry.jobId === filters.jobId : true;
    const matchesStatus = filters.status
      ? entry.status === filters.status
      : true;

    const hours = parseFloat(calculateHours(entry));
    const matchesHours =
      (!filters.minHours || hours >= parseFloat(filters.minHours)) &&
      (!filters.maxHours || hours <= parseFloat(filters.maxHours));

    return (
      isInRange &&
      matchesBillable &&
      matchesJob &&
      matchesStatus &&
      matchesHours
    );
  });

  const totalHours = filteredEntries.reduce(
    (acc, entry) => acc + parseFloat(calculateHours(entry)),
    0
  );
  const billableHours = filteredEntries
    .filter((entry) => entry.billable)
    .reduce((acc, entry) => acc + parseFloat(calculateHours(entry)), 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs />
        <div className="mt-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Timesheet</h1>
            <p className="text-slate-600">
              Track and manage your working hours
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  showFilters
                    ? 'border-purple-200 bg-purple-50 text-purple-700'
                    : 'border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 hover:text-purple-700'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className="h-4 w-4" />
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 p-4 z-10">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Date Range
                      </label>
                      <select
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        value={selectedRange.label}
                        onChange={(e) => {
                          const range = dateRanges.find(
                            (r) => r.label === e.target.value
                          );
                          if (range) setSelectedRange(range);
                        }}
                      >
                        {dateRanges.map((range) => (
                          <option key={range.label} value={range.label}>
                            {range.label}
                          </option>
                        ))}
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>

                    {selectedRange.label === 'Custom Range' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={filters.customDateRange.start}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                customDateRange: {
                                  ...filters.customDateRange,
                                  start: e.target.value,
                                },
                              })
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={filters.customDateRange.end}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                customDateRange: {
                                  ...filters.customDateRange,
                                  end: e.target.value,
                                },
                              })
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Job
                      </label>
                      <select
                        value={filters.jobId}
                        onChange={(e) =>
                          setFilters({ ...filters, jobId: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      >
                        <option value="">All Jobs</option>
                        {jobs.map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.service}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          setFilters({ ...filters, status: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Min Hours
                        </label>
                        <input
                          type="number"
                          value={filters.minHours}
                          onChange={(e) =>
                            setFilters({ ...filters, minHours: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Max Hours
                        </label>
                        <input
                          type="number"
                          value={filters.maxHours}
                          onChange={(e) =>
                            setFilters({ ...filters, maxHours: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                          min="0"
                          step="0.5"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="billableOnly"
                        checked={filters.billableOnly}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            billableOnly: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label
                        htmlFor="billableOnly"
                        className="ml-2 text-sm text-slate-700"
                      >
                        Billable Hours Only
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Time Entry
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-100">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-100">
                  {filteredEntries.map((entry) => {
                    const job = jobs.find((j) => j.id === entry.jobId);
                    return (
                      <tr key={entry.id} className="hover:bg-purple-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-slate-400 mr-2" />
                            <span className="text-sm text-slate-900">
                              {format(new Date(entry.date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Briefcase className="h-5 w-5 text-slate-400 mr-2" />
                            <span className="text-sm text-slate-900">
                              {job?.service || 'No Job'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-slate-400 mr-2" />
                            <span className="text-sm text-slate-900">
                              {entry.startTime} - {entry.endTime}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-900">
                            {calculateHours(entry)}h
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}
                          >
                            {entry.status.charAt(0).toUpperCase() +
                              entry.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(entry)}
                              className="p-1 text-slate-400 hover:text-purple-600 rounded-full hover:bg-purple-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Time Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Hours</span>
                <span className="text-lg font-semibold text-slate-800">
                  {totalHours.toFixed(2)}h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Billable Hours</span>
                <span className="text-lg font-semibold text-purple-600">
                  {billableHours.toFixed(2)}h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">
                  Non-Billable Hours
                </span>
                <span className="text-lg font-semibold text-slate-600">
                  {(totalHours - billableHours).toFixed(2)}h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Utilization Rate</span>
                <span className="text-lg font-semibold text-purple-600">
                  {totalHours > 0
                    ? ((billableHours / totalHours) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-slate-800">
                      Submit for Approval
                    </p>
                    <p className="text-sm text-slate-600">
                      Send timesheet for review
                    </p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-slate-800">View Reports</p>
                    <p className="text-sm text-slate-600">Analyze time data</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-slate-800">Start Timer</p>
                    <p className="text-sm text-slate-600">
                      Track time in real-time
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEntry ? 'Edit Time Entry' : 'Add Time Entry'}
      >
        <TimeEntryForm
          entry={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isEditing={!!editingEntry}
        />
      </Modal>
    </div>
  );
}
