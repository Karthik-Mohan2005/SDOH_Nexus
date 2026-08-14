import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MapPin,
  HeartPulse,
  Database,
  Settings,
  HelpCircle,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface NavItemDef {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

const MAIN_NAV_ITEMS: NavItemDef[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Members', path: '/members', icon: Users },
  { label: 'Community Map', path: '/communities', icon: MapPin },
  { label: 'Interventions', path: '/interventions', icon: HeartPulse },
  { label: 'Data Integration', path: '/integrations', icon: Database, badge: '5 Sources' },
];

const BOTTOM_NAV_ITEMS: NavItemDef[] = [
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Help', path: '/help', icon: HelpCircle },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed } = useApp();

  return (
    <aside
      className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-30 bg-slate-900 text-slate-300 transition-all duration-300 border-r border-slate-800 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800 shrink-0">
        <NavLink to="/dashboard" className="flex items-center gap-3 group overflow-hidden">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md group-hover:bg-blue-500 transition-colors">
            <Activity className="h-5 w-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-white text-base tracking-tight leading-none">
                SDOH Nexus
              </span>
              <span className="text-[11px] text-slate-400 font-medium mt-1 truncate">
                Health Equity Platform
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {!sidebarCollapsed && (
            <h4 className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-2">
              Intelligence Core
            </h4>
          )}
          <nav className="space-y-1">
            {MAIN_NAV_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[10px] font-semibold bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700/50">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Integration Badge */}
      {!sidebarCollapsed && (
        <div className="mx-4 my-2 p-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Layer Enriched</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-tight">
            CDC SVI • Census • USDA • EPA
          </p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-slate-800 shrink-0 space-y-1">
        {BOTTOM_NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
