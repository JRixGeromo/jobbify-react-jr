import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface DevOnlyProps {
  children: ReactNode;
}

export function DevOnly({ children }: DevOnlyProps) {
  const isDevelopment = import.meta.env.DEV;

  if (!isDevelopment) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 