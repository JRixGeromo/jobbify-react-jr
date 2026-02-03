import React from 'react';
import { Clock } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../hooks/useSubscription';

interface TrialBannerProps {
  showUpgradeButton?: boolean;
}

export function TrialBanner({ showUpgradeButton = true }: TrialBannerProps) {
  const navigate = useNavigate();
  const { status } = useSubscription();
  const daysRemaining = status.trialEndsAt ? differenceInDays(status.trialEndsAt, new Date()) : 0;

  return (
    <div className="bg-purple-600 text-white py-3 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span>
            {daysRemaining > 0 ? (
              <>
                Your trial is active with <strong>{daysRemaining} days</strong> remaining.
              </>
            ) : (
              <strong>Your trial has ended</strong>
            )}
          </span>
        </div>
        {showUpgradeButton && (
          <button
            onClick={() => navigate('/pricing')}
            className="px-4 py-1 bg-white text-purple-600 rounded-full text-sm font-medium hover:bg-purple-50"
          >
            Upgrade Now
          </button>
        )}
      </div>
    </div>
  );
}
