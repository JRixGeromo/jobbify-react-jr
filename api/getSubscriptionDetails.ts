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
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId as string,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    return res.status(200).json(subscriptions);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
} 