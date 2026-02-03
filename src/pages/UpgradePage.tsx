import React, { useState, useEffect } from 'react';
import { Check, Zap, Timer, Users, ArrowRight, Shield } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

export default function UpgradePage() {
  const [purchaseCount, setPurchaseCount] = useState(342); // Starting with 342 purchases
  const basePrice = 49;
  const priceIncrease = Math.floor(purchaseCount / 100) * 10;
  const currentPrice = basePrice + priceIncrease;

  const features = [
    'Unlimited Jobs & Clients',
    'Advanced Reporting & Analytics',
    'Custom Branding',
    'Priority Support',
    'API Access',
    'Team Collaboration',
    'Automated Workflows',
    'Advanced Security Features',
  ];

  useEffect(() => {
    // Simulate purchase count increasing
    const interval = setInterval(() => {
      setPurchaseCount((prev) => prev + 1);
    }, Math.random() * 60000); // Random interval between 0-60 seconds

    return () => clearInterval(interval);
  }, []);

  const remainingInBatch = 100 - (purchaseCount % 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />

        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 mb-4">
            <Zap className="h-4 w-4 mr-2" />
            Limited Time Offer
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Lifetime Access to ServicePro
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            One-time payment, unlimited access forever
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Lifetime Deal
                </h2>
                <p className="text-slate-600">Pay once, use forever</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-800">
                  ${currentPrice}
                </div>
                <div className="text-sm text-slate-500 line-through">
                  Regular $499/year
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 text-purple-800">
                <Timer className="h-5 w-5" />
                <span className="font-medium">
                  Price increases in {remainingInBatch} purchases
                </span>
              </div>
              <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-full transition-all duration-500"
                  style={{ width: `${purchaseCount % 100}%` }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-purple-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              Get Lifetime Access
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="border-t border-purple-100 bg-purple-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-1">
                  30-Day Money-Back Guarantee
                </h3>
                <p className="text-sm text-slate-600">
                  Try ServicePro risk-free. If you're not satisfied within 30
                  days, we'll refund your purchase.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-purple-100">
            <Users className="h-6 w-6 text-purple-600 mb-4" />
            <h3 className="font-medium text-slate-800 mb-2">
              {purchaseCount.toLocaleString()} Happy Customers
            </h3>
            <p className="text-sm text-slate-600">
              Join thousands of satisfied users worldwide
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-purple-100">
            <Zap className="h-6 w-6 text-purple-600 mb-4" />
            <h3 className="font-medium text-slate-800 mb-2">Instant Access</h3>
            <p className="text-sm text-slate-600">
              Get started immediately after purchase
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-purple-100">
            <Shield className="h-6 w-6 text-purple-600 mb-4" />
            <h3 className="font-medium text-slate-800 mb-2">Secure Payment</h3>
            <p className="text-sm text-slate-600">
              256-bit SSL encryption for safe transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
