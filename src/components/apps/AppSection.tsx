import React from 'react';
import { AppCard } from './AppCard';
import { FeaturedApp } from './FeaturedApp';

interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  category:
    | 'Accounting'
    | 'Marketing'
    | 'Automation'
    | 'Add-ons'
    | 'Communication';
  price: string;
  installed?: boolean;
  featured?: boolean;
  popular?: boolean;
  rating?: number;
  reviews?: number;
  publisher: string;
}

interface AppSectionProps {
  title: string;
  icon: React.ReactNode;
  apps: App[];
  variant?: 'featured' | 'grid';
}

export function AppSection({
  title,
  icon,
  apps,
  variant = 'grid',
}: AppSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6`}>
        {variant === 'featured'
          ? apps.map((app) => <FeaturedApp key={app.id} app={app} />)
          : apps.map((app) => <AppCard key={app.id} app={app} />)}
      </div>
    </div>
  );
}
