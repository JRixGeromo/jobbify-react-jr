import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DemoModeNoticeProps {
  feature: string;
}

// This component is only used during development
// Remove when implementing backend services
export function DemoModeNotice({ feature }: DemoModeNoticeProps) {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <h3 className="font-medium text-amber-800">Development Mode</h3>
          <p className="text-sm text-amber-700">
            {feature} is ready for backend integration. Remove this notice when
            connecting to live services.
          </p>
        </div>
      </div>
    </div>
  );
}
