import React, { useEffect, useState } from 'react';
import { GET_QUOTE_BY_ID, GET_LOGS_BY_ENTITY_ID_QUERY } from '../graphql/queries';
import {
  CREATE_QUOTE,
  UPDATE_QUOTE_STATUS,
  CREATE_INVOICE,
} from '../graphql/mutations'; // Ensure queries/mutations exist

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  ArrowLeft,
  Calendar,
  User,
  DollarSign,
  FileText,
  Send,
  Download,
  Copy,
  Eye,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext'; // Import Auth Context
import { handleDownloadQuotePDF } from '@/utils/handleDownloadQuotePDF';
import { handleDuplicateQuote } from '@/utils/handleDuplicateQuote';
import { handleSendQuote } from '@/utils/handleSendQuote';

import { useFetchClients } from '@/hooks/useFetchClient';
import { useFetchServices } from '@/hooks/useFetchServices';
import { saveAs } from 'file-saver';
import { constructPublicUrl } from '@/utils/constructPublicUrl';
import { useLogActivity } from '../utils/loggingService';

interface Item {
  description: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
}

export default function QuoteDetails() {
  const { id } = useParams();
  const { currentUser, companyId } = useAuth(); // Get current user from Auth Context
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_QUOTE_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const [quote, setQuote] = useState<any>(null);
  const [sendLoading, setSendLoading] = useState(false);
  const [createQuote] = useMutation(CREATE_QUOTE); // For duplicating the quote
  const [updateQuoteStatus, { loading: updatingStatus }] =
    useMutation(UPDATE_QUOTE_STATUS);

  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [createInvoice] = useMutation(CREATE_INVOICE);

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

  const { data: logsData, loading: logsLoading, error: logsError } = useQuery(GET_LOGS_BY_ENTITY_ID_QUERY, {
    variables: { entityId: id },
    skip: !id,
  });

  const logs = logsData?.logsCollection?.edges.map((edge: any) => edge.node) || [];

  // Ensure companyId is a string
  const safeCompanyId = companyId || '';

  const logActivity = useLogActivity();

  useEffect(() => {
    if (data) {
      const fetchedQuote = data?.quotesCollection?.edges[0]?.node;

      if (fetchedQuote) {
        let parsedItems = [];
        try {
          parsedItems = JSON.parse(fetchedQuote.items);
        } catch {
          parsedItems = fetchedQuote.items || [];
        }

        const subtotal = parsedItems.reduce((acc: number, item: Item) => acc + (item.quantity * item.unitPrice), 0);
        const discountAmount = fetchedQuote.discount_amount || 0;
        const taxAmount = fetchedQuote.tax_amount || 0;
        const total = subtotal - discountAmount + taxAmount;

        console.log('Fetched Quote:', fetchedQuote);
        console.log('Subtotal:', subtotal);
        console.log('Discount Amount:', discountAmount);
        console.log('Tax Amount:', taxAmount);
        console.log('Total:', total);

        setQuote({
          ...fetchedQuote,
          items: parsedItems,
          subtotal,
          discountAmount,
          taxAmount,
          total
        });
      }
    }
  }, [data]);

  if (loading) return <div>Loading quote details...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!quote) return <div>Quote not found. Please try again.</div>;

  const activity = logs.map((log: any) => ({
    message: log.message,
    time: new Date(log.timestamp).toLocaleString(),
    color: 'purple',
  }));

  const handleMarkAsAccepted = async () => {
    if (!id) {
      alert('Quote ID is missing.');
      return;
    }

    try {
      await updateQuoteStatus({
        variables: {
          id,
          status: 'Accepted',
        },
      });

      await logActivity({
        level: 'INFO',
        message: 'Quote marked as Accepted',
        userId: currentUser?.id || '',
        entity: 'Quote',
        entityId: id,
        source: 'Frontend',
        meta: { status: 'Accepted' },
      });

      alert('Quote marked as Accepted!');
      // refetch(); // Refetch data to update the UI with the latest status
    } catch (err) {
      console.error('Error marking as accepted:', err);
      alert('Failed to mark the quote as Accepted. Please try again.');
    }
  };

  const handleConvertToJob = () => {
    console.log('Converted to job');
  };

  const handleSendQuoteClick = async () => {
    await handleSendQuote(
      quote,
      clientMap,
      clientEmailMap,
      setSendLoading,
      safeCompanyId,
      logActivity,
      currentUser
    );
  };

  const handleDownloadQuotePDFClick = async () => {
    await handleDownloadQuotePDF({
      formData: quote,
      clientMap,
      serviceMap,
      filenamePrefix: 'quote',
      companyId: safeCompanyId
    });
  };

  const duplicateQuoteClick = async () => {
    await handleDuplicateQuote({
      formData: quote,
      currentUser: currentUser,
      createQuote: createQuote,
      navigate,
    });
  };

  const handleCreateInvoice = async () => {
    if (!quote) {
      alert('No quote found.');
      return;
    }

    try {
      setCreatingInvoice(true);

      //const items = quote.items ? quote.items : '[]';
      const items = quote.items ? JSON.stringify(quote.items) : '[]';

      if (!currentUser) {
        throw new Error('User is not authenticated.');
      }
      const input = {
        quote_id: quote.id,
        company_id: parseInt(safeCompanyId, 10), // Fallback for companyId
        created_by: currentUser.id, // Now TypeScript knows currentUser is not null
        invoice_number: `INV-${Date.now()}`,
        issued_date: new Date().toISOString().split('T')[0],
        payment_due_date: new Date(
          new Date().setDate(new Date().getDate() + 30)
        )
          .toISOString()
          .split('T')[0],
        total: quote.total.toString(),
        notes: quote.notes,
        terms: quote.terms,
        client_id: quote.client_id,
        service_id: quote.service_id,
        items, // Serialized items
      };

      console.log(input);

      const { data } = await createInvoice({ variables: { input } });

      if (data?.insertIntoinvoicesCollection?.records?.length > 0) {
        alert('Invoice created successfully!');
        navigate('/invoices');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice.');
    } finally {
      setCreatingInvoice(false);
    }
  };

  return (
    <div className="p-6 bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/quotes"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-500 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quotes
        </Link>
        <Breadcrumbs />
        <div className="mt-4 flex flex-col md:flex-row justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Quote Details
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              View and manage quote information
            </p>
          </div>
          <div className="button-container flex flex-row flex-wrap md:flex-nowrap gap-3 mt-4 md:mt-0">
            <button
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => {
                if (quote?.id) navigate(`/quotes/preview/${quote.id}`);
                else alert('No quote to preview.');
              }}
            >
              <Eye className="h-4 w-4 mr-2 md:hidden" />
              <span className="hidden md:inline">Preview</span>
            </button>
            <button
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={duplicateQuoteClick}
            >
              <Copy className="h-4 w-4 mr-2 md:hidden" />
              <span className="hidden md:inline">Duplicate</span>
            </button>
            <button
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={handleDownloadQuotePDFClick}
            >
              <Download className="h-4 w-4 mr-2 md:hidden" />
              <span className="hidden md:inline">Download PDF</span>
            </button>
            <button
              onClick={handleSendQuoteClick}
              className={`inline-flex items-center px-4 py-2 rounded-lg ${
                sendLoading
                  ? 'opacity-50 cursor-not-allowed bg-emerald-600 dark:bg-emerald-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white'
              }`}
              disabled={sendLoading}
            >
              <Send className="h-4 w-4 mr-2 md:hidden" />
              <span className="hidden md:inline">{sendLoading ? 'Sending...' : 'Send Quote'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Quote Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-purple-100 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-purple-100 dark:border-gray-700 px-6 py-4 bg-purple-50 dark:bg-gray-700">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Quote Information
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-slate-500 dark:text-gray-400">
                    Service
                  </label>
                  <p className="font-medium text-slate-800 dark:text-gray-100">
                    {serviceMap.get(quote.service_id) || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-500 dark:text-gray-400">
                    Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      quote.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : quote.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-slate-500 dark:text-gray-400">
                    Client
                  </label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                    <p className="font-medium text-slate-800 dark:text-gray-100">
                      {clientMap.get(quote.client_id) || 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-500 dark:text-gray-400">
                    Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                    <p className="font-medium text-slate-800 dark:text-gray-100">
                      {new Date(quote.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-500 dark:text-gray-400">
                    Due Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                    <p className="font-medium text-slate-800 dark:text-gray-100">
                      {new Date(quote.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-500 dark:text-gray-400">
                    Total Amount
                  </label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                    <p className="font-medium text-slate-800 dark:text-gray-100">
                      {quote.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
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
              {quote.items.map((item: any, index: number) =>
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

          {/* Items Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-purple-100 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-purple-100 dark:border-gray-700 px-6 py-4 bg-purple-50 dark:bg-gray-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">
                Items
              </h2>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-500 dark:text-gray-400">
                    <th className="pb-3">Description</th>
                    <th className="pb-3 text-right">Quantity</th>
                    <th className="pb-3 text-right">Unit Price</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
                  {quote.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-3 text-slate-800 dark:text-gray-100">
                        <span
                          className="mt-1 text-slate-600 dark:text-gray-300"
                          dangerouslySetInnerHTML={{ __html: quote.notes }}
                        ></span>
                      </td>

                      <td className="py-3 text-right text-slate-800 dark:text-gray-100">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right text-slate-800 dark:text-gray-100">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3 text-right text-slate-800 dark:text-gray-100">
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
                      ${quote.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="pt-2 text-right text-slate-500 dark:text-gray-400"
                    >
                      Discount
                    </td>
                    <td className="pt-2 text-right text-slate-500 dark:text-gray-400">
                      -${quote.discountAmount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="pt-2 text-right text-slate-500 dark:text-gray-400"
                    >
                      Tax
                    </td>
                    <td className="pt-2 text-right text-slate-500 dark:text-gray-400">
                      ${quote.taxAmount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-4 text-right font-medium">
                      Total
                    </td>
                    <td className="pt-4 text-right font-bold">
                      ${quote.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
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
                <div
                  className="mt-1 text-slate-600 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: quote.notes }}
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 dark:text-gray-400">
                  Terms & Conditions
                </label>
                <div
                  className="mt-1 text-slate-600 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: quote.terms }}
                />
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
              <button
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={handleMarkAsAccepted}
              >
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  Mark as Accepted
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update quote status
                </p>
              </button>
              <button
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={handleConvertToJob}
              >
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  Convert to Job
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create job from quote
                </p>
              </button>
              <button
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={handleCreateInvoice}
              >
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  Create Invoice
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generate invoice from quote
                </p>
              </button>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Recent Activity
            </h3>
            {logsLoading ? (
              <p>Loading activity...</p>
            ) : logsError ? (
              <p>Error loading activity: {logsError.message}</p>
            ) : activity.length > 0 ? (
              activity.map((event: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full bg-${event.color}-500 dark:bg-${event.color}-300 mt-2`} />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-100">{event.message}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{event.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

<style>{`
  /* Original styles can be restored here if needed */
`}</style>
