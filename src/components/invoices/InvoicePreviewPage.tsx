import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_INVOICE_BY_ID } from '@/graphql/queries'; // Replace with the actual query for fetching invoices
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useFetchClients } from '@/hooks/useFetchClient';
import { useFetchServices } from '@/hooks/useFetchServices';
import { useAuth } from '@/contexts/AuthContext';

export default function InvoicePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { companyId } = useAuth(); // Get companyId from auth context
  const { data, loading, error } = useQuery(GET_INVOICE_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const { clients } = useFetchClients(companyId);
  const { services } = useFetchServices(companyId);

  const [invoice, setInvoice] = useState<any>(null);
  const [lineItems, setLineItems] = useState<any[]>([]);

  // Map client_id and service_id to their respective names
  const clientMap = new Map(
    clients.map((client) => [client.id, `${client.first_name} ${client.last_name}`])
  );
  const serviceMap = new Map(
    services.map((service) => [service.id, service.name])
  );

  useEffect(() => {
    if (data) {
      const fetchedInvoice = data.invoicesCollection.edges[0]?.node;
      if (fetchedInvoice) {
        setInvoice(fetchedInvoice);

        try {
          const parsedItems =
            typeof fetchedInvoice.items === 'string'
              ? JSON.parse(fetchedInvoice.items)
              : Array.isArray(fetchedInvoice.items)
                ? fetchedInvoice.items
                : [];
          setLineItems(parsedItems);
        } catch (err) {
          console.error('Error parsing items:', err);
          setLineItems([]);
        }
      }
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 flex items-center justify-center">
        Loading invoice details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 flex items-center justify-center">
        Error fetching invoice: {error.message}
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 flex items-center justify-center">
        Invoice not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate('/invoices')}
          className="inline-flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </button>

        <h1 className="text-2xl font-bold mt-4 mb-6">Invoice Preview</h1>

        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-semibold">
            Client: {clientMap.get(invoice.client_id) || 'N/A'}
          </h2>
          <p>Service: {serviceMap.get(invoice.service_id) || 'N/A'}</p>
          <p>
            Issued Date: {format(new Date(invoice.issued_date), 'yyyy-MM-dd')}
          </p>
          <p>
            Due Date: {format(new Date(invoice.payment_due_date), 'yyyy-MM-dd')}
          </p>
          <p>
            Subtotal: $
            {typeof invoice?.subtotal === 'number'
              ? invoice.subtotal.toFixed(2)
              : parseFloat(invoice?.subtotal || '0').toFixed(2)}
          </p>
          <p>
            Tax Amount: $
            {typeof invoice?.tax_amount === 'number'
              ? invoice.tax_amount.toFixed(2)
              : parseFloat(invoice?.tax_amount || '0').toFixed(2)}
          </p>

          <p>
            Total: $
            {Number(invoice?.total) || Number(invoice?.total) === 0
              ? Number(invoice.total).toFixed(2)
              : '0.00'}
          </p>
          <p>Notes: {invoice.notes}</p>
          <p>Terms: {invoice.terms}</p>
          <p>Status: {invoice.status}</p>

          <div>
            <h3 className="text-lg font-semibold mt-6 mb-4">Line Items</h3>
            {lineItems.length > 0 ? (
              <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-600">
                <thead>
                  <tr>
                    <th className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                      Description
                    </th>
                    <th className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                      Quantity
                    </th>
                    <th className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                      Unit Price
                    </th>
                    <th className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                      Taxable
                    </th>
                    <th className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => (
                    <tr key={index}>
                      <td
                        className="border border-gray-200 dark:border-gray-600 px-4 py-2"
                        dangerouslySetInnerHTML={{
                          __html: item.description || 'N/A',
                        }}
                      ></td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                        {item.taxable ? 'Yes' : 'No'}
                      </td>
                      <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No line items available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
