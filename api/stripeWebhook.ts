import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { config as dotenvConfig } from 'dotenv';
import { buffer } from 'micro';
dotenvConfig();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
});

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const apiConfig = {
  api: {
    bodyParser: false,
  },
};

// Add a helper function for logging
const logWebhookEvent = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  logWebhookEvent('Received webhook request');

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    logWebhookEvent('Missing signature or webhook secret');
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  let event;

  try {
    const rawBody = await buffer(req);
    logWebhookEvent('Raw body received', { rawBody: rawBody.toString() });
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    logWebhookEvent('Webhook signature verified');
  } catch (err: any) {
    logWebhookEvent('Webhook signature verification failed', { error: err.message });
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    logWebhookEvent(`Processing webhook event: ${event.type}`, {
      eventId: event.id,
      eventType: event.type,
      timestamp: new Date(event.created * 1000).toISOString()
    });
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      const userId = session.client_reference_id;

      logWebhookEvent('Checkout session completed', {
        sessionId: session.id,
        subscriptionId,
        userId,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email
      });

      if (!userId) {
        throw new Error('No user ID found in session metadata');
      }

      // Get the subscription from Stripe to confirm its status
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      logWebhookEvent('Retrieved Stripe subscription', {
        subscriptionId,
        status: stripeSubscription.status,
        customerId: stripeSubscription.customer
      });
      
      // Update subscription status to active if the Stripe subscription is active
      if (stripeSubscription.status === 'active') {
        // First check current status in database
        const { data: currentSub } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('stripe_subscription_id', subscriptionId)
          .single();
        
        logWebhookEvent('Current subscription in database', {
          subscriptionId,
          currentStatus: currentSub?.status
        });

        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ status: 'active' })
          .eq('stripe_subscription_id', subscriptionId)
          .eq('status', 'incomplete');

        if (updateError) {
          logWebhookEvent('Error updating subscription status', {
            error: updateError,
            subscriptionId
          });
          throw updateError;
        }

        logWebhookEvent('Successfully updated subscription status to active', {
          subscriptionId
        });

        // Verify the update
        const { data: updatedSub } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('stripe_subscription_id', subscriptionId)
          .single();
        
        logWebhookEvent('Verified subscription status after update', {
          subscriptionId,
          newStatus: updatedSub?.status
        });

        // Create feature flags if they don't exist
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('id, plan_id')
          .eq('stripe_subscription_id', subscriptionId)
          .single();

        if (subscription) {
          const { data: planDetails } = await supabase
            .from('subscription_plans')
            .select('features')
            .eq('id', subscription.plan_id)
            .single();

          if (planDetails?.features) {
            const features = planDetails.features.features || [];
            // Check if features already exist
            const { data: existingFeatures } = await supabase
              .from('subscription_features')
              .select('feature_name')
              .eq('subscription_id', subscription.id);

            if (!existingFeatures || existingFeatures.length === 0) {
              await supabase
                .from('subscription_features')
                .insert(
                  features.map((feature: string) => ({
                    subscription_id: subscription.id,
                    feature_name: feature,
                    is_enabled: true,
                    limits: planDetails.features[feature] || null
                  }))
                );
            }
          }
        }

        logWebhookEvent('Subscription status updated to active and features created');
      }
    }
    else if (event.type === 'customer.subscription.created' || 
        event.type === 'customer.subscription.updated' || 
        event.type === 'customer.subscription.deleted') {
      
      const subscription = event.data.object as Stripe.Subscription;
      
      // Get the checkout session to retrieve user ID
      const sessions = await stripe.checkout.sessions.list({
        subscription: subscription.id,
        limit: 1,
      });
      
      const session = sessions.data[0];
      if (!session) {
        throw new Error('No checkout session found for subscription');
      }
      
      const userId = session.client_reference_id;
      if (!userId) {
        throw new Error('No user ID found in session metadata');
      }

      logWebhookEvent('Processing subscription for user:', userId);

      if (event.type === 'customer.subscription.created') {
        logWebhookEvent('Creating new subscription for user:', userId);
        logWebhookEvent('Subscription status:', subscription.status);
        
        // Check if subscription already exists
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (existingSubscription) {
          logWebhookEvent('Subscription already exists, skipping creation', {
            subscriptionId: subscription.id,
            existingStatus: existingSubscription.status
          });
          return res.json({ received: true });
        }

        // Get the plan details
        const { data: plans, error: planError } = await supabase
          .from('subscription_plans')
          .select('id')
          .eq('stripe_price_id', subscription.items.data[0].price.id)
          .single();

        if (planError || !plans?.id) {
          logWebhookEvent('Plan not found:', planError);
          throw new Error('Plan not found');
        }

        // Create subscription record with correct status
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            plan_id: plans.id,
            status: subscription.status,  // Use the actual status from Stripe
            stripe_customer_id: subscription.customer,
            stripe_subscription_id: subscription.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            amount: (subscription.items.data[0].price.unit_amount ?? 0) / 100,
            currency: subscription.currency
          })
          .select()
          .single();

        if (subscriptionError) {
          logWebhookEvent('Error creating subscription:', subscriptionError);
          throw subscriptionError;
        }

        // Only create feature flags if subscription is active
        if (subscription.status === 'active') {
          // Create feature flags based on plan
          const { data: planDetails, error: planDetailsError } = await supabase
            .from('subscription_plans')
            .select('features')
            .eq('id', plans.id)
            .single();

          if (planDetailsError) {
            logWebhookEvent('Error fetching plan details:', planDetailsError);
            throw planDetailsError;
          }

          if (planDetails?.features) {
            const features = planDetails.features.features || [];
            const { error: featuresError } = await supabase
              .from('subscription_features')
              .insert(
                features.map((feature: string) => ({
                  subscription_id: subscriptionData.id,
                  feature_name: feature,
                  is_enabled: true,
                  limits: planDetails.features[feature] || null
                }))
              );

            if (featuresError) {
              logWebhookEvent('Error creating feature flags:', featuresError);
              throw featuresError;
            }
          }
        }

        logWebhookEvent('Subscription created successfully with status:', subscription.status);
      } else if (event.type === 'customer.subscription.updated') {
        logWebhookEvent('Updating subscription:', subscription.id);
        logWebhookEvent('New subscription status:', subscription.status);
        
        // Add a small delay to ensure previous operations are complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update subscription status without checking current status
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          logWebhookEvent('Error updating subscription:', error);
          throw error;
        }

        // Verify the update
        const { data: verifiedSub } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('stripe_subscription_id', subscription.id)
          .single();
        
        logWebhookEvent('Verified subscription status after update', {
          subscriptionId: subscription.id,
          newStatus: verifiedSub?.status,
          expectedStatus: subscription.status
        });

        // If subscription becomes active, create feature flags if they don't exist
        if (subscription.status === 'active') {
          const { data: existingSubscription } = await supabase
            .from('subscriptions')
            .select('id, plan_id')
            .eq('stripe_subscription_id', subscription.id)
            .single();

          if (existingSubscription) {
            const { data: planDetails } = await supabase
              .from('subscription_plans')
              .select('features')
              .eq('id', existingSubscription.plan_id)
              .single();

            if (planDetails?.features) {
              const features = planDetails.features.features || [];
              // Check if features already exist
              const { data: existingFeatures } = await supabase
                .from('subscription_features')
                .select('feature_name')
                .eq('subscription_id', existingSubscription.id);

              if (!existingFeatures || existingFeatures.length === 0) {
                const { error: featuresError } = await supabase
                  .from('subscription_features')
                  .insert(
                    features.map((feature: string) => ({
                      subscription_id: existingSubscription.id,
                      feature_name: feature,
                      is_enabled: true,
                      limits: planDetails.features[feature] || null
                    }))
                  );

                if (featuresError) {
                  logWebhookEvent('Error creating feature flags:', featuresError);
                  throw featuresError;
                }
              }
            }
          }
        }
        
        logWebhookEvent('Subscription updated successfully to status:', subscription.status);
      } else if (event.type === 'customer.subscription.deleted') {
        logWebhookEvent('Canceling subscription:', subscription.id);
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          logWebhookEvent('Error canceling subscription:', error);
          throw error;
        }
        logWebhookEvent('Subscription canceled successfully');
      }
    }

    logWebhookEvent('Environment variables', {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'retrieved' : 'missing',
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? 'retrieved' : 'missing'
    });

    console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? 'retrieved' : 'missing');

    return res.json({ received: true });
  } catch (error: any) {
    logWebhookEvent('Error processing webhook', {
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json({
      error: 'Failed to process webhook',
      details: error.message,
    });
  }
}
