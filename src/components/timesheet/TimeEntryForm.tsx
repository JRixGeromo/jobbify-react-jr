import React from 'react';
import { TimeEntry } from '../../data/timesheet';
import { jobs } from '../../data/jobs';

interface TimeEntryFormProps {
  entry: Partial<TimeEntry>;
  onChange: (data: Partial<TimeEntry>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function TimeEntryForm({
  entry,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
}: TimeEntryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={entry.date || ''}
          onChange={(e) => onChange({ ...entry, date: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            value={entry.startTime || ''}
            onChange={(e) => onChange({ ...entry, startTime: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            End Time
          </label>
          <input
            type="time"
            value={entry.endTime || ''}
            onChange={(e) => onChange({ ...entry, endTime: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Break Duration (minutes)
        </label>
        <input
          type="number"
          value={entry.breakDuration || 0}
          onChange={(e) =>
            onChange({ ...entry, breakDuration: parseInt(e.target.value) })
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          min="0"
          step="5"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Job
        </label>
        <select
          value={entry.jobId || ''}
          onChange={(e) => onChange({ ...entry, jobId: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">No Job (Internal Time)</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.service} - {job.address}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          value={entry.description || ''}
          onChange={(e) => onChange({ ...entry, description: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          rows={3}
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="billable"
          checked={entry.billable || false}
          onChange={(e) => onChange({ ...entry, billable: e.target.checked })}
          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
        />
        <label htmlFor="billable" className="text-sm text-slate-700">
          Billable Time
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-600 hover:text-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          {isEditing ? 'Update' : 'Add'} Time Entry
        </button>
      </div>
    </form>
  );
}
