// utils/downloadPDF.ts
import html2pdf from 'html2pdf.js';
import { apolloClient } from '@/lib/apollo';
import { GET_COMPANY_PROFILE } from '@/graphql/queries';
import { fetchLogoAsBase64 } from './fetchLogoAsBase64';

interface DownloadPDFParams {
  formData: any;
  clientMap: Map<string, string>;
  serviceMap: Map<string, string>;
  filenamePrefix: string; // Prefix for the PDF file name
  companyId: string; // Add companyId to the interface
}

export const handleDownloadQuotePDF = async ({
  formData,
  clientMap,
  serviceMap,
  filenamePrefix,
  companyId,
}: DownloadPDFParams) => {
  if (!formData) {
    alert('No data available to generate PDF.');
    return;
  }

  // Fetch company data
  const { data: companyData, error: companyError } = await apolloClient.query({
    query: GET_COMPANY_PROFILE,
    variables: { companyId: companyId },
  });

  if (companyError) {
    console.error('Error fetching company data:', companyError);
    return;
  }

  const logoUrl = companyData?.companiesCollection?.edges[0]?.node?.logo_url || '';
  const fullLogoUrl = `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/${logoUrl}`;

  // Fetch the logo as Base64
  const logoBase64 = await fetchLogoAsBase64(fullLogoUrl);

  console.log('Full Logo URL:', fullLogoUrl);
  console.log('Logo Base64:', logoBase64);

  // Ensure formData.items is an array and parse if stringified
  const items = Array.isArray(formData.items)
    ? formData.items
    : JSON.parse(formData.items || '[]');

  // Create the HTML content for the PDF
  const content = `
  <div id="details" style="color: black; line-height: 1.6; font-family: Arial, sans-serif; padding: 20px;">
    ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="Company Logo" style="width: 150px; height: auto; margin-bottom: 20px;" />` : '<p style="color: red;">Logo not available</p>'}
    <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">${clientMap.get(formData.client_id?.toString() || '') || 'Your Company Name'}</h1>
    <h2 style="font-size: 22px; font-weight: bold; margin-bottom: 10px">${filenamePrefix.toUpperCase()} Details</h2>
    <p><strong>Client:</strong> ${clientMap.get(formData.client_id?.toString() || '') || 'N/A'}</p>
    <p><strong>Service:</strong> ${serviceMap.get(formData.service_id?.toString() || '') || 'N/A'}</p>
    <p><strong>Date:</strong> ${formData.date || 'N/A'}</p>
    <p><strong>Due Date:</strong> ${formData.dueDate || 'N/A'}</p>
    <p><strong>Subtotal:</strong> $${formData.subtotal?.toFixed(2) || '0.00'}</p>
    <p><strong>Tax Amount:</strong> $${formData.taxAmount?.toFixed(2) || '0.00'}</p>
    <p><strong>Total:</strong> $${formData.total?.toFixed(2) || '0.00'}</p>
    <hr/>
    <p><strong>Notes:</strong> ${formData.notes || 'N/A'}</p>
    <p><strong>Terms:</strong> ${formData.terms || 'N/A'}</p>
    <p><strong>Status:</strong> ${formData.status || 'N/A'}</p>
    <hr/>
    <h3 style="font-size: 18px; font-weight: bold; margin-top: 10px">Line Items</h3>
    <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; color: black; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f2f2f2; text-align: left;">
          <th style="padding: 8px;">Description</th>
          <th style="padding: 8px;">Quantity</th>
          <th style="padding: 8px;">Unit Price</th>
          <th style="padding: 8px;">Taxable</th>
          <th style="padding: 8px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${
          items.length > 0
            ? items
                .map(
                  (item: any) => `
          <tr>
            <td style="padding: 8px; border: 1px solid black;">${item.description || 'N/A'}</td>
            <td style="padding: 8px; border: 1px solid black;">${item.quantity || '0'}</td>
            <td style="padding: 8px; border: 1px solid black;">$${item.unitPrice?.toFixed(2) || '0.00'}</td>
            <td style="padding: 8px; border: 1px solid black;">${item.taxable ? 'Yes' : 'No'}</td>
            <td style="padding: 8px; border: 1px solid black;">$${(item.unitPrice || 0) * (item.quantity || 0)}</td>
          </tr>`
                )
                .join('')
            : '<tr><td colspan="5" style="padding: 8px; text-align: center;">No items available</td></tr>'
        }
      </tbody>
    </table>
  </div>
`;

  // Create a temporary container to render HTML content
  const container = document.createElement('div');
  container.innerHTML = content;
  document.body.appendChild(container);

  // Generate PDF from HTML content
  await html2pdf(container, {
    margin: 10,
    filename: `${filenamePrefix}_${formData.client_id || 'unnamed'}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  });

  // Remove the container after generating the PDF
  document.body.removeChild(container);
};
