import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { Routes } from './routes';
import { SubscriptionCheck } from './components/SubscriptionCheck';
import { apolloClient } from './lib/apollo';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ErrorBoundary>
        <AuthProvider>
          {/* <SubscriptionCheck> */}
          <Routes />
          <Toaster position="top-right" richColors />
          {/* </SubscriptionCheck> */}
        </AuthProvider>
      </ErrorBoundary>
    </ApolloProvider>
  );
}
