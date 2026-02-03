import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbName = (path: string) => {
    if (path.includes('-')) {
      return path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link
        to="/"
        className="text-gray-800 dark:text-gray-100 hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        <Home className="h-4 w-4" />
      </Link>
      {paths.map((path, index) => {
        const to = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;

        return (
          <React.Fragment key={path}>
            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {getBreadcrumbName(path)}
              </span>
            ) : (
              <Link
                to={to}
                className="text-gray-800 dark:text-gray-100 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {getBreadcrumbName(path)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
