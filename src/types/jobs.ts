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
  service: string;
  date: string;
  time: string;
  address: string;
  price: string;
  status: JobStatus;
  photo: string[];
  notes: string;
  tasks: Task[];
  recurring: RecurringType;
}

export interface JobCardProps {
  id: string;
  client: string;
  service: string;
  address: string;
  time: string;
  price: string;
  status: string;
  statusColor: string;
  photo: string[];
  notes: string;
  recurring: RecurringType;
}

interface Client {
  id: string;
  full_name: string;
}

interface Service {
  id: string;
  name: string;
}

interface Status {
  id: string;
  title: string;
}

export interface JobNew {
  id: string;
  clients: Client;
  services: Service;
  schedule_date: string;
  start_time: string;
  end_time: string;
  statuses: Status;
  image_path: string;
  notes: string;
  recurring_schedule: string;
  location: string;
  tasks: string;
  price: number;
}
