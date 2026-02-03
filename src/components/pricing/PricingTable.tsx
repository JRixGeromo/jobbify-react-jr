import React from 'react';
import { Check, Zap } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// Initialize Stripe with test key - replace with env var in production
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
console.log("Publishable Key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PricingPlan {
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  priceId: string;
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Essential',
    price: 29,
    interval: 'month',
    priceId: import.meta.env.VITE_STRIPE_ESSENTIAL_PRICE_ID!,
    features: [
      'Up to 5 Team Members',
      'Basic Job Management',
      'Client Database',
      'Simple Invoicing',
      'Email Support',
      'Mobile App Access',
      'Basic Reporting',
    ],
  },
  {
    name: 'Pro',
    price: 79,
    interval: 'month',
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID!,
    popular: true,
    features: [
      'Unlimited Team Members',
      'Advanced Job Scheduling',
      'Client Portal Access',
      'Custom Branding',
      'Priority Support',
      'API Access',
      'Advanced Analytics',
      'Team Collaboration',
      'Automated Workflows',
      'Advanced Security',
      'Custom Fields',
      'Inventory Management',
    ],
  },
];

export function PricingTable() {
  const { user } = useAuth();

  const handleSubscribe = async (priceId: string) => {
    try {
      if (!user) {
        throw new Error('Please log in to subscribe');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');
  
      // Make a POST request to create the Checkout session
      const response = await fetch('/api/createCheckoutSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
        }),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create Stripe Checkout session');
      }
  
      const { url } = await response.json();
  
      if (!url) {
        throw new Error('Failed to create a Stripe Checkout session: Missing URL');
      }
  
      // Redirect to the Stripe Checkout page
      window.location.href = url;
    } catch (error: any) {
      console.error('Error creating Stripe Checkout session:', error.message);
      alert(`An error occurred: ${error.message}`);
    }
  };
  
  

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`bg-white rounded-2xl shadow-xl border overflow-hidden ${
            plan.popular
              ? 'border-purple-200 ring-2 ring-purple-500'
              : 'border-slate-200'
          }`}
        >
          {plan.popular && (
            <div className="bg-purple-500 text-white px-4 py-1 text-sm text-center">
              Most Popular
            </div>
          )}
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {plan.name}
                </h2>
                <p className="text-slate-600">
                  For{' '}
                  {plan.name === 'Essential'
                    ? 'small teams'
                    : 'growing businesses'}
                </p>
              </div>
              {plan.popular && <Zap className="h-6 w-6 text-purple-500" />}
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold text-slate-800">
                ${plan.price}
              </div>
              <div className="text-sm text-slate-500">per user/month</div>
            </div>
            <button
              onClick={() => handleSubscribe(plan.priceId)}
              className={`w-full py-3 px-4 rounded-lg font-medium ${
                plan.popular
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-slate-800 text-white hover:bg-slate-900'
              }`}
            >
              Subscribe Now
            </button>
            <div className="mt-8 space-y-4">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-slate-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
