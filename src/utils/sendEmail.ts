import axios from 'axios';
import {
  SendQuoteEmailPayload,
  SendInvoiceEmailPayload,
  SendReminderEmailPayload,
  SendQuoteEmailResponse,
  SendInvoiceEmailResponse,
  SendReminderEmailResponse,
} from '@/types/email';

type EmailType = 'quote' | 'invoice' | 'reminder';

type EmailPayload =
  | SendQuoteEmailPayload
  | SendInvoiceEmailPayload
  | SendReminderEmailPayload;

export const sendEmail = async (
  payload: EmailPayload,
  emailType: EmailType
): Promise<
  SendQuoteEmailResponse | SendInvoiceEmailResponse | SendReminderEmailResponse
> => {
  try {
    // Single endpoint since all email types share the same endpoint
    const endpoint = '/api/sendEmail';

    // Add emailType to the payload for the backend to differentiate
    const requestBody = {
      emailType,
      ...payload,
    };
    console.log('response1');
    const response = await axios.post(endpoint, requestBody);
    console.log('response2', response);

    // Validate the response status and structure
    if (response.status === 200 && response.data && response.data.result) {
      // Ensure there's no error in the result
      if (response.data.result.error) {
        throw new Error(response.data.result.error);
      }

      return response.data; // Success
    } else {
      throw new Error(
        `Unexpected response structure: ${JSON.stringify(response.data)}`
      );
    }
  } catch (error: any) {
    console.error(
      `Error sending ${emailType} email:`,
      JSON.stringify(error?.response?.data || error.message, null, 2)
    );
    throw new Error(`Failed to send ${emailType} email`);
  }
};
