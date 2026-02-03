import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { BusinessHours, DayOfWeek, TimeSlot } from '../../data/business-hours';

interface BusinessHoursFormProps {
  hours: BusinessHours;
  onChange: (hours: BusinessHours) => void;
}

export function BusinessHoursForm({ hours, onChange }: BusinessHoursFormProps) {
  const days: DayOfWeek[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const handleDayToggle = (day: DayOfWeek) => {
    onChange({
      ...hours,
      [day]: {
        ...hours[day],
        isOpen: !hours[day].isOpen,
        slots: hours[day].isOpen ? [] : [{ start: '09:00', end: '17:00' }],
      },
    });
  };

  const handleAddSlot = (day: DayOfWeek) => {
    const lastSlot = hours[day].slots[hours[day].slots.length - 1];
    onChange({
      ...hours,
      [day]: {
        ...hours[day],
        slots: [
          ...hours[day].slots,
          { start: lastSlot?.end || '09:00', end: '17:00' },
        ],
      },
    });
  };

  const handleRemoveSlot = (day: DayOfWeek, index: number) => {
    onChange({
      ...hours,
      [day]: {
        ...hours[day],
        slots: hours[day].slots.filter((_, i) => i !== index),
      },
    });
  };

  const handleSlotChange = (
    day: DayOfWeek,
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    onChange({
      ...hours,
      [day]: {
        ...hours[day],
        slots: hours[day].slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    });
  };

  return (
    <div className="space-y-4">
      {days.map((day) => (
        <div key={day} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hours[day].isOpen}
                  onChange={() => handleDayToggle(day)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                <span className="ms-3 text-sm font-medium text-slate-800">
                  {day}
                </span>
              </label>
              {hours[day].isOpen && (
                <span className="text-sm text-emerald-600">Open</span>
              )}
              {!hours[day].isOpen && (
                <span className="text-sm text-slate-500">Closed</span>
              )}
            </div>
            {hours[day].isOpen && (
              <button
                type="button"
                onClick={() => handleAddSlot(day)}
                className="text-purple-600 hover:text-purple-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>

          {hours[day].isOpen && (
            <div className="space-y-3">
              {hours[day].slots.map((slot, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) =>
                      handleSlotChange(day, index, 'start', e.target.value)
                    }
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                  />
                  <span className="text-slate-500">to</span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) =>
                      handleSlotChange(day, index, 'end', e.target.value)
                    }
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                  />
                  {hours[day].slots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(day, index)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
