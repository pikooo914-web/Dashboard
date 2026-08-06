import React from 'react';
import {
  Briefcase,
  Activity,
  CalendarCheck2,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import { JobApplication } from '../types';

interface SummaryCardsProps {
  applications: JobApplication[];
  theme: 'dark' | 'light';
  onFilterClick?: (status: string) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  applications,
  theme,
  onFilterClick,
}) => {
  const totalApps = applications.length;

  const activeApps = applications.filter((app) =>
    ['Applied', 'Screening', 'Assessment', 'Interview'].includes(app.status)
  ).length;

  const interviewsCount = applications.filter((app) => app.status === 'Interview').length;

  const offersCount = applications.filter((app) =>
    ['Offer', 'Accepted'].includes(app.status)
  ).length;

  const cards = [
    {
      id: 'total',
      title: 'TOTAL APPLICATIONS',
      count: totalApps,
      trend: '+12% this month',
      icon: Briefcase,
      color: 'cyan',
      statusFilter: 'All',
      gradient: 'from-cyan-500/20 to-blue-600/10',
      border: 'border-cyan-500/30',
      glow: 'shadow-[0_0_18px_rgba(0,240,255,0.15)]',
      iconColor: 'text-cyan-400',
    },
    {
      id: 'active',
      title: 'ACTIVE APPLICATIONS',
      count: activeApps,
      trend: 'In active review pipeline',
      icon: Activity,
      color: 'violet',
      statusFilter: 'Applied',
      gradient: 'from-violet-500/20 to-purple-600/10',
      border: 'border-violet-500/30',
      glow: 'shadow-[0_0_18px_rgba(168,85,247,0.15)]',
      iconColor: 'text-violet-400',
    },
    {
      id: 'interviews',
      title: 'INTERVIEWS',
      count: interviewsCount,
      trend: 'Upcoming technical & HR',
      icon: CalendarCheck2,
      color: 'amber',
      statusFilter: 'Interview',
      gradient: 'from-amber-500/20 to-orange-600/10',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_18px_rgba(245,158,11,0.15)]',
      iconColor: 'text-amber-400',
    },
    {
      id: 'offers',
      title: 'OFFERS EXTENDED',
      count: offersCount,
      trend: totalApps > 0 ? `${((offersCount / totalApps) * 100).toFixed(1)}% conversion rate` : '0% conversion',
      icon: Trophy,
      color: 'emerald',
      statusFilter: 'Offer',
      gradient: 'from-emerald-500/20 to-teal-600/10',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_18px_rgba(16,185,129,0.15)]',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onFilterClick && onFilterClick(card.statusFilter)}
            className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${card.glow} ${
              theme === 'dark'
                ? `glass-panel-dark bg-gradient-to-br ${card.gradient} ${card.border}`
                : `glass-panel-light border-slate-200 bg-gradient-to-br ${card.gradient}`
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider font-semibold uppercase text-slate-400">
                {card.title}
              </span>
              <div
                className={`p-2.5 rounded-xl border ${
                  card.color === 'cyan'
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : card.color === 'violet'
                    ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                    : card.color === 'amber'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-slate-100">
                {card.count}
              </span>
              <div className="flex items-center space-x-1 text-xs text-emerald-400 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Active</span>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-400 truncate flex items-center space-x-1">
              <span>{card.trend}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
};
