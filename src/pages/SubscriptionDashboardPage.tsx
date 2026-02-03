import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CreditCard, RefreshCw, XCircle } from 'lucide-react';
import { GET_USER_SUBSCRIPTION_DETAILS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Payment {
  id: string;
  amount: number;
  created: number;
  currency: string;
  payment_method_types: string[];
}

export default function SubscriptionDashboardPage() {
  const { currentUser } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);

  const { loading, error, data } = useQuery(GET_USER_SUBSCRIPTION_DETAILS, {
    variables: { userId: currentUser?.id },
    skip: !currentUser?.id,
  });

  useEffect(() => {
    async function fetchPaymentHistory() {
      const stripeCustomerId = data?.subscriptionsCollection.edges[0]?.node?.stripe_customer_id;
      if (stripeCustomerId) {
        try {
          const response = await axios.get('/api/getPaymentHistory', {
            params: { customerId: stripeCustomerId },
          });
          setPaymentHistory(response.data.data);
        } catch (error) {
          console.error('Error fetching payment history:', error);
        }
      }
    }
    fetchPaymentHistory();
  }, [data]);

  if (loading) return <div>Loading subscription details...</div>;
  if (error) return <div>Error fetching subscription details: {error.message}</div>;

  const subscription = data.subscriptionsCollection.edges[0]?.node;

  const handleUpgrade = () => {
    // Implement upgrade logic
  };

  const handleCancel = () => {
    // Implement cancel logic
  };

  console.log('Current Period End:', subscription.current_period_end);
  
  return (
    <div className="p-6 bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <div className="mb-6">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">Subscription Management</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your subscription and billing details</p>
      </div>

      {subscription ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-purple-100 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-purple-100 dark:border-gray-700 px-6 py-4 bg-purple-50 dark:bg-gray-700">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Current Plan: {subscription.subscription_plans.name}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <p>Status: {subscription.status}</p>
            <p>Next Billing Date: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
            <button onClick={handleUpgrade} className="btn btn-primary mt-4">Upgrade Plan</button>
            <button onClick={handleCancel} className="btn btn-danger mt-4 ml-2">Cancel Subscription</button>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Payment History</h3>
            {paymentHistory.length > 0 ? (
              <ul className="list-disc pl-5">
                {paymentHistory.map((payment: Payment) => (
                  <li key={payment.id} className="text-slate-600 dark:text-slate-400">
                    {new Date(payment.created * 1000).toLocaleDateString()} - {payment.amount / 100} {payment.currency.toUpperCase()} via {payment.payment_method_types.join(', ')}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">No payment history available.</p>
            )}
          </div>
        </div>
      ) : (
        <p>No subscription details available.</p>
      )}
    </div>
  );
} 