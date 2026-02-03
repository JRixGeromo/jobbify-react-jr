import { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import {
  SendQuoteEmailPayload,
  SendInvoiceEmailPayload,
  SendReminderEmailPayload,
  Attachment,
} from '@/types/email';

import * as dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY as string);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); // Allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle other HTTP methods
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST is allowed' });
  }

  try {
    const { emailType, ...payload } = req.body;

    // Validate `emailType`
    if (!['quote', 'invoice', 'reminder'].includes(emailType)) {
      return res.status(400).json({
        error: 'Invalid emailType. Must be "quote", "invoice", or "reminder".',
      });
    }

    // Validate payload based on emailType
    let clientEmail: string;
    let subject: string;
    let html: string;
    let attachments: Attachment[] | undefined;

    switch (emailType) {
      case 'quote': {
        const {
          clientEmail: quoteEmail,
          subject: quoteSubject,
          html: quoteHtml,
          attachments: quoteAttachments,
        } = payload as SendQuoteEmailPayload;

        if (!quoteEmail || !quoteSubject || !quoteHtml) {
          return res
            .status(400)
            .json({ error: 'Missing required fields for quote email.' });
        }

        clientEmail = quoteEmail;
        subject = quoteSubject;
        html = quoteHtml;
        attachments = quoteAttachments;
        break;
      }
      case 'invoice': {
        const {
          clientEmail: invoiceEmail,
          subject: invoiceSubject,
          html: invoiceHtml,
          attachments: invoiceAttachments,
          invoice,
        } = payload as SendInvoiceEmailPayload;

        if (!invoiceEmail || !invoiceSubject || !invoiceHtml || !invoice) {
          return res
            .status(400)
            .json({ error: 'Missing required fields for invoice email.' });
        }

        clientEmail = invoiceEmail;
        subject = invoiceSubject;
        html = invoiceHtml; // Use only the rendered HTML from the template
        attachments = invoiceAttachments; // Ensure attachments are properly formatted
        break;
      }
      case 'reminder': {
        const {
          clientEmail: reminderEmail,
          subject: reminderSubject,
          html: reminderHtml,
          metadata,
          reminderId,
        } = payload as SendReminderEmailPayload;

        if (
          !reminderEmail ||
          !reminderSubject ||
          !reminderHtml ||
          !reminderId
        ) {
          return res
            .status(400)
            .json({ error: 'Missing required fields for reminder email.' });
        }

        clientEmail = reminderEmail;
        subject = reminderSubject;
        html = `${reminderHtml}<p>Reminder ID: ${reminderId}</p>`;
        if (metadata?.dueDate) {
          html += `<p>Due Date: ${metadata.dueDate}</p>`;
        }
        if (metadata?.amountDue) {
          html += `<p>Amount Due: $${metadata.amountDue.toFixed(2)}</p>`;
        }
        break;
      }
      default:
        return res.status(400).json({ error: 'Unhandled emailType.' });
    }

    // Prepare the attachments for the email
    if (attachments) {
      attachments = attachments.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content, // Ensure this is a Base64 string
        contentType: attachment.contentType || 'application/octet-stream', // Default MIME type
      }));
    }

    // Send the email using Resend
    const result = await resend.emails.send({
      from: 'no-reply@jobbify.com.au', // onboarding@resend.dev
      to: clientEmail,
      subject,
      html,
      attachments,
    });

    console.log('Resend response', result);
    return res.status(200).json({ message: `${emailType} email sent`, result });
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
