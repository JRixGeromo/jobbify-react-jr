import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
});

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.VITE_SUPABASE_ANON_KEY as string
);


export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GRAPHQL_ENDPOINT || !process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Missing required environment variables' });
  }

  console.log('Request Body:', req.body);
  
  try {
    const { priceId, customerId, successUrl, cancelUrl } = req.body;
    console.log('priceId:', priceId);
    console.log('customerId:', customerId);
    const authHeader = req.headers.authorization;

    // Validate request body
    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'Missing required fields: priceId, successUrl, or cancelUrl.',
      });
    }

    // Get user from auth token
    let userId = 'anonymous';
    let userEmail = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error) {
        console.error('Error getting user:', error);
      } else if (user) {
        userId = user.id;
        userEmail = user.email;
      }
    }

    // Retrieve or create Stripe customer
    let customer: Stripe.Customer | null = null;
    if (customerId) {
      try {
        const retrievedCustomer = await stripe.customers.retrieve(customerId);
        if (!retrievedCustomer.deleted) {
          customer = retrievedCustomer as Stripe.Customer;
          
          // Update customer with latest user data if needed
          if (userEmail && customer.email !== userEmail) {
            customer = await stripe.customers.update(customer.id, {
              email: userEmail,
              metadata: {
                user_id: userId,
                last_updated: new Date().toISOString()
              }
            });
          }
        } else {
          throw new Error(`Customer with ID ${customerId} is deleted.`);
        }
      } catch (err) {
        console.error('Error retrieving customer:', err);
        throw new Error(`Failed to retrieve customer with ID ${customerId}.`);
      }
    } else {
      // Create new customer with user data
      customer = await stripe.customers.create({
        ...(userEmail ? { email: userEmail } : {}),
        metadata: {
          user_id: userId,
          created_at: new Date().toISOString(),
          source: 'web_checkout'
        }
      });
      console.log('New customer created:', customer.id);
      console.log('GRAPHQL_ENDPOINT:', process.env.GRAPHQL_ENDPOINT);
      console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY);
      console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET);
    }

    // Create Stripe checkout session with enhanced metadata
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customer?.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        created_at: new Date().toISOString(),
        price_id: priceId,
        source: 'web_checkout'
      },
      client_reference_id: userId // This helps with webhook processing
    });

    // Respond with session details
    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return res.status(500).json({
      error: 'Failed to create checkout session',
      details: error.message,
    });
  }
}
