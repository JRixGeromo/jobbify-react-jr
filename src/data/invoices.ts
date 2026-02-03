export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
}

export interface Invoice {
  id: string;
  client: string;
  service: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: string;
  taxAmount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  total: number;
  notes: string;
  terms: string;
  paymentTerm: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  paymentDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
}

export const invoices: Invoice[] = [
  {
    id: '1',
    client: 'Sarah Johnson',
    service: 'Plumbing Repair',
    date: '2024-03-15',
    dueDate: '2024-04-14',
    items: [
      {
        id: 'item1',
        description: 'Emergency Plumbing Service',
        quantity: 2,
        unitPrice: 150,
        taxable: true,
      },
      {
        id: 'item2',
        description: 'Replacement Parts',
        quantity: 1,
        unitPrice: 50,
        taxable: true,
      },
    ],
    subtotal: 350,
    taxRate: 'us-tx',
    taxAmount: 28.88,
    discountType: 'fixed',
    discountValue: 25,
    discountAmount: 25,
    total: 353.88,
    notes: 'Thank you for your business!',
    terms: 'Please make payment by the due date.',
    paymentTerm: 'net-30',
    status: 'Paid',
    paymentDate: '2024-03-20',
    paymentMethod: 'Credit Card',
    paymentReference: 'TX123456',
  },
];
