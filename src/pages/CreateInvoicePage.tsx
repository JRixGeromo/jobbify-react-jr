import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_INVOICE, UPDATE_INVOICE } from '@/graphql/mutations';
import { GET_INVOICE_BY_ID } from '../graphql/queries'; // Ensure the query exists
import { Invoice } from '../types/invoices';
import { InvoiceForm } from '../components/invoices/InvoiceForm';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArrowLeft, Send, Download, Copy, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Import Auth Context
import { handleDownloadInvoicePDF } from '@/utils/handleDownloadInvoicePDF';
import { handleDuplicateInvoice } from '@/utils/handleDuplicateInvoice';
import { handleSendInvoice } from '@/utils/handleSendInvoice';
import { useFetchClients } from '@/hooks/useFetchClient';
import { useFetchServices } from '@/hooks/useFetchServices';

// Define the type for each item in the items array
interface Item {
  description: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
}

export default function CreateInvoicePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the id from the URL
  const [loading, setLoading] = useState(false);
  const { currentUser, companyId } = useAuth(); // Get current user from Auth Context
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Invoice> | null>(null);
  const [sendLoading, setSendLoading] = useState(false);

  const { clients } = useFetchClients(companyId);
  const { services } = useFetchServices(companyId);

  const clientMap = new Map(
    clients.map((client) => [client.id, `${client.first_name} ${client.last_name}`])
  );
  const clientEmailMap = new Map(
    clients.map((client) => [client.id, client.email_address])
  );
  const serviceMap = new Map(
    services.map((service) => [service.id, service.name])
  );

  // GraphQL Queries and Mutations
  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_INVOICE_BY_ID, {
    variables: { id },
    skip: !id, // Skip fetching if no id is provided
  });
  const [createInvoice, { loading: createLoading }] =
    useMutation(CREATE_INVOICE);
  const [updateInvoice, { loading: updateLoading }] =
    useMutation(UPDATE_INVOICE);

  useEffect(() => {
    if (id && data) {
      setIsEditMode(true);
      setFormData(data?.invoicesCollection?.edges[0]?.node || null); // Load invoice details into formData
    }
  }, [id, data]);

  const handleSubmit = async (formData: any) => {
    try {
      if (!currentUser) {
        throw new Error('User is not authenticated.');
      }

      const input = {
        invoice_number: `INV-${Date.now()}`, // Generate a unique invoice number (use only for creation)
        client_id: formData.client_id,
        service_id: formData.service_id,
        items: JSON.stringify(formData.items), // Assuming backend expects a string
        terms: formData.terms,
        issued_date:
          formData.issued_date || new Date().toISOString().split('T')[0], // Keep the issued date on update
        payment_due_date:
          formData.dueDate ||
          new Date(new Date().setDate(new Date().getDate() + 30))
            .toISOString()
            .split('T')[0], // Calculate default payment due date
        subtotal: formData.subtotal.toString(), // Convert to string
        tax_rate: formData.taxRate,
        tax_amount: formData.taxAmount.toString(), // Convert to string
        discount_type: formData.discountType,
        discount_value: formData.discountValue.toString(), // Convert to string
        discount_amount: formData.discountAmount.toString(), // Convert to string
        total: formData.total.toString(), // Convert to string
        payment_term: formData.paymentTerm,
        status: formData.status,
        company_id: currentUser.user_metadata.company_id, // Set the company_id
        created_by: currentUser.id, // Set the created_by field
      };

      // console.log(input);
      // return;

      if (formData.id) {
        // Update existing invoice
        await updateInvoice({ variables: { id: formData.id, input } });
        alert('Invoice updated successfully!');
      } else {
        // Create new invoice
        await createInvoice({ variables: { input } });
        alert('Invoice created successfully!');
      }

      navigate('/invoices');
    } catch (err) {
      console.error('Error saving invoice:', err);
      alert('Error saving invoice. Please try again.');
    }
  };

  const handleDuplicateInvoiceClick = async () => {
    await handleDuplicateInvoice({
      document: formData, // The invoice data to duplicate
      currentUser, // Current user object
      createDocument: createInvoice, // GraphQL mutation for creating an invoice
      navigate, // React Router navigate function
      documentType: 'invoice', // Type of the document
    });
  };

  const handleInvoiceDownloadPDFClick = async () => {
    await handleDownloadInvoicePDF({
      data: formData,
      clientMap,
      serviceMap,
      filenamePrefix: 'invoice',
    });
  };
  // Inside your component
  const handleSendInvoiceClick = async () => {
    if (!companyId) {
      alert('Company ID is missing. Please check your account settings.');
      return;
    }
    await handleSendInvoice(formData, clientMap, clientEmailMap, setSendLoading, companyId);
  };

  return (
    <div className="min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/invoices')}
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoices
            </button>
            <Breadcrumbs />
          </div>

          {/* {isEditMode && (
            <div className="flex gap-3">
              <button
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => {
                  console.log('formData.id:', formData?.id);
                  if (formData?.id) {
                    navigate(`/invoices/preview/${formData.id}`);
                  } else {
                    alert('No quote to preview.');
                  }
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              <button
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={handleDuplicateInvoiceClick}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </button>
              <button
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={handleInvoiceDownloadPDFClick}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={handleSendInvoiceClick}
                className={`inline-flex items-center px-4 py-2 rounded-lg ${
                  sendLoading
                    ? 'opacity-50 cursor-not-allowed bg-emerald-600 dark:bg-emerald-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white'
                }`}
                disabled={sendLoading}
              >
                <Send className="h-4 w-4 mr-2" />
                {sendLoading ? 'Sending...' : 'Send Invoice'}
              </button>
            </div>
          )} */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-6">
              <InvoiceForm
                invoice={formData}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/invoices')}
                loading={false} // Set this to true when data is being loaded or processed
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    Save as Draft
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Continue editing later
                  </p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    Save as Template
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reuse for future invoices
                  </p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    Schedule Invoice
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Send at a later date
                  </p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-100">
                      Invoice #1234 paid
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-100">
                      Invoice #1233 viewed
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      5 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Reminder
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-100">
                      Invoice #1234
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      3 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-100">
                      Invoice #1233
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      2 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Integration */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Payment Integration
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://logo.clearbit.com/stripe.com"
                      alt="Stripe"
                      className="w-6 h-6"
                    />
                    <span className="text-gray-800 dark:text-gray-100">
                      Stripe
                    </span>
                  </div>
                  <span className="text-emerald-600 text-sm">Connected</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://logo.clearbit.com/paypal.com"
                      alt="PayPal"
                      className="w-6 h-6"
                    />
                    <span className="text-gray-800 dark:text-gray-100">
                      PayPal
                    </span>
                  </div>
                  <span className="text-blue-600 text-sm">Connect</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://logo.clearbit.com/squareup.com"
                      alt="Square"
                      className="w-6 h-6"
                    />
                    <span className="text-gray-800 dark:text-gray-100">
                      Square
                    </span>
                  </div>
                  <span className="text-blue-600 text-sm">Connect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
