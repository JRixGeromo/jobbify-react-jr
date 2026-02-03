import React from 'react';
import { format } from 'date-fns';

interface QuotePreviewProps {
  quote: any; // Replace `any` with the actual Quote type if available
  lineItems: any[]; // Replace `any` with the actual type for line items if available
  onClose: () => void; // Callback to close the modal
}

export function PreviewQuoteModal({
  quote,
  lineItems,
  onClose,
}: QuotePreviewProps) {
  if (!quote) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full p-6">
        <h2 className="text-xl font-bold mb-4">Quote Preview</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Close
        </button>
        <div className="space-y-4">
          <p>
            <strong>Client:</strong> {quote.client}
          </p>
          <p>
            <strong>Service:</strong> {quote.service}
          </p>
          <p>
            <strong>Date:</strong> {format(new Date(quote.date), 'yyyy-MM-dd')}
          </p>
          <p>
            <strong>Due Date:</strong>{' '}
            {format(new Date(quote.dueDate), 'yyyy-MM-dd')}
          </p>
          <p>
            <strong>Subtotal:</strong> ${quote.subtotal.toFixed(2)}
          </p>
          <p>
            <strong>Tax Amount:</strong> ${quote.taxAmount.toFixed(2)}
          </p>
          <p>
            <strong>Total:</strong> ${quote.total.toFixed(2)}
          </p>
          <p>
            <strong>Notes:</strong> {quote.notes}
          </p>
          <p>
            <strong>Terms:</strong> {quote.terms}
          </p>
          <p>
            <strong>Status:</strong> {quote.status}
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Line Items</h3>
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
                    <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                      {item.description}
                    </td>
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
  );
}
