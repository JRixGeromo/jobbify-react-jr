export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
  media: string;
}

export interface Quote {
  id: string;
  client: string;
  service: string;
  date: string;
  dueDate: string;
  items: QuoteItem[];
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
  status: 'Draft' | 'Pending' | 'Accepted' | 'Rejected';
}

export const quotes: Quote[] = [
  {
    id: '1',
    client: 'Sarah Johnson',
    service: 'Plumbing Repair',
    date: '2024-03-20',
    dueDate: '2024-04-19',
    items: [
      {
        id: 'item1',
        description: 'Labor - Pipe Replacement',
        quantity: 3,
        unitPrice: 125,
        taxable: true,
        media: '',
      },
      {
        id: 'item2',
        description: 'Materials - PVC Pipes and Fittings',
        quantity: 1,
        unitPrice: 75,
        taxable: true,
        media: '',
      },
    ],
    subtotal: 450,
    taxRate: 'us-tx',
    taxAmount: 37.13,
    discountType: 'percentage',
    discountValue: 10,
    discountAmount: 45,
    total: 442.13,
    notes: 'Quote includes labor and materials for complete pipe replacement.',
    terms: 'Quote valid for 30 days.',
    paymentTerm: 'net-30',
    status: 'Pending',
  },
];
