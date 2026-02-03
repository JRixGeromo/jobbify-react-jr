export interface TimeEntry {
  id: string;
  userId: string;
  jobId?: string;
  date: string;
  startTime: string;
  endTime: string;
  breakDuration: number; // in minutes
  description: string;
  billable: boolean;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
}

export const timeEntries: TimeEntry[] = [
  {
    id: '1',
    userId: 'tech1',
    jobId: '1',
    date: '2024-03-15',
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 60,
    description: 'Plumbing repair at client site',
    billable: true,
    status: 'approved',
    approvedBy: 'manager1',
    approvedAt: '2024-03-15T18:00:00Z',
  },
  {
    id: '2',
    userId: 'tech1',
    jobId: '2',
    date: '2024-03-16',
    startTime: '08:30',
    endTime: '16:30',
    breakDuration: 45,
    description: 'HVAC maintenance and filter replacement',
    billable: true,
    status: 'pending',
  },
];
