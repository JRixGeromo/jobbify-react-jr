// utils/sendQuote.ts

import { SendQuoteEmailPayload } from '@/types/email';
import { sendEmail } from '@/utils/sendEmail';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import QuoteEmailTemplate from '@/components/emails/QuoteEmailTemplate';
import { toast } from 'sonner';
import { apolloClient } from '@/lib/apollo';
import { GET_COMPANY_PROFILE } from '@/graphql/queries';

const baseUrl = import.meta.env.VITE_SUPABASE_STORAGE_URL;

export const handleSendQuote = async (
  formData: any,
  clientMap: Map<string, string>,
  clientEmailMap: Map<string, string>,
  setSendLoading: React.Dispatch<React.SetStateAction<boolean>>,
  companyId: string,
  logActivity: (logDetails: any) => Promise<void>,
  currentUser: any
) => {
  if (!formData?.id) {
    alert('No quote available to send.');
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

    // Construct the quote email payload
    const emailHtml = ReactDOMServer.renderToStaticMarkup(
      React.createElement(QuoteEmailTemplate, {
        clientName: clientMap.get(formData.client_id?.toString() || '') || 'N/A',
        quoteNumber: formData.id.toString(),
        amountDue: formData.total || 0,
        dueDate: formData.date || 'N/A',
        subtotal: formData.subtotal || 0,
        taxAmount: formData.taxAmount || 0,
        discountAmount: formData.discountAmount || 0,
        items: formData.items || [],
        notes: formData.notes || 'N/A',
        terms: formData.terms || 'N/A',
        total: formData.total || 0,
        logoUrl: fullLogoUrl,
      })
    );

    const emailPayload: SendQuoteEmailPayload = {
      clientEmail: clientEmailMap.get(formData.client_id?.toString() || '') || 'jrixgeromo@gmail.com',
      subject: `Quote #${formData.id}`,
      html: emailHtml,
      metadata: {
        quoteId: formData.id,
      },
    };

    // Call the sendEmail utility function
    const response = await sendEmail(emailPayload, 'quote');

    if (response && response.result && !response.result.error) {
      toast.success('Quote sent successfully!');
      await logActivity({
        level: 'INFO',
        message: 'Quote sent by email',
        userId: currentUser.id, // Add userId if available
        entity: 'Quote',
        entityId: formData.id,
        source: 'EmailService',
        meta: { clientEmail: emailPayload.clientEmail },
      });
    } else if (response?.result?.error) {
      alert(`Failed to send the quote. Error: ${response.result.error}`);
    } else {
      alert('Failed to send the quote. Unknown error occurred.');
    }
  } catch (error) {
    console.error('Error sending quote:', error);
    alert('Failed to send the quote. Please try again.');
  } finally {
    setSendLoading(false);
  }
};
