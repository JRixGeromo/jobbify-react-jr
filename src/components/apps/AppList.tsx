import { AppWindow, Star, TrendingUp } from 'lucide-react';
import { AppSection } from './AppSection';
import { App } from '../../types/apps';

interface AppListProps {
  featuredApps: App[];
  popularApps: App[];
  remainingApps: App[];
}

export function AppList({
  featuredApps,
  popularApps,
  remainingApps,
}: AppListProps) {
  return (
    <div className="space-y-8">
      <AppSection
        title="Featured Apps"
        icon={<Star className="h-5 w-5 text-purple-600" />}
        apps={featuredApps}
        variant="featured"
      />

      <AppSection
        title="Most Popular"
        icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
        apps={popularApps}
      />

      <AppSection
        title="All Apps"
        icon={<AppWindow className="h-5 w-5 text-purple-600" />}
        apps={remainingApps}
      />
    </div>
  );
}
