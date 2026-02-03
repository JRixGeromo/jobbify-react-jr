export type JobStatus =
  | 'Scheduled'
  | 'In Progress'
  | 'On Hold'
  | 'Completed'
  | 'Cancelled';
export type ViewMode = 'list' | 'board' | 'card' | 'timeline';
export type RecurringType =
  | 'one-time'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export interface Task {
  id: string;
  jobId: string;
  content: string;
  completed: boolean;
  order: number;
}

export interface Job {
  id: string;
  clientId: string;
  service: [];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  address: string;
  price: string;
  status: string;
  photo: string[];
  notes: string;
  tasks: Task[];
  recurring: RecurringType;
  statusColor: string;
}

export const getStatusColor = (status: JobStatus) => {
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

export const getStatusColorNew = (status: string) => {
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

export const getRecurringColor = (recurring: RecurringType) => {
  switch (recurring) {
    case 'weekly':
      return 'bg-indigo-100 text-indigo-800';
    case 'monthly':
      return 'bg-pink-100 text-pink-800';
    case 'quarterly':
      return 'bg-cyan-100 text-cyan-800';
    case 'yearly':
      return 'bg-violet-100 text-violet-800';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

export const getRecurringColor2 = (recurring: string) => {
  switch (recurring) {
    case 'weekly':
      return 'bg-indigo-100 text-indigo-800';
    case 'monthly':
      return 'bg-pink-100 text-pink-800';
    case 'quarterly':
      return 'bg-cyan-100 text-cyan-800';
    case 'yearly':
      return 'bg-violet-100 text-violet-800';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

export const jobs: Job[] = [];
