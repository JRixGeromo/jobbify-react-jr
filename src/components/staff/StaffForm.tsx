import React, { useState } from 'react';
import {
  Staff,
  StaffRole,
  AvailabilityStatus,
  WorkingHours,
} from '../../data/staff';
import { Plus, Trash2 } from 'lucide-react';

interface StaffFormProps {
  staff?: Staff | null;
  onSubmit: (data: Partial<Staff>) => void;
  onCancel: () => void;
}

export function StaffForm({ staff, onSubmit, onCancel }: StaffFormProps) {
  const [formData, setFormData] = useState<Partial<Staff>>(
    staff || {
      name: '',
      email: '',
      phone: '',
      photo: '',
      role: 'Technician',
      status: 'Available',
      workingHours: [
        {
          day: 'Monday',
          shifts: [{ start: '09:00', end: '17:00' }],
        },
      ],
      skills: [],
      chargeOutRate: 0,
      payRate: 0,
      overtimeRate: 0,
      maxWeeklyHours: 40,
      leaveBalance: {
        annual: 80,
        sick: 40,
        personal: 24,
      },
      leaveRequests: [],
    }
  );

  const handleAddShift = (dayIndex: number) => {
    const newWorkingHours = [...(formData.workingHours || [])];
    newWorkingHours[dayIndex].shifts.push({ start: '09:00', end: '17:00' });
    setFormData({ ...formData, workingHours: newWorkingHours });
  };

  const handleRemoveShift = (dayIndex: number, shiftIndex: number) => {
    const newWorkingHours = [...(formData.workingHours || [])];
    newWorkingHours[dayIndex].shifts.splice(shiftIndex, 1);
    setFormData({ ...formData, workingHours: newWorkingHours });
  };

  const handleShiftChange = (
    dayIndex: number,
    shiftIndex: number,
    field: 'start' | 'end',
    value: string
  ) => {
    const newWorkingHours = [...(formData.workingHours || [])];
    newWorkingHours[dayIndex].shifts[shiftIndex][field] = value;
    setFormData({ ...formData, workingHours: newWorkingHours });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Photo URL
          </label>
          <input
            type="url"
            value={formData.photo}
            onChange={(e) =>
              setFormData({ ...formData, photo: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as StaffRole })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          >
            <option value="Technician">Technician</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Manager">Manager</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as AvailabilityStatus,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          >
            <option value="Available">Available</option>
            <option value="On Leave">On Leave</option>
            <option value="On Job">On Job</option>
            <option value="Off Duty">Off Duty</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Skills (comma-separated)
        </label>
        <input
          type="text"
          value={formData.skills?.join(', ')}
          onChange={(e) =>
            setFormData({
              ...formData,
              skills: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="e.g., Plumbing, HVAC, Electrical"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Charge-out Rate ($/h)
          </label>
          <input
            type="number"
            value={formData.chargeOutRate}
            onChange={(e) =>
              setFormData({
                ...formData,
                chargeOutRate: parseFloat(e.target.value),
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Pay Rate ($/h)
          </label>
          <input
            type="number"
            value={formData.payRate}
            onChange={(e) =>
              setFormData({ ...formData, payRate: parseFloat(e.target.value) })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Overtime Rate ($/h)
          </label>
          <input
            type="number"
            value={formData.overtimeRate}
            onChange={(e) =>
              setFormData({
                ...formData,
                overtimeRate: parseFloat(e.target.value),
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Working Hours
        </label>
        <div className="space-y-4">
          {[
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ].map((day, dayIndex) => (
            <div key={day} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-slate-800">{day}</h4>
                <button
                  type="button"
                  onClick={() => handleAddShift(dayIndex)}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.workingHours?.[dayIndex]?.shifts.map(
                  (shift, shiftIndex) => (
                    <div key={shiftIndex} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={shift.start}
                        onChange={(e) =>
                          handleShiftChange(
                            dayIndex,
                            shiftIndex,
                            'start',
                            e.target.value
                          )
                        }
                        className="rounded border border-slate-300 px-2 py-1"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={shift.end}
                        onChange={(e) =>
                          handleShiftChange(
                            dayIndex,
                            shiftIndex,
                            'end',
                            e.target.value
                          )
                        }
                        className="rounded border border-slate-300 px-2 py-1"
                      />
                      {(formData.workingHours?.[dayIndex]?.shifts || [])
                        .length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveShift(dayIndex, shiftIndex)
                          }
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
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
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          {staff ? 'Update' : 'Add'} Staff Member
        </button>
      </div>
    </form>
  );
}
