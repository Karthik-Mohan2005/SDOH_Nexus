import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  members: 'Members',
  communities: 'Community Risk Map',
  analytics: 'SDOH Analytics',
  interventions: 'Intervention Center',
  integrations: 'Data Integration',
  settings: 'Settings',
  help: 'Help & Documentation',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0 || pathnames[0] === 'login') return null;

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium" aria-label="Breadcrumb">
      <Link to="/dashboard" className="flex items-center hover:text-slate-700 transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = ROUTE_LABELS[name] || name;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="text-slate-900 font-semibold truncate max-w-[200px]">{label}</span>
            ) : (
              <Link to={routeTo} className="hover:text-slate-700 transition-colors truncate max-w-[150px]">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
