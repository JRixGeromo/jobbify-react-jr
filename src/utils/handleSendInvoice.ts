import React from 'react';
import { SendInvoiceEmailPayload } from '@/types/email';
import { sendEmail } from '@/utils/sendEmail';
import html2pdf from 'html2pdf.js';
import InvoiceEmailTemplate from '@/components/emails/InvoiceEmailTemplate';
import ReactDOMServer from 'react-dom/server';
import { toast } from 'sonner';
import { apolloClient } from '@/lib/apollo';
import { GET_COMPANY_PROFILE } from '@/graphql/queries';
import { fetchLogoAsBase64 } from './fetchLogoAsBase64';

// Assuming VITE_SUPABASE_STORAGE_URL is your base URL for storage
const baseUrl = import.meta.env.VITE_SUPABASE_STORAGE_URL;

export const handleSendInvoice = async (
  formData: any,
  clientMap: Map<string, string>,
  clientEmailMap: Map<string, string>,
  setSendLoading: React.Dispatch<React.SetStateAction<boolean>>,
  companyId: string,
  logActivity: (logDetails: any) => Promise<void>,
  currentUser: any
) => {
  if (!formData?.id) {
    alert('No invoice available to send.');
    return;
  }

  try {
    setSendLoading(true);

    // Fetch company data
    const { data: companyData, error: companyError } = await apolloClient.query({
      query: GET_COMPANY_PROFILE,
      variables: { companyId },
    });

    if (companyError) {
      console.error('Error fetching company data:', companyError);
      return;
    }

    const logoUrl = companyData?.companiesCollection?.edges[0]?.node?.logo_url || '';
    const fullLogoUrl = `${baseUrl}/${logoUrl}`;

    // Fetch the logo as Base64
    const logoBase64 = await fetchLogoAsBase64(fullLogoUrl);

    // Ensure formData.items is an array
    const invoiceItems = Array.isArray(formData.items)
      ? formData.items.map((item: any) => ({
          description: item.description || 'No description provided',
          quantity: item.quantity || 1,
          price: item.unitPrice || 0,
        }))
      : [];

    // Generate the PDF invoice
    const generatePDF = async () => {
      const container = document.createElement('div');

      container.innerHTML = `
        <div style="color: black; font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
          <!-- Embed the Base64 logo directly -->
          ${
            logoBase64
              ? `<img src="data:image/png;base64,${logoBase64}" alt="Company Logo" style="width: 150px; height: auto; margin-bottom: 20px;" />`
              : `<p style="color: red;">Logo not available</p>` // Fallback if Base64 conversion fails
          }
          <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">${
            clientMap.get(formData.client_id?.toString() || '') || 'Your Company Name'
          }</h1>
          <h2>Invoice Details</h2>
          <p><strong>Client:</strong> ${
            clientMap.get(formData.client_id?.toString() || '') || 'N/A'
          }</p>
          <p><strong>Total:</strong> $${formData.total || '0.00'}</p>
          <p><strong>Invoice Date:</strong> ${formData.date || 'N/A'}</p>
          <p><strong>Due Date:</strong> ${formData.dueDate || 'No due date specified'}</p>
          <h3 style="margin-bottom: 10px;">Items:</h3>
          <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse; border: 1px solid black; margin-top: 10px;">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceItems
                .map(
                  (item: any) =>
                    `<tr>
                      <td style="border: 1px solid black;">${item.description}</td>
                      <td style="border: 1px solid black;">${item.quantity}</td>
                      <td style="border: 1px solid black;">$${item.price.toFixed(2)}</td>
                      <td style="border: 1px solid black;">$${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `;

      return await html2pdf()
        .set({
          margin: 1,
          filename: `Invoice_${formData.id}.pdf`,
          html2canvas: { scale: 2 }, // High-quality rendering
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        })
        .from(container)
        .outputPdf('datauristring');
    };

    const pdfDataUri = await generatePDF();
    const pdfBase64 = pdfDataUri.split(',')[1]; // Extract the Base64 data from the Data URI

    // Prepare the email with the fetched logoUrl
    const emailHTML = ReactDOMServer.renderToStaticMarkup(
      React.createElement(InvoiceEmailTemplate, {
        quoteId: formData.quoteId || 'N/A',
        companyId: formData.companyId || 'N/A',
        invoiceNumber: formData.id,
        issuedDate: formData.date || 'N/A',
        paymentDue: formData.dueDate || 'N/A',
        status: formData.status || 'N/A',
        paymentMethod: formData.paymentMethod || 'N/A',
        amountPaid: formData.amountPaid || 'N/A',
        balanceDue: formData.balanceDue || 'N/A',
        paymentReference: formData.paymentReference || 'N/A',
        isFinalized: formData.isFinalized || 'N/A',
        currency: formData.currency || 'USD',
        total: formData.total || 0,
        notes: formData.notes || 'N/A',
        terms: formData.terms || 'N/A',
        createdAt: formData.createdAt || 'N/A',
        updatedAt: formData.updatedAt || 'N/A',
        createdBy: formData.createdBy || 'N/A',
        items: invoiceItems,
        logoUrl: fullLogoUrl,
      })
    );

    // Construct the invoice email payload using rendered HTML
    const emailPayload: SendInvoiceEmailPayload = {
      clientEmail: clientEmailMap.get(formData.client_id?.toString() || '') || 'default@example.com',
      subject: `Invoice #${formData.id}`,
      html: emailHTML,
      metadata: {
        invoiceId: formData.id,
      },
      invoice: {
        id: formData.id,
        date: formData.date || new Date().toISOString(),
        dueDate: formData.dueDate || 'No due date specified',
        amount: formData.total || 0,
        currency: 'USD',
        items: invoiceItems,
      },
      attachments: [
        {
          filename: `Invoice_${formData.id}.pdf`,
          content: pdfBase64,
          encoding: 'base64',
        },
        {
          filename: 'logo.png',
          content: logoBase64,
          encoding: 'base64',
        },
      ],
    };

    // Handle invalid email
    if (!emailPayload.clientEmail) {
      toast.error('Client email not found.');
      return;
    }

    // Call the sendEmail utility function
    const response = await sendEmail(emailPayload, 'invoice');

    if (response && response.result && !response.result.error) {
      toast.success('Invoice sent successfully!');
      await logActivity({
        level: 'INFO',
        message: 'Invoice sent by email',
        userId: currentUser.id,
        entity: 'Invoice',
        entityId: formData.id,
        source: 'EmailService',
        meta: { clientEmail: emailPayload.clientEmail },
      });
    } else if (response?.result?.error) {
      toast.error(`Failed to send the invoice. Error: ${response.result.error}`);
    } else {
      toast.error('Failed to send the invoice. Unknown error occurred.');
    }
  } catch (error) {
    console.error('Error sending invoice:', error);
    alert('Failed to send the invoice. Please try again.');
  } finally {
    setSendLoading(false);
  }
};
