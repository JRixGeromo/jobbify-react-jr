import React, { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const ALL_FEATURES = [
  'basic_job_management',
  'client_database',
  'simple_invoicing',
  'email_support',
  'mobile_app',
  'basic_reporting',
  'advanced_job_scheduling',
  'client_portal',
  'custom_branding',
  'priority_support',
  'api_access',
  'advanced_analytics',
  'team_collaboration',
  'automated_workflows',
  'advanced_security',
  'custom_fields',
  'inventory_management'
];

const BASIC_FEATURES = [
  'basic_job_management',
  'client_database',
  'simple_invoicing',
  'email_support',
  'mobile_app',
  'basic_reporting'
];

export function SubscriptionTest() {
  const { status, testFeatures, loading } = useSubscription();
  const { currentUser } = useAuth();
  const [featureStatus, setFeatureStatus] = useState<Record<string, boolean>>({});
  const [featureLoading, setFeatureLoading] = useState(true);

  useEffect(() => {
    const loadFeatures = async () => {
      if (!status.subscriptionId) {
        setFeatureStatus({});
        setFeatureLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subscription_features')
          .select('feature_name, is_enabled')
          .eq('subscription_id', status.subscriptionId);

        if (error) throw error;

        const features = (data || []).reduce((acc: Record<string, boolean>, feature) => {
          acc[feature.feature_name] = feature.is_enabled;
          return acc;
        }, {});

        setFeatureStatus(features);
      } catch (error) {
        console.error('Error loading features:', error);
      } finally {
        setFeatureLoading(false);
      }
    };

    loadFeatures();
  }, [status.subscriptionId]);

  const createTestSubscription = async (planName: 'Essential' | 'Pro') => {
    try {
      if (!currentUser) {
        throw new Error('Please log in first');
      }

      // Generate unique test IDs with timestamp
      const timestamp = Date.now();
      const testCustomerId = `cus_test_${planName.toLowerCase()}_${timestamp}`;
      const testSubscriptionId = `sub_test_${planName.toLowerCase()}_${timestamp}`;

      // 1. Get the plan
      const { data: plans, error: planError } = await supabase
        .from('subscription_plans')
        .select('id, features')
        .eq('name', planName)
        .single();

      if (planError) throw planError;
      if (!plans) throw new Error(`${planName} plan not found`);

      // 2. Create test subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: currentUser.id,
          plan_id: plans.id,
          status: 'trialing',
          stripe_customer_id: testCustomerId,
          stripe_subscription_id: testSubscriptionId,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          amount: planName === 'Essential' ? '29.99' : '79.99',
          currency: 'USD'
        })
        .select()
        .single();

      if (subError) throw subError;
      if (!subscription) throw new Error('Failed to create subscription');

      // 3. Create feature flags
      const features = planName === 'Essential' ? BASIC_FEATURES : ALL_FEATURES;
      const { error: featureError } = await supabase
        .from('subscription_features')
        .insert(
          features.map(feature => ({
            subscription_id: subscription.id,
            feature_name: feature,
            is_enabled: true,
            limits: feature === 'team_members' ? JSON.stringify({ max: planName === 'Essential' ? 5 : -1 }) : null
          }))
        );

      if (featureError) throw featureError;

      console.log(`✅ Test ${planName} subscription created successfully`);
      window.location.reload();
      
    } catch (error) {
      console.error('Test failed:', error);
      alert('Test failed. Check console for details.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Subscription Test Panel</h2>
      
      {loading || featureLoading ? (
        <div className="text-center py-4">Loading subscription data...</div>
      ) : (
        <>
          {/* Subscription Status */}
          <div className="mb-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Subscription Status</h3>
            <div className="space-y-2">
              <div>Active: <span className={status.isActive ? 'text-green-600' : 'text-red-600'}>
                {status.isActive ? '✓' : '✗'}
              </span></div>
              <div>Trial: <span className={status.isTrialing ? 'text-green-600' : 'text-red-600'}>
                {status.isTrialing ? '✓' : '✗'}
              </span></div>
              <div>Plan: <span className="font-mono">{status.plan || 'none'}</span></div>
              <div>Trial Ends: <span className="font-mono">
                {status.trialEndsAt?.toLocaleDateString() || 'N/A'}
              </span></div>
            </div>
          </div>

          {/* Feature Tests */}
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Feature Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALL_FEATURES.map(feature => (
                <div key={feature} className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                  <span className={`w-4 h-4 rounded-full flex-shrink-0 ${
                    featureStatus[feature] ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="font-mono text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Test Actions */}
          <div>
            <h3 className="font-semibold mb-2">Test Actions</h3>
            <div className="space-x-4">
              <button
                onClick={async () => {
                  setFeatureLoading(true);
                  await testFeatures();
                  setFeatureLoading(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Run Feature Tests
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Refresh Status
              </button>
              <button
                onClick={() => createTestSubscription('Essential')}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Create Essential Test
              </button>
              <button
                onClick={() => createTestSubscription('Pro')}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Create Pro Test
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 