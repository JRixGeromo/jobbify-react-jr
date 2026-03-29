import { AppWindow, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../Breadcrumbs';

export function AppHeader() {
  return (
    <div className="mb-6">
      <Link
        to="/settings/integrations"
        className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Integrations
      </Link>
      <Breadcrumbs />
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <AppWindow className="h-6 w-6 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">App Store</h1>
            <p className="text-slate-600">
              Extend your Labor Grid with powerful integrations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
