import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  Zap,
  X,
  Menu,
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  user: UserProfile;
  onLogout?: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  theme,
  toggleTheme,
  user,
  onLogout,
  isMobileOpen = false,
  setIsMobileOpen,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="desktop-sidebar"
        className={`hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ${
          theme === 'dark'
            ? 'glass-panel-dark border-r border-cyan-500/15 text-slate-200'
            : 'glass-panel-light border-r border-slate-200 text-slate-800'
        }`}
      >
        {/* Brand Logo */}
        <div className="p-5 border-b border-cyan-500/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                  CYBERTRACK
                </span>
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono border border-cyan-500/30">
                  OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-400">Career Command Center</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)] font-semibold'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200 font-semibold shadow-sm'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-cyan-400' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Subtle Cyberpunk Banner / Status */}
        <div className="mx-3 my-2 p-3 rounded-xl bg-slate-900/40 dark:bg-slate-950/60 border border-cyan-500/20 text-xs">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">AI Insight Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Active pipeline velocity: <span className="text-emerald-400 font-mono font-medium">+18.4%</span> this week.
          </p>
        </div>

        {/* User & Theme Toggle Footer */}
        <div className="p-3.5 border-t border-cyan-500/10 space-y-2">
          {/* User Badge */}
          <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800/30 transition-colors">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-200 dark:text-slate-100">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            {/* Theme Switcher Button */}
            <button
              id="theme-toggle-sidebar"
              onClick={toggleTheme}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300'
              }`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Dark</span>
                </>
              )}
            </button>

            {/* Logout / Reset Button */}
            {onLogout && (
              <button
                id="logout-btn-sidebar"
                onClick={onLogout}
                title="Reset or logout"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      {/* Mobile Slide-Over Drawer Content */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          theme === 'dark'
            ? 'glass-panel-dark border-r border-cyan-500/20 text-slate-200 bg-slate-950'
            : 'glass-panel-light border-r border-slate-200 text-slate-800 bg-white'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-cyan-500/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                CYBERTRACK
              </span>
              <p className="text-[10px] text-slate-400">Career Command Center</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen?.(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Menu Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNavClick(item.id);
                  setIsMobileOpen?.(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/10 text-cyan-400 border border-cyan-500/30 font-semibold'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200 font-semibold'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Actions Footer */}
        <div className="p-4 border-t border-cyan-500/10 space-y-3">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-900/40">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-cyan-500/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-slate-100">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={toggleTheme}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300'
              }`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Dark</span>
                </>
              )}
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors"
                title="Logout / Reset"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Dynamic Mobile Bottom Navigation */}
      <nav
        id="mobile-bottom-nav"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t transition-colors ${
          theme === 'dark'
            ? 'bg-slate-950/95 border-cyan-500/20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]'
            : 'bg-white/95 border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]'
        }`}
      >
        <div className="flex items-center overflow-x-auto no-scrollbar space-x-1 px-2 py-1.5 scroll-smooth w-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={(e) => {
                  handleNavClick(item.id);
                  e.currentTarget.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                  });
                }}
                className={`flex flex-col items-center justify-center min-w-[64px] px-2.5 py-1.5 rounded-xl transition-all duration-200 shrink-0 ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-cyan-500/25 to-violet-500/15 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                      : 'bg-cyan-100 text-cyan-800 font-bold border border-cyan-300 shadow-xs'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon
                  className={`w-4 h-4 mb-0.5 transition-transform ${
                    isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'
                  }`}
                />
                <span className="text-[10px] tracking-tight whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
