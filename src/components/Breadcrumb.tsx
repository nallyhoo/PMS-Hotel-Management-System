import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  homeLabel?: string;
  homeHref?: string;
}

export function Breadcrumb({ 
  items = [], 
  homeLabel = 'Home', 
  homeHref = '/dashboard' 
}: BreadcrumbProps) {
  const location = useLocation();
  
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const autoBreadcrumbs: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return { label, href };
  });

  const breadcrumbs = items.length > 0 ? items : autoBreadcrumbs;

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm">
      <Link
        to={homeHref}
        className="flex items-center gap-1 text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60 transition-colors"
      >
        <Home size={16} />
      </Link>
      
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href || index}>
          <ChevronRight size={14} className="text-[#1a1a1a]/20" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-[#1a1a1a]/60 font-medium">
              {item.label}
            </span>
          ) : item.href ? (
            <Link
              to={item.href}
              className="text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#1a1a1a]/40">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function PageHeader({ 
  title, 
  description, 
  actions,
  breadcrumbs 
}: { 
  title: string; 
  description?: string; 
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <div className="space-y-4">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light text-[#1a1a1a]">{title}</h1>
          {description && (
            <p className="text-sm text-[#1a1a1a]/60 font-light mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
