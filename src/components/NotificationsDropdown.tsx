import React from 'react';
import { Bell, Calendar, Clock, ArrowUpRight, CheckCheck } from 'lucide-react';
import { ReminderNotification } from '../types';

interface NotificationsDropdownProps {
  notifications: ReminderNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: ReminderNotification) => void;
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
  isOpen,
  theme,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      id="notifications-dropdown-menu"
      className={`absolute right-0 mt-3 w-80 md:w-96 rounded-2xl z-50 shadow-2xl transition-all duration-200 border ${
        theme === 'dark'
          ? 'glass-panel-dark border-cyan-500/30 text-slate-100'
          : 'glass-panel-light border-slate-200 text-slate-800'
      }`}
    >
      {/* Dropdown Header */}
      <div className="p-4 border-b border-cyan-500/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center space-x-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-cyan-500/10">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-40" />
            <p>No notifications right now.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onSelectNotification(notif)}
              className={`p-3.5 cursor-pointer transition-colors hover:bg-cyan-500/5 flex items-start space-x-3 ${
                !notif.read ? (theme === 'dark' ? 'bg-cyan-950/20' : 'bg-cyan-50/50') : ''
              }`}
            >
              <div
                className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  notif.type === 'interview'
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : notif.type === 'deadline'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}
              >
                {notif.type === 'interview' ? (
                  <Calendar className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold truncate text-slate-200 dark:text-slate-100">
                    {notif.title}
                  </p>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {notif.description}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  {new Date(notif.reminder_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
