import React from 'react';
import { Download, ExternalLink, Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Link
      to={`/settings/integrations/apps/${app.id}`}
      className="block bg-white rounded-lg shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={app.icon} alt={app.name} className="w-12 h-12 rounded-lg" />
          <div>
            <h3 className="font-semibold text-slate-800">{app.name}</h3>
            <p className="text-sm text-purple-600">{app.publisher}</p>
          </div>
        </div>
        {app.installed ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <Check className="h-3 w-3 mr-1" />
            Installed
          </span>
        ) : (
          <span className="text-sm font-medium text-purple-600">
            {app.price}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-600 mb-4">{app.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-amber-400 fill-current" />
          <span className="text-sm text-slate-600">
            {app.rating} ({app.reviews})
          </span>
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            // Handle install/configure action
          }}
          className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
        >
          {app.installed ? (
            <>
              <ExternalLink className="h-4 w-4 mr-1" />
              Configure
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-1" />
              Install
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
