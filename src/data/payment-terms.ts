export interface PaymentTerm {
  id: string;
  name: string;
  days: number;
  description: string;
}

export const paymentTerms: PaymentTerm[] = [
  {
    id: 'due-receipt',
    name: 'Due on Receipt',
    days: 0,
    description: 'Payment is due immediately upon receipt',
  },
  {
    id: 'net-15',
    name: 'Net 15',
    days: 15,
    description: 'Payment is due within 15 days',
  },
  {
    id: 'net-30',
    name: 'Net 30',
    days: 30,
    description: 'Payment is due within 30 days',
  },
  {
    id: 'net-60',
    name: 'Net 60',
    days: 60,
    description: 'Payment is due within 60 days',
  },
];
