import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PricingTable } from '../components/pricing/PricingTable';
import { TrialBanner } from '../components/pricing/TrialBanner';
import { Shield, Users, Zap } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

// Demo trial end date - replace with actual trial data from backend
const demoTrialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now

function PricingPage() {
  const { status } = useSubscription();

  return (
    <>
      <TrialBanner showUpgradeButton={false} />

      <div className="p-6">
        <div className="mb-6">
          <Breadcrumbs />
          <div className="mt-8 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 mb-4">
              <Zap className="h-4 w-4 mr-2" />
              {status.trialEndsAt ? 'Trial Active' : 'Trial Ended'}
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Start free and scale as you grow. No credit card required.
            </p>
          </div>
        </div>

        <PricingTable />

        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg p-6 border border-purple-100">
            <Users className="h-6 w-6 text-purple-600 mb-4" />
            <h3 className="font-medium text-slate-800 mb-2">
              {(342).toLocaleString()} Happy Customers
            </h3>
            <p className="text-sm text-slate-600">
              Join thousands of satisfied users worldwide
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-purple-100">
            <Zap className="h-6 w-6 text-purple-600 mb-4" />
            <h3 className="font-medium text-slate-800 mb-2">Instant Access</h3>
            <p className="text-sm text-slate-600">
              Get started immediately after signup
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-purple-100">
            <Shield className="h-6 w-6 text-purple-600 mb-4" />
            <h3 className="font-medium text-slate-800 mb-2">
              30-Day Money Back
            </h3>
            <p className="text-sm text-slate-600">
              Try risk-free with our satisfaction guarantee
            </p>
          </div>
        </div>

        <button className="w-full px-3 py-2 text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
          style={{
            color: 'var(--button-text-color, #ffffff)',
            backgroundColor: 'var(--button-bg-color, #9333ea)',
          }}
        >
          Subscribe Now
        </button>
      </div>
    </>
  );
}

export default PricingPage;
