import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_QUOTE, UPDATE_QUOTE } from '../graphql/mutations'; // Ensure the mutations exist
import { GET_QUOTE_BY_ID, GET_LOGS_BY_ENTITY_ID_QUERY } from '../graphql/queries'; // Ensure the query exists
import { Quote } from '../types/quotes';
import { QuoteForm } from '../components/quotes/QuoteForm';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ArrowLeft, Send, Download, Copy, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Import Auth Context
import { handleSendQuote } from '@/utils/handleSendQuote';
import { useFetchClients } from '@/hooks/useFetchClient';
import { useFetchServices } from '@/hooks/useFetchServices';
import { handleDuplicateQuote } from '@/utils/handleDuplicateQuote';
import { handleDownloadQuotePDF } from '@/utils/handleDownloadQuotePDF';

import html2pdf from 'html2pdf.js';

// Define the type for each item in the items array
interface Item {
  description: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
}

export interface SendQuoteEmailResponse {
  success: boolean;
}

export default function CreateQuotePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the id from the URL
  const { currentUser, companyId } = useAuth(); // Get current user from Auth Context
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Quote> | null>(null);
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
  } = useQuery(GET_QUOTE_BY_ID, {
    variables: { id },
    skip: !id, // Skip fetching if no id is provided
  });
  const [createQuote, { loading: createLoading }] = useMutation(CREATE_QUOTE);
  const [updateQuote, { loading: updateLoading }] = useMutation(UPDATE_QUOTE);

  const { data: logsData, loading: logsLoading, error: logsError } = useQuery(GET_LOGS_BY_ENTITY_ID_QUERY, {
    variables: { entityId: id },
    skip: !id,
  });

  const logs = logsData?.logsCollection?.edges.map((edge: any) => edge.node) || [];

  useEffect(() => {
    if (id && data) {
      setIsEditMode(true);
      setFormData(data?.quotesCollection?.edges[0]?.node || null); // Load quote details into formData
    }
  }, [id, data]);

  const handleSubmit = async (data: Partial<Quote>) => {
    try {
      if (!currentUser) {
        throw new Error('User is not authenticated.');
      }

      const input = {
        client_id: data.client_id,
        service_id: data.service_id,
        date: data.date,
        due_date: data.dueDate,
        items: JSON.stringify(data.items), // Assuming backend expects a string
        subtotal: data.subtotal,
        tax_rate: data.taxRate,
        tax_amount: data.taxAmount,
        discount_type: data.discountType,
        discount_value: data.discountValue,
        discount_amount: data.discountAmount,
        total: data.total,
        notes: data.notes,
        terms: data.terms,
        status: data.status,
        company_id: currentUser.user_metadata.company_id, // Set the company_id
        created_by: currentUser.id, // Set the created_by field
      };
      if (isEditMode) {
        await updateQuote({ variables: { id, input } });
        alert('Quote updated successfully!');
      } else {
        await createQuote({ variables: { input } });
        alert('Quote created successfully!');
      }
      navigate('/quotes');
    } catch (err) {
      console.error('Error saving quote:', err);
      alert('Error saving quote. Please try again.');
    }
  };

  const handleDownloadQuotePDFClick = async () => {
    await handleDownloadQuotePDF({
      formData: formData,
      clientMap,
      serviceMap,
      filenamePrefix: 'quote',
      companyId: companyId || ''
    });
  };

  // Pass required arguments
  const duplicateQuoteClick = async () => {
    await handleDuplicateQuote({
      formData: formData,
      currentUser: currentUser,
      createQuote: createQuote,
      navigate,
    });
  };

  // const handleSendInvoice = async () => {
  //   if (!formData?.id) {
  //     alert('No invoice available to send.');
  //     return;
  //   }

  //   try {
  //     setSendLoading(true);

  //     // Ensure formData.items is an array
  //     const invoiceItems = Array.isArray(formData.items)
  //       ? formData.items.map((item: any) => ({
  //           description: item.description || 'No description provided',
  //           quantity: item.quantity || 1,
  //           price: item.price || 0, // Ensure price is included
  //         }))
  //       : []; // Fallback to an empty array if items is not an array

  //     // Construct the invoice email payload
  //     const emailPayload: SendInvoiceEmailPayload = {
  //       clientEmail: 'jrixhomebased@gmail.com', // Replace with the actual client email
  //       subject: `Invoice #${formData.id}`,
  //       html: `
  //         <h1>Invoice Details</h1>
  //         <p><strong>Client:</strong> ${
  //           clientMap.get(formData.client_id?.toString() || '') || 'N/A'
  //         }</p>
  //         <p><strong>Total:</strong> $${formData.total || '0.00'}</p>
  //         <p><strong>Invoice Date:</strong> ${formData.date || 'N/A'}</p>
  //         <p><strong>Due Date:</strong> ${formData.dueDate || 'N/A'}</p>
  //       `,
  //       metadata: {
  //         invoiceId: formData.id,
  //       },
  //       invoice: {
  //         id: formData.id,
  //         date: formData.date || new Date().toISOString(),
  //         dueDate: formData.dueDate || 'N/A',
  //         amount: formData.total || 0,
  //         currency: 'USD', // Replace with dynamic currency if available
  //         items: invoiceItems, // Use the mapped items
  //       },
  //     };

  //     // Call the sendEmail utility function
  //     console.log("before");
  //     const response = await sendEmail(emailPayload, 'invoice');
  //     console.log("response", response);

  //     // Check the response structure
  //     if (response && response.result && !response.result.error) {
  //       alert('Invoice sent successfully!');
  //     } else if (response?.result?.error) {
  //       alert(`Failed to send the invoice. Error: ${response.result.error}`);
  //     } else {
  //       alert('Failed to send the invoice. Unknown error occurred.');
  //     }
  //   } catch (error) {
  //     console.error('Error sending invoice:', error);
  //     alert('Failed to send the invoice. Please try again.');
  //   } finally {
  //     setSendLoading(false);
  //   }
  // };

  // Inside your component
  const handleSendQuoteClick = async () => {
    if (!companyId) {
      alert('Company ID is missing. Please check your account settings.');
      return;
    }
    await handleSendQuote(formData, clientMap, clientEmailMap, setSendLoading, companyId);
  };

  if (queryLoading) return <div>Loading...</div>;
  if (queryError) return <div>Error loading quote: {queryError.message}</div>;

  const handleMarkAsAccepted = () => {
    console.log('Marked as accepted');
  };

  const handleConvertToJob = () => {
    console.log('Converted to job');
  };

  const handleCreateInvoice = () => {
    console.log('Created invoice');
  };

  return (
    <div className="min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/quotes')}
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quotes
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
                    navigate(`/quotes/preview/${formData.id}`);
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
                onClick={duplicateQuoteClick}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </button>
              <button
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={handleDownloadQuotePDFClick}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
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
                <Send className="h-4 w-4 mr-2" />
                {sendLoading ? 'Sending...' : 'Send Quote'}
              </button>
            </div>
          )} */}
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-6">
              <QuoteForm
                quote={formData}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/quotes')}
                loading={createLoading || updateLoading}
              />
              {(createLoading || updateLoading) && (
                <p className="text-gray-500 dark:text-gray-400 mt-4">
                  Saving quote...
                </p>
              )}
            </div>
          </div>

          {/* Sidebar: Quick Actions and Other Sections */}
          <div className="space-y-6 md:order-none order-last">
            {/* Quick Actions */}

            {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
            </div> */}

            {/* Other Sidebar Sections */}
            {isEditMode && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Recent Activity
                </h3>
                {logsLoading ? (
                  <p>Loading activity...</p>
                ) : logsError ? (
                  <p>Error loading activity: {logsError.message}</p>
                ) : logs.length > 0 ? (
                  logs.map((log: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-300 mt-2" />
                      <div>
                        <p className="text-sm text-gray-800 dark:text-gray-100">{log.message}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No recent activity.</p>
                )}
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Quote Templates
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    Basic Service Quote
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last used 2 days ago
                  </p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    Premium Package
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last used 1 week ago
                  </p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    Maintenance Contract
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last used 2 weeks ago
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
