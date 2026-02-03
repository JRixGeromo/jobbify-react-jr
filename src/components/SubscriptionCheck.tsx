import React from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { useLocation, Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export function SubscriptionCheck({ children }: Props) {
  const { status } = useSubscription();
  const location = useLocation();

  // Allow access to pricing and public pages
  const publicPaths = ['/pricing', '/login', '/signup'];
  if (publicPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  // Redirect to pricing if trial ended and no active subscription
  if (!status.isActive && !status.isTrialing) {
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
}
