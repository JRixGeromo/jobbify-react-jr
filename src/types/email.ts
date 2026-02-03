export interface SendInvoiceEmailPayload {
  clientEmail: string; // Recipient's email address
  subject: string; // Email subject
  react?: React.ReactElement;
  html?: string; // HTML content of the email
  attachments: {
    filename: string;
    content: string;
    encoding: string;
  }[];
  ccEmails?: string[]; // Optional CC email addresses
  bccEmails?: string[]; // Optional BCC email addresses
  metadata: {
    invoiceId: string;
  };
  invoice?: {
    id: string;
    date: string;
    dueDate: string;
    amount: number;
    currency: string;
    items: any[];
  };
  paymentLink?: string; // Optional payment link for the invoice
  terms?: string; // Optional terms and conditions for the invoice
}

export interface SendQuoteEmailPayload {
  clientEmail: string; // Recipient's email address
  subject: string; // Email subject
  html: string; // HTML content of the email
  attachments?: Attachment[]; // Optional attachments (e.g., PDFs)
  ccEmails?: string[]; // Optional CC email addresses
  bccEmails?: string[]; // Optional BCC email addresses
  metadata?: Record<string, any>; // Optional metadata for tracking
  invoice?: InvoiceDetails; // Optional invoice details for emails that include invoices
}

export interface SendReminderEmailPayload {
  clientEmail: string; // Recipient's email address
  subject: string; // Email subject
  html: string; // HTML content of the email
  ccEmails?: string[]; // Optional CC email addresses
  bccEmails?: string[]; // Optional BCC email addresses
  metadata?: Record<string, any>; // Optional metadata for tracking
  reminderId: string; // Required unique identifier for the reminder
  dueDate?: string; // Optional due date for the reminder
  amountDue?: number; // Optional amount due for the reminder
  paymentLink?: string; // Optional payment link for the reminder
}

export interface Attachment {
  filename: string; // Name of the attached file
  content: string | Buffer; // File content (Base64 string or Buffer)
  contentType?: string; // MIME type of the file (e.g., 'application/pdf')
  encoding?: string; // Encoding type (e.g., 'base64')
}

export interface InvoiceDetails {
  id: string; // Invoice ID
  date: string; // Invoice issue date
  dueDate?: string; // Optional due date
  amount: number; // Total invoice amount
  currency?: string; // Currency of the amount (e.g., 'USD')
  items: InvoiceItem[]; // List of invoice items
}

export interface InvoiceItem {
  description: string; // Description of the item
  quantity: number; // Quantity of the item
  price: number; // Price per item
}

export interface QuoteDetails {
  id: string; // Quote ID
  date: string; // Quote issue date
  validUntil?: string; // Optional validity date for the quote
  amount: number; // Total quote amount
  currency?: string; // Currency of the amount (e.g., 'USD')
  items: QuoteItem[]; // List of quote items
  notes?: string; // Optional notes for the quote
}

export interface QuoteItem {
  description: string; // Description of the quoted item
  quantity: number; // Quantity of the quoted item
  unitPrice: number; // Price per unit
  total: number; // Total price for the item (calculated as quantity * unitPrice)
}

export interface SendQuoteEmailResponse {
  message: string; // Response message
  result: any; // API result (can be typed further if structure is known)
  success: boolean; // Status of the operation
  errorDetails?: string; // Optional error details if success is false
}

export interface SendInvoiceEmailResponse {
  message: string; // Response message from the API
  result: any; // API result (e.g., details of the sent email or invoice status)
  success: boolean; // Whether the operation was successful
  errorDetails?: string; // Optional error details if success is false
  invoiceId?: string; // Optional invoice ID if applicable
}
export interface SendReminderEmailResponse {
  message: string; // Response message
  success: boolean; // Whether the operation was successful
  result: any; // API result (if applicable)
  errorDetails?: string; // Optional error details
}
