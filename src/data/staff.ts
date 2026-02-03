export type StaffRole =
  | 'Technician'
  | 'Supervisor'
  | 'Manager'
  | 'Administrator';
export type AvailabilityStatus =
  | 'Available'
  | 'On Leave'
  | 'On Job'
  | 'Off Duty';

export interface WorkingHours {
  day: string;
  shifts: {
    start: string;
    end: string;
  }[];
}

export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  type: 'Annual' | 'Sick' | 'Personal' | 'Other';
  status: 'Pending' | 'Approved' | 'Rejected';
  notes?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  role: StaffRole;
  status: AvailabilityStatus;
  workingHours: WorkingHours[];
  skills: string[];
  chargeOutRate: number; // Billable rate to clients
  payRate: number; // Base hourly rate
  overtimeRate: number; // Overtime hourly rate
  maxWeeklyHours: number;
  leaveBalance: {
    annual: number;
    sick: number;
    personal: number;
  };
  leaveRequests: LeaveRequest[];
}

export const staff: Staff[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@servicepro.com',
    phone: '(512) 555-0191',
    photo:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop',
    role: 'Technician',
    status: 'Available',
    workingHours: [
      {
        day: 'Monday',
        shifts: [{ start: '08:00', end: '16:00' }],
      },
      {
        day: 'Tuesday',
        shifts: [{ start: '08:00', end: '16:00' }],
      },
      {
        day: 'Wednesday',
        shifts: [{ start: '08:00', end: '16:00' }],
      },
      {
        day: 'Thursday',
        shifts: [{ start: '08:00', end: '16:00' }],
      },
      {
        day: 'Friday',
        shifts: [{ start: '08:00', end: '16:00' }],
      },
    ],
    skills: ['Plumbing', 'HVAC', 'General Maintenance'],
    chargeOutRate: 125,
    payRate: 45,
    overtimeRate: 67.5,
    maxWeeklyHours: 40,
    leaveBalance: {
      annual: 80,
      sick: 40,
      personal: 24,
    },
    leaveRequests: [
      {
        id: 'lr1',
        startDate: '2024-04-01',
        endDate: '2024-04-05',
        type: 'Annual',
        status: 'Approved',
        notes: 'Family vacation',
      },
    ],
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@servicepro.com',
    phone: '(512) 555-0192',
    photo:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop',
    role: 'Supervisor',
    status: 'On Job',
    workingHours: [
      {
        day: 'Monday',
        shifts: [{ start: '07:00', end: '15:00' }],
      },
      {
        day: 'Tuesday',
        shifts: [{ start: '07:00', end: '15:00' }],
      },
      {
        day: 'Wednesday',
        shifts: [{ start: '07:00', end: '15:00' }],
      },
      {
        day: 'Thursday',
        shifts: [{ start: '07:00', end: '15:00' }],
      },
      {
        day: 'Friday',
        shifts: [{ start: '07:00', end: '15:00' }],
      },
    ],
    skills: ['Electrical', 'Project Management', 'Team Leadership'],
    chargeOutRate: 150,
    payRate: 55,
    overtimeRate: 82.5,
    maxWeeklyHours: 40,
    leaveBalance: {
      annual: 120,
      sick: 40,
      personal: 24,
    },
    leaveRequests: [],
  },
];
