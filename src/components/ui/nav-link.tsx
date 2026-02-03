import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  collapsed?: boolean;
}

export function NavLink({
  to,
  icon,
  children,
  collapsed,
  className,
  ...props
}: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-purple-900 group relative',
        isActive ? 'bg-purple-100 text-purple-900' : 'hover:bg-purple-50',
        className
      )}
      {...props}
    >
      <div className={cn('flex items-center', collapsed ? 'mx-auto' : '')}>
        {icon}
      </div>
      {!collapsed && <span>{children}</span>}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {children}
        </div>
      )}
    </Link>
  );
}
