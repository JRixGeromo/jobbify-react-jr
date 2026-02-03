export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
  media?: string[]; // or null/undefined based on your use case
  title?: string; // Ensure this field is defined
}

export interface Invoice {
  id: string;
  client_id: number; // Updated to use client_id as a number (or bigint)
  service_id: number; // Updated to use service_id as a number (or bigint)
  quote_id?: string; // Add quote_id as optional
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
