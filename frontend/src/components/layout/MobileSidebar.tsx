import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Users,
  MapPin,
  HeartPulse,
  Database,
  Settings,
  HelpCircle,
  Activity,
} from 'lucide-react';

export interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Members', path: '/members', icon: Users },
  { label: 'Community Map', path: '/communities', icon: MapPin },
  { label: 'Interventions', path: '/interventions', icon: HeartPulse },
  { label: 'Data Integration', path: '/integrations', icon: Database },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Help', path: '/help', icon: HelpCircle },
];

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-300 shadow-2xl flex flex-col">
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base">SDOH Nexus</span>
              <span className="block text-[11px] text-slate-400">Health Equity Platform</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
