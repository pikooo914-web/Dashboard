import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  X,
  SlidersHorizontal,
  Menu,
} from 'lucide-react';
import { ReminderNotification, UserProfile } from '../types';
import { NotificationsDropdown } from './NotificationsDropdown';

interface TopbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: ReminderNotification[];
  onMarkAllNotificationsRead: () => void;
  onSelectNotification: (notif: ReminderNotification) => void;
  onOpenQuickAdd: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  user: UserProfile;
  selectedFilterStatus?: string;
  setSelectedFilterStatus?: (status: string) => void;
  onOpenMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  setSearchQuery,
  notifications,
  onMarkAllNotificationsRead,
  onSelectNotification,
  onOpenQuickAdd,
  theme,
  toggleTheme,
  user,
  selectedFilterStatus,
  setSelectedFilterStatus,
  onOpenMobileMenu,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filterStatuses = [
    'All',
    'Applied',
    'Screening',
    'Assessment',
    'Interview',
    'Offer',
    'Accepted',
    'Rejected',
  ];

  return (
    <header
      id="topbar-container"
      className={`sticky top-0 z-20 px-4 py-3.5 border-b transition-colors ${
        theme === 'dark'
          ? 'bg-slate-950/80 backdrop-blur-md border-cyan-500/15'
          : 'bg-white/90 backdrop-blur-md border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
        {/* Mobile Hamburger Menu Toggle Button */}
        {onOpenMobileMenu && (
          <button
            id="mobile-menu-btn"
            onClick={onOpenMobileMenu}
            className={`md:hidden p-2.5 rounded-xl border transition-all ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-cyan-600'
            }`}
            title="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Search Input Box */}
        <div className="flex-1 max-w-md relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="topbar-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, position, status, location..."
              className={`w-full pl-10 pr-10 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all focus:outline-none ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.08)]'
                  : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-cyan-600 focus:bg-white shadow-xs'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Quick Status Filter Toggle */}
          {setSelectedFilterStatus && (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  selectedFilterStatus && selectedFilterStatus !== 'All'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    : theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedFilterStatus && selectedFilterStatus !== 'All' ? selectedFilterStatus : 'Filter Status'}</span>
              </button>

              {showFilters && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-xl p-2 z-40 shadow-xl border ${
                    theme === 'dark'
                      ? 'glass-panel-dark border-cyan-500/30 text-slate-200'
                      : 'glass-panel-light border-slate-200 text-slate-800'
                  }`}
                >
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 py-1">
                    Filter Applications
                  </p>
                  <div className="space-y-0.5">
                    {filterStatuses.map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setSelectedFilterStatus(st);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          selectedFilterStatus === st
                            ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
                            : 'hover:bg-cyan-500/10 text-slate-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications Button */}
          <div className="relative">
            <button
              id="topbar-notifications-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-2 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-cyan-600'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-[0_0_8px_#00f0ff]">
                  {unreadCount}
                </span>
              )}
            </button>

            <NotificationsDropdown
              notifications={notifications}
              onMarkAllAsRead={onMarkAllNotificationsRead}
              onSelectNotification={(notif) => {
                onSelectNotification(notif);
                setIsNotifOpen(false);
              }}
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              theme={theme}
            />
          </div>

          {/* Theme Toggle Icon (Mobile / Quick) */}
          <button
            id="topbar-theme-toggle"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-800 text-amber-400 hover:border-amber-400/30'
                : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Add Button with Glow */}
          <button
            id="quick-add-app-btn"
            onClick={onOpenQuickAdd}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs sm:text-sm font-semibold shadow-[0_0_15px_rgba(0,240,255,0.35)] hover:shadow-[0_0_22px_rgba(0,240,255,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* User Avatar */}
          <div className="hidden sm:flex items-center space-x-2 pl-1">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
