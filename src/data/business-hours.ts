export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface TimeSlot {
  start: string;
  end: string;
}

export interface BusinessHours {
  [key: string]: {
    isOpen: boolean;
    slots: TimeSlot[];
  };
}

export const defaultBusinessHours: BusinessHours = {
  Monday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
  Tuesday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
  Wednesday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
  Thursday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
  Friday: { isOpen: true, slots: [{ start: '09:00', end: '17:00' }] },
  Saturday: { isOpen: false, slots: [] },
  Sunday: { isOpen: false, slots: [] },
};
