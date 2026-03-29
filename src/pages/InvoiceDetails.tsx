import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  User,
  DollarSign,
  Receipt,
  Send,
  Download,
  Copy,
  Clock,
  Eye,
} from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_INVOICE_BY_ID } from '../graphql/queries';
import {
  UPDATE_INVOICE_STATUS,
  SEND_INVOICE_EMAIL,
  CREATE_INVOICE,
} from '../graphql/mutations';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext'; // Import Auth Context
import { handleDownloadInvoicePDF } from '@/utils/handleDownloadInvoicePDF';
import { handleSendInvoice } from '@/utils/handleSendInvoice';
import { handleDuplicateInvoice } from '@/utils/handleDuplicateInvoice';
import { useFetchClients } from '@/hooks/useFetchClient';
import { useFetchServices } from '@/hooks/useFetchServices';
import { saveAs } from 'file-saver';
import { constructPublicUrl } from '@/utils/constructPublicUrl';
import { useLogActivity } from '../utils/loggingService';

interface Item {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
}

export default function InvoiceDetails() {
  const { id } = useParams();
  const { currentUser, companyId } = useAuth(); // Get current user from Auth Context
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [sendLoading, setSendLoading] = useState(false);

  const { data, loading, error } = useQuery(GET_INVOICE_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const [updateInvoiceStatus] = useMutation(UPDATE_INVOICE_STATUS);
  const [sendInvoiceEmail] = useMutation(SEND_INVOICE_EMAIL);
  const [createInvoice, { loading: creatingInvoice }] =
    useMutation(CREATE_INVOICE);

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

  const logActivity = useLogActivity();

  useEffect(() => {
    if (data) {
      const fetchedInvoice = data?.invoicesCollection?.edges[0]?.node;
      if (fetchedInvoice) {
        let parsedItems = [];
        try {
          parsedItems = JSON.parse(fetchedInvoice.items);
        } catch {
          parsedItems = fetchedInvoice.items || [];
        }
        setInvoice({
          ...fetchedInvoice,
          items: parsedItems,

          total: parseFloat(fetchedInvoice.total || '0'),
          subtotal: parseFloat(fetchedInvoice.subtotal || '0'),
          tax_amount: parseFloat(fetchedInvoice.tax_amount || '0'),
          discount_amount: parseFloat(fetchedInvoice.discount_amount || '0'),
        });
      }
    }
  }, [data]);

  if (loading) return <div>Loading invoice details...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!invoice) return <div>Invoice not found</div>;

  const handleMarkAsPaid = async () => {
    try {
      await updateInvoiceStatus({
        variables: { id: invoice.id, status: 'Paid' },
      });
      alert('Invoice marked as paid!');
    } catch (err) {
      console.error('Error marking as paid:', err);
      alert('Failed to mark invoice as paid. Please try again.');
    }
  };

  const handleSendReminder = async () => {
    try {
      setSendLoading(true);
      await sendInvoiceEmail({
        variables: { id: invoice.id, recipient: invoice.clientEmail },
      });
      alert('Reminder sent successfully!');
    } catch (err) {
      console.error('Error sending reminder:', err);
      alert('Failed to send reminder. Please try again.');
    } finally {
      setSendLoading(false);
    }
  };

  const handleDuplicateInvoiceClick = async () => {
    await handleDuplicateInvoice({
      document: invoice, // The invoice data to duplicate
      currentUser, // Current user object
      createDocument: createInvoice, // GraphQL mutation for creating an invoice
      navigate, // React Router navigate function
      documentType: 'invoice', // Type of the document
    });
  };

  const handleInvoiceDownloadPDFClick = async () => {
    await handleDownloadInvoicePDF({
      data: invoice,
      clientMap,
      serviceMap,
      filenamePrefix: 'invoice',
    });
  };

  const handleSendInvoiceClick = async () => {
    await handleSendInvoice(
      invoice,
      clientMap,
      clientEmailMap,
      setSendLoading,
      companyId || '',
      logActivity,
      currentUser
    );
  };

  return (
    <div className="p-6 bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <div className="mb-6">
        <Link
          to="/invoices"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Link>
        <Breadcrumbs />
        <div className="mt-4 flex flex-col md:flex-row justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Invoice Details
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              View and manage invoice information
            </p>
          </div>
          <div className="button-container">
            <button
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => {
                if (invoice?.id) navigate(`/invoices/preview/${invoice.id}`);
                else alert('No invoice to preview.');
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              <span className="button-text">Preview</span>
            </button>
            <button
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={handleDuplicateInvoiceClick}
            >
              <Copy className="h-4 w-4 mr-2" />
              <span className="button-text">Duplicate</span>
            </button>
            <button
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={handleInvoiceDownloadPDFClick}
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="button-text">Download PDF</span>
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
              <span className="button-text">{sendLoading ? 'Sending...' : 'Send Invoice'}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .invoice-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 769px) {
          .invoice-grid {
            grid-template-columns: 2fr 1fr;
          }
        }

        .button-container {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: center;
        }

        @media (max-width: 768px) {
          .button-container {
            flex-direction: row;
            margin-top: 1rem;
            justify-content: flex-start;
          }
        }

        .button-text {
          display: inline;
        }

        @media (max-width: 768px) {
          .button-text {
            display: none;
          }
        }
      `}</style>

      <div className="invoice-grid">
        <div className="space-y-6">
          {/* Invoice Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-purple-100 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-purple-100 dark:border-gray-700 px-6 py-4 bg-purple-50 dark:bg-gray-700">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Invoice Information
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-500 dark:text-gray-400">
                      Service
                    </label>
                    <p className="font-medium text-slate-800 dark:text-gray-100">
                      {serviceMap.get(invoice.service_id) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 dark:text-gray-400">
                      Client
                    </label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <p className="font-medium text-slate-800 dark:text-gray-100">
                        {clientMap.get(invoice.client_id) || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 dark:text-gray-400">
                      Date
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <p className="font-medium text-slate-800 dark:text-gray-100">
                        {invoice.issued_date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-500 dark:text-gray-400">
                      Status
                    </label>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                        invoice.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : invoice.status === 'Overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 dark:text-gray-400">
                      Due Date
                    </label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <p className="font-medium text-slate-800 dark:text-gray-100">
                        {invoice.payment_due_date}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 dark:text-gray-400">
                      Total Amount
                    </label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                      <p className="font-medium text-slate-800 dark:text-gray-100">
                        {invoice.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-purple-100 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-purple-100 dark:border-gray-700 px-6 py-4 bg-purple-50 dark:bg-gray-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">
                Items
              </h2>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-500">
                    <th className="pb-3">Description</th>
                    <th className="pb-3 text-right">Quantity</th>
                    <th className="pb-3 text-right">Unit Price</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item: Item) => (
                    <tr key={item.id}>
                      <td
                        className="py-3"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      ></td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3 text-right">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="text-sm">
                  <tr>
                    <td colSpan={3} className="pt-4 text-right">
                      Subtotal
                    </td>
                    <td className="pt-4 text-right font-medium">
                      ${invoice.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-2 text-right text-slate-500">
                      Discount
                    </td>
                    <td className="pt-2 text-right text-slate-500">
                      -${invoice.discount_amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-2 text-right text-slate-500">
                      Tax
                    </td>
                    <td className="pt-2 text-right text-slate-500">
                      ${invoice.tax_amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-4 text-right font-medium">
                      Total
                    </td>
                    <td className="pt-4 text-right font-bold">
                      ${invoice.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>


          {/* Media Files Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-purple-100 dark:border-gray-700 overflow-hidden mt-6">
            <div className="border-b border-purple-100 dark:border-gray-700 px-6 py-4 bg-purple-50 dark:bg-gray-700">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Media
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {invoice.items.map((item: any, index: number) =>
                item.media && item.media.length > 0 ? (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium text-slate-800 dark:text-gray-100">
                      {item.title || `Item ${index + 1}`}
                    </h3>
                    <ul className="list-disc pl-5 text-slate-600 dark:text-gray-300">
                      {item.media.map((fileUrl: string, fileIndex: number) => (
                        <li key={fileIndex} className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              try {
                                const publicUrl = constructPublicUrl(
                                  'labor-grid',
                                  fileUrl
                                );
                                console.log('Attempting to fetch:', publicUrl);

                                const response = await fetch(publicUrl);
                                if (!response.ok) {
                                  throw new Error(
                                    `Failed to fetch the file: ${response.statusText}`
                                  );
                                }

                                const blob = await response.blob();
                                saveAs(
                                  blob,
                                  fileUrl.split('/').pop() || 'download'
                                );
                              } catch (error) {
                                console.error('Error downloading file:', error);
                                alert(
                                  'Failed to download the file. Please try again.'
                                );
                              }
                            }}
                            className="text-purple-600 hover:underline"
                          >
                            {fileUrl.split('/').pop()}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-purple-100 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-purple-100 dark:border-gray-700 px-6 py-4 bg-purple-50 dark:bg-gray-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">
                Notes & Terms
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-slate-500 dark:text-gray-400">
                  Notes
                </label>
                <p
                  className="mt-1 text-slate-600"
                  dangerouslySetInnerHTML={{ __html: invoice.notes }}
                ></p>
              </div>
              <div>
                <label className="text-sm text-slate-500 dark:text-gray-400">
                  Terms & Conditions
                </label>
                <p className="mt-1 text-slate-600">{invoice.terms}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Activity Section */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <p className="font-medium text-slate-800 dark:text-gray-100">
                  Mark as Paid
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  Record payment received
                </p>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <p className="font-medium text-slate-800 dark:text-gray-100">
                  Send Reminder
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  Send payment reminder
                </p>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <p className="font-medium text-slate-800 dark:text-gray-100">
                  Add Payment
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  Record partial payment
                </p>
              </button>
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

          {/* Payment History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Payment History
            </h3>
            {invoice.paymentDate ? (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                <div>
                  <p className="text-sm text-slate-800">
                    Payment received via {invoice.paymentMethod}
                  </p>
                  <p className="text-xs text-slate-500">
                    {invoice.paymentDate}
                  </p>
                  <p className="text-xs text-slate-500">
                    Ref: {invoice.paymentReference}
                  </p>
                </div>
              </div>
            ) : (
              <p className="font-medium text-gray-800 dark:text-gray-100">
                No payments recorded yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
