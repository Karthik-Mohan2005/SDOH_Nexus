import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  LogOut,
  User as UserIcon,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from './Breadcrumbs';
import { mockMembers } from '../../data/members';
import { mockCommunities } from '../../data/communities';
import { mockInterventions } from '../../data/interventions';

export interface TopHeaderProps {
  onMobileMenuOpen: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllRead, toggleSidebar } = useApp();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Global search suggestions
  const searchResults = searchQuery.trim()
    ? {
        members: mockMembers.filter(m =>
          m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.primaryCondition.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3),
        communities: mockCommunities.filter(c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3),
        interventions: mockInterventions.filter(i =>
          i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.recommendation.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3),
      }
    : null;

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 shadow-2xs px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left Area: Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="hidden md:flex p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block min-w-0">
          <Breadcrumbs />
        </div>
      </div>

      {/* Center Area: Global Search */}
      <div className="relative flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Member ID, Community, ZIP, Condition..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setTimeout(() => setIsSearching(false), 200)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearching && searchResults && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 max-h-96 overflow-y-auto">
            {searchResults.members.length === 0 &&
            searchResults.communities.length === 0 &&
            searchResults.interventions.length === 0 ? (
              <p className="text-xs text-slate-500 p-3 text-center">No matching records found.</p>
            ) : (
              <>
                {searchResults.members.length > 0 && (
                  <div className="mb-2">
                    <h5 className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      Members
                    </h5>
                    {searchResults.members.map(m => (
                      <button
                        key={m.memberId}
                        onClick={() => {
                          navigate(`/members/${m.memberId}`);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-800">{m.memberId} ({m.primaryCondition})</span>
                        <span className="text-slate-500">{m.communityName}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.communities.length > 0 && (
                  <div className="mb-2">
                    <h5 className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      Communities
                    </h5>
                    {searchResults.communities.map(c => (
                      <button
                        key={c.communityId}
                        onClick={() => {
                          navigate('/communities');
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-800">{c.name}</span>
                        <span className="text-slate-500">SDOH Score: {c.sdohScore}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.interventions.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      Interventions
                    </h5>
                    {searchResults.interventions.map(i => (
                      <button
                        key={i.id}
                        onClick={() => {
                          navigate('/interventions');
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-800">{i.category}</span>
                        <span className="text-slate-500 truncate max-w-[180px]">{i.targetName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Area: Data Freshness, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Data Freshness Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Data Sync: 10m ago</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-3">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <h4 className="text-sm font-semibold text-slate-900">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 font-medium hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-lg text-xs transition-colors ${
                      n.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/60 font-medium'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="font-semibold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    {n.description && <p className="text-slate-600 leading-snug">{n.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {user?.avatarInitials || 'SM'}
            </div>
            <div className="hidden md:block text-left">
              <span className="block text-xs font-semibold text-slate-800 leading-tight">
                {user?.name || 'Dr. Sarah Mitchell'}
              </span>
              <span className="block text-[11px] text-slate-500">Analyst</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-1.5">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                <UserIcon className="h-4 w-4" /> Profile & Settings
              </button>
              <button
                onClick={() => {
                  navigate('/integrations');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                <ShieldCheck className="h-4 w-4" /> Data Integration Status
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
