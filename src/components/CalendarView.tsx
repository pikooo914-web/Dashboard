import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Briefcase,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { JobApplication, ReminderNotification } from '../types';

interface CalendarViewProps {
  applications: JobApplication[];
  notifications: ReminderNotification[];
  onSelectApplication: (app: JobApplication) => void;
  theme: 'dark' | 'light';
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  applications,
  notifications,
  onSelectApplication,
  theme,
}) => {
  const [selectedEventType, setSelectedEventType] = useState<string>('All');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 7, 1)); // August 2026

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfWeek = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  // Aggregate all events (Deadlines, Next Steps, Interviews, Reminders)
  const calendarEvents: {
    id: string;
    date: Date;
    title: string;
    company: string;
    type: 'Interview' | 'Assessment' | 'Deadline' | 'Follow-up';
    appId?: string;
  }[] = [];

  applications.forEach((app) => {
    if (app.deadline) {
      calendarEvents.push({
        id: `dl_${app.id}`,
        date: new Date(app.deadline),
        title: `Deadline: ${app.position}`,
        company: app.company_name,
        type: 'Deadline',
        appId: app.id,
      });
    }

    if (app.next_step_date) {
      const type: 'Interview' | 'Assessment' | 'Follow-up' = app.next_step?.toLowerCase().includes('interview')
        ? 'Interview'
        : app.next_step?.toLowerCase().includes('assessment')
        ? 'Assessment'
        : 'Follow-up';

      calendarEvents.push({
        id: `ns_${app.id}`,
        date: new Date(app.next_step_date),
        title: `${app.next_step || 'Event'}: ${app.company_name}`,
        company: app.company_name,
        type,
        appId: app.id,
      });
    }
  });

  const filteredEvents =
    selectedEventType === 'All'
      ? calendarEvents
      : calendarEvents.filter((ev) => ev.type === selectedEventType);

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'Interview':
        return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'Assessment':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'Deadline':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6 my-6">
      {/* Calendar Header & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-cyan-400" />
            <span>Application Schedule & Deadlines</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upcoming interviews, technical assessments, and job application deadlines.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-2">
          {['All', 'Interview', 'Assessment', 'Deadline', 'Follow-up'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedEventType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedEventType === t
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div
        className={`rounded-2xl border p-5 ${
          theme === 'dark'
            ? 'glass-panel-dark border-cyan-500/15'
            : 'glass-panel-light border-slate-200'
        }`}
      >
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold font-mono text-cyan-400">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
              }
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
              }
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-mono font-bold uppercase text-slate-500">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty offset days */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty_${idx}`} className="h-28 rounded-xl bg-slate-950/20 border border-transparent" />
          ))}

          {/* Day Cells */}
          {daysArray.map((dayNum) => {
            const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
            const dayEvents = filteredEvents.filter(
              (ev) =>
                ev.date.getDate() === dayNum &&
                ev.date.getMonth() === currentMonth.getMonth() &&
                ev.date.getFullYear() === currentMonth.getFullYear()
            );

            const isToday = dayNum === 5 && currentMonth.getMonth() === 7; // Aug 5 mock today

            return (
              <div
                key={dayNum}
                className={`h-28 p-2 rounded-xl border flex flex-col justify-between transition-colors ${
                  isToday
                    ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold font-mono ${
                      isToday ? 'text-cyan-400' : 'text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-mono px-1 rounded bg-cyan-400 text-slate-950 font-bold">
                      TODAY
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-20">
                  {dayEvents.map((ev) => {
                    const matchedApp = applications.find((a) => a.id === ev.appId);
                    return (
                      <div
                        key={ev.id}
                        onClick={() => matchedApp && onSelectApplication(matchedApp)}
                        className={`p-1 rounded text-[10px] font-semibold border truncate cursor-pointer transition-transform hover:scale-105 ${getEventBadgeColor(
                          ev.type
                        )}`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
