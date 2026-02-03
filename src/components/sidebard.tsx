import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Receipt,
  Settings,
  Search,
  Command,
  Zap,
  Clock,
  Menu,
  X,
  Sparkles,
  DollarSign,
  Calendar,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from './ui/nav-link';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_USER_SUBSCRIPTION } from '../graphql/queries';
import { calculateTrialDays } from '../lib/calculateTrialDays';
import { useSubscription } from '../hooks/useSubscription';
import { differenceInDays } from 'date-fns';

interface SidebarProps {
  hasActiveSubscription: boolean;
  isLoading: boolean;
}

export function Sidebar({ hasActiveSubscription, isLoading }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const { status, loading } = useSubscription();
  const trialDays = status.trialEndsAt ? differenceInDays(status.trialEndsAt, new Date()) : 0;
  const trialMessage = trialDays > 0 ? `${trialDays} days left in your trial` : 'Your trial has ended';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  function UpgradeToPro({ onUpgrade }: { onUpgrade: () => void }) {
    return (
      <div
        className="rounded-lg p-4 mb-4"
        style={{
          background:
            'linear-gradient(to bottom right, var(--gradient-start, #f3e8ff), var(--gradient-end, #d946ef))',
        }}
      >
                <div className="p-4 text-xs text-purple-600">
          {trialDays > 0 ? (
            <p>{trialMessage}</p>
          ) : (
            <p>{trialMessage}</p>
          )}
          <hr className="my-2 border-t border-purple-200" />
        </div>
        <div className="flex items-center justify-between mb-3">
          <Zap
            className="h-5 w-5"
            style={{ color: 'var(--icon-color, #9333ea)' }}
          />
              
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              color: 'var(--badge-text-color, #9333ea)',
              backgroundColor:
                'var(--badge-bg-color, rgba(147, 51, 234, 0.2))',
            }}
          >
            PRO
          </span>
        </div>
        <h4
          className="text-xs font-semibold mb-1"
          style={{ color: 'var(--text-color, #1a202c)' }}
        >
          Upgrade to Pro
        </h4>
        <p
          className="text-xs mb-3"
          style={{ color: 'var(--text-secondary-color, #4a5568)' }}
        >
          Get access to advanced features and priority support
        </p>

        <button
          onClick={onUpgrade}
          className="w-full px-3 py-2 text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
          style={{
            color: 'var(--button-text-color, #ffffff)',
            backgroundColor: 'var(--button-bg-color, #9333ea)',
          }}
        >
          Upgrade Now
        </button>
      </div>
    );
  }
  

  const SidebarContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="flex h-14 items-center border-b border-purple-100 px-4 bg-[var(--sidebar-bg-color)] text-[var(--sidebar-text-color)]">
        <span
          className={`text-lg font-bold ${isCollapsed ? 'hidden' : 'block'}`}
        >
          Jobbify
        </span>
        <Sparkles
          className={`${
            isCollapsed ? 'mx-auto' : 'ml-2'
          } h-5 w-5 text-purple-600`}
        />
        <button
          onClick={toggleCollapse}
          className="ml-auto p-1 rounded-lg hover:bg-purple-50"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="px-4 py-3 bg-[var(--sidebar-bg-color)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-9 pr-12 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 p-4 bg-[var(--sidebar-bg-color)] text-[var(--sidebar-text-color)]">
        <NavLink
          to="/"
          icon={<LayoutDashboard className="h-5 w-5" />}
          collapsed={isCollapsed}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/jobs"
          icon={<Briefcase className="h-5 w-5" />}
          collapsed={isCollapsed}
        >
          Jobs
        </NavLink>
        <NavLink
          to="/clients"
          icon={<Users className="h-5 w-5" />}
          collapsed={isCollapsed}
        >
          Clients
        </NavLink>
        <NavLink
          to="/quotes"
          icon={<FileText className="h-5 w-5" />}
          collapsed={isCollapsed}
        >
          Quotes
        </NavLink>
        <NavLink
          to="/invoices"
          icon={<Receipt className="h-5 w-5" />}
          collapsed={isCollapsed}
        >
          Invoices
        </NavLink>
        <NavLink
          to="/expenses"
          icon={<DollarSign className="h-5 w-5" />}
          collapsed={isCollapsed}
        >
          Expenses
        </NavLink>
        <NavLink
          to="/timesheet"
          icon={<Clock className="h-5 w-5" />}
          collapsed={isCollapsed}
        >
          Timesheet
        </NavLink>
        <NavLink
          to="/schedule"
          icon={<Calendar className="h-5 w-5" />}
          collapsed={isCollapsed}
        >
          Schedule
        </NavLink>
        <NavLink
          to="/reports"
          icon={<BarChart3 className="h-5 w-5" />}
          collapsed={isCollapsed}
        >
          Reports
        </NavLink>
        <NavLink
          to="/settings"
          icon={<Settings className="h-5 w-5" />}
          collapsed={isCollapsed}
        >
          Settings
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-purple-100 bg-[var(--sidebar-bg-color)] text-[var(--sidebar-text-color)]">


        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            {/* Spinner for loading state */}
            <div
              className="w-6 h-6 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"
              aria-label="Loading..."
            />
          </div>
        ) : (
          // Show the "Upgrade to Pro" section if not loading and no active subscription
          !hasActiveSubscription && (
            <UpgradeToPro onUpgrade={() => navigate('/pricing')} />
          )
        )}

        {/* User Profile & Logout */}
        <div
          className={`flex items-center justify-between ${
            isCollapsed ? 'flex-col gap-2' : 'gap-3'
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-sm font-medium text-purple-600">
                  {currentUser?.email?.[0].toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center p-2 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 ${
              isCollapsed ? 'w-full' : ''
            }`}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-slate-600" />
        ) : (
          <Menu className="h-6 w-6 text-slate-600" />
        )}
      </button>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          isMobileMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-black/50" onClick={toggleMobileMenu} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col">
          <SidebarContent />
        </div>
      </div>

      <div
        className={`hidden lg:flex h-screen ${
          isCollapsed ? 'w-20' : 'w-64'
        } flex-col border-r border-purple-100 transition-all duration-300 sidebar`}
      >
        <SidebarContent />
      </div>
    </>
  );
}
