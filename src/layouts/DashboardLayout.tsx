import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/sidebard';
import { CommandPalette } from '@/components/CommandPalette';
import { ForemanChat } from '@/components/foreman/ForemanChat';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardLayout() {
  const { subscription, loading: authLoading } = useAuth();
  const hasActiveSubscription = subscription?.status === 'active';
  const isLoading = authLoading;

  //console.log('Subscription Data:', subscription);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-violet-50">
      <Sidebar hasActiveSubscription={hasActiveSubscription} isLoading={isLoading} />
      <CommandPalette />
      <ForemanChat />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
