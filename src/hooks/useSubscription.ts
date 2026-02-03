import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

interface SubscriptionStatus {
  isActive: boolean;
  isTrialing: boolean;
  trialEndsAt: Date | null;
  plan: 'essential' | 'pro' | null;
  subscriptionId?: string;
}

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isActive: false,
    isTrialing: false,
    trialEndsAt: null,
    plan: null,
  });
  const [loading, setLoading] = useState(true);
  const [featureCache, setFeatureCache] = useState<Record<string, boolean>>({});
  const { user } = useAuth();

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*, subscription_features(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setStatus({
        isActive: subscription?.status === 'active',
        isTrialing: subscription?.status === 'trialing',
        trialEndsAt: subscription?.trial_end ? new Date(subscription.trial_end) : null,
        plan: subscription?.plan_id ? 'essential' : null,
        subscriptionId: subscription?.id
      });

      // Pre-cache features if available
      if (subscription?.subscription_features) {
        const features = subscription.subscription_features.reduce((acc: Record<string, boolean>, feature: any) => {
          acc[feature.feature_name] = feature.is_enabled;
          return acc;
        }, {});
        setFeatureCache(features);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  const hasFeature = async (featureName: string) => {
    // Check cache first
    if (featureCache[featureName] !== undefined) {
      return featureCache[featureName];
    }

    if (!status.subscriptionId) return false;
    
    try {
      const { data, error } = await supabase
        .from('subscription_features')
        .select('is_enabled')
        .eq('subscription_id', status.subscriptionId)
        .eq('feature_name', featureName)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return false; // No rows found
        throw error;
      }

      // Cache the result
      setFeatureCache(prev => ({
        ...prev,
        [featureName]: data?.is_enabled || false
      }));

      return data?.is_enabled || false;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  };

  const testFeatures = async () => {
    setFeatureCache({}); // Clear cache
    await fetchSubscriptionStatus();
  };

  const checkAccess = () => {
    if (!status.isActive && !status.isTrialing) {
      window.location.href = '/pricing';
      return false;
    }
    return true;
  };

  return {
    status,
    checkAccess,
    hasFeature,
    testFeatures,
    loading,
  };
}
