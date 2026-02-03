"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/error-boundary';

const QuotesContent = dynamic(() => import('./quotes-content').then(mod => mod.QuotesContent), {
  ssr: false
});

export default function QuotesPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <QuotesContent />
      </Suspense>
    </ErrorBoundary>
  )
}
