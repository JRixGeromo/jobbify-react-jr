import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ error: 'Missing customer ID' });
  }

  try {
    const payments = await stripe.paymentIntents.list({
      customer: customerId as string,
      limit: 10,
    });

    return res.status(200).json(payments);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
} 