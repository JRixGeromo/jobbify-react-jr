export type ExpenseCategory =
  | 'Materials'
  | 'Equipment'
  | 'Vehicle'
  | 'Office'
  | 'Marketing'
  | 'Insurance'
  | 'Utilities'
  | 'Payroll'
  | 'Other';

export type PaymentMethod =
  | 'Credit Card'
  | 'Cash'
  | 'Bank Transfer'
  | 'Check'
  | 'Digital Wallet';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  jobId?: string;
  receipt?: string;
  notes?: string;
  vendor?: string;
  taxDeductible: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedAt?: string;
}

export const expenses: Expense[] = [
  {
    id: '1',
    date: '2024-03-15',
    category: 'Materials',
    description: 'Plumbing supplies for job #1234',
    amount: 350.75,
    paymentMethod: 'Credit Card',
    jobId: '1',
    receipt:
      'https://images.unsplash.com/photo-1554774853-719586f82d77?w=300&h=400&fit=crop',
    vendor: 'Home Depot',
    taxDeductible: true,
    status: 'Approved',
    approvedBy: 'John Manager',
    approvedAt: '2024-03-16T10:30:00Z',
  },
  {
    id: '2',
    date: '2024-03-14',
    category: 'Vehicle',
    description: 'Fuel for service van',
    amount: 85.5,
    paymentMethod: 'Credit Card',
    taxDeductible: true,
    status: 'Approved',
    approvedBy: 'John Manager',
    approvedAt: '2024-03-15T09:15:00Z',
  },
  {
    id: '3',
    date: '2024-03-13',
    category: 'Equipment',
    description: 'New power tools',
    amount: 750.0,
    paymentMethod: 'Bank Transfer',
    receipt:
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=300&h=400&fit=crop',
    vendor: 'Tool Supply Co',
    taxDeductible: true,
    status: 'Pending',
  },
];
