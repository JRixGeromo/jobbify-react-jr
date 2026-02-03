export type ActivityType =
  | 'email_sent'
  | 'email_opened'
  | 'note_added'
  | 'job_completed'
  | 'quote_sent'
  | 'invoice_paid'
  | 'contact_updated'
  | 'tag_added'
  | 'tag_removed';

export interface ClientTag {
  id: string;
  name: string;
  color: string;
}

export interface ClientActivity {
  id: string;
  clientId: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ClientContact {
  id: string;
  clientId: string;
  type: 'primary' | 'billing' | 'site';
  name: string;
  email: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export interface ClientPreference {
  id: string;
  clientId: string;
  preferredContactMethod: 'email' | 'phone' | 'sms';
  preferredServiceDay: string[];
  preferredServiceTime: string[];
  specialInstructions: string;
  marketingConsent: boolean;
}

export const clientTags: ClientTag[] = [
  { id: '1', name: 'VIP', color: 'bg-purple-100 text-purple-800' },
  { id: '2', name: 'Regular', color: 'bg-blue-100 text-blue-800' },
  { id: '3', name: 'Commercial', color: 'bg-amber-100 text-amber-800' },
  { id: '4', name: 'Residential', color: 'bg-emerald-100 text-emerald-800' },
];

export const clientActivities: ClientActivity[] = [
  {
    id: '1',
    clientId: '1',
    type: 'quote_sent',
    description: 'Quote #1234 sent for Plumbing Repair',
    timestamp: '2024-03-15T10:30:00Z',
    metadata: {
      quoteId: '1234',
      amount: '$350',
    },
  },
  {
    id: '2',
    clientId: '1',
    type: 'email_opened',
    description: 'Opened service reminder email',
    timestamp: '2024-03-14T15:45:00Z',
    metadata: {
      emailId: '5678',
      subject: 'Upcoming Service Reminder',
    },
  },
];

export const clientContacts: ClientContact[] = [
  {
    id: '1',
    clientId: '1',
    type: 'primary',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(512) 555-0123',
    address: '1234 Oak Street, Austin, TX',
    isDefault: true,
  },
  {
    id: '2',
    clientId: '1',
    type: 'billing',
    name: 'Mark Johnson',
    email: 'mark.j@example.com',
    phone: '(512) 555-0124',
    address: '1234 Oak Street, Austin, TX',
    isDefault: false,
  },
];

export const clientPreferences: ClientPreference[] = [
  {
    id: '1',
    clientId: '1',
    preferredContactMethod: 'email',
    preferredServiceDay: ['Monday', 'Wednesday', 'Friday'],
    preferredServiceTime: ['Morning', 'Afternoon'],
    specialInstructions: 'Please call 15 minutes before arrival',
    marketingConsent: true,
  },
];
