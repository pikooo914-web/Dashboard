import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  Award,
  Sparkles,
  PieChart as PieChartIcon,
  BarChart3,
  LineChart as LineChartIcon,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { JobApplication } from '../types';

interface AnalyticsViewProps {
  applications: JobApplication[];
  theme: 'dark' | 'light';
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ applications, theme }) => {
  const total = applications.length;

  // Metric Rates
  const respondedApps = applications.filter(
    (a) => a.status !== 'Applied'
  ).length;
  const responseRate = total > 0 ? ((respondedApps / total) * 100).toFixed(1) : '0';

  const interviewsCount = applications.filter((a) => a.status === 'Interview').length;
  const interviewRate = total > 0 ? ((interviewsCount / total) * 100).toFixed(1) : '0';

  const offersCount = applications.filter((a) => ['Offer', 'Accepted'].includes(a.status)).length;
  const offerRate = total > 0 ? ((offersCount / total) * 100).toFixed(1) : '0';

  // Application Funnel Data
  const funnelData = [
    { stage: 'Applied', count: applications.length },
    {
      stage: 'Screening',
      count: applications.filter((a) =>
        ['Screening', 'Assessment', 'Interview', 'Offer', 'Accepted'].includes(a.status)
      ).length,
    },
    {
      stage: 'Assessment',
      count: applications.filter((a) =>
        ['Assessment', 'Interview', 'Offer', 'Accepted'].includes(a.status)
      ).length,
    },
    {
      stage: 'Interview',
      count: applications.filter((a) => ['Interview', 'Offer', 'Accepted'].includes(a.status))
        .length,
    },
    {
      stage: 'Offer',
      count: applications.filter((a) => ['Offer', 'Accepted'].includes(a.status)).length,
    },
    {
      stage: 'Accepted',
      count: applications.filter((a) => a.status === 'Accepted').length,
    },
  ];

  // Status Distribution Data
  const statusCounts: Record<string, number> = {};
  applications.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  const pieData = Object.keys(statusCounts).map((st) => ({
    name: st,
    value: statusCounts[st],
  }));

  const PIE_COLORS: Record<string, string> = {
    Applied: '#00f0ff',
    Screening: '#6366f1',
    Assessment: '#a855f7',
    Interview: '#f59e0b',
    Offer: '#10b981',
    Accepted: '#22c55e',
    Rejected: '#f43f5e',
    Withdrawn: '#64748b',
  };

  // Timeline Trend Data (Mock weekly distribution)
  const timelineData = [
    { week: 'Week 1', applications: 4, interviews: 1 },
    { week: 'Week 2', applications: 7, interviews: 2 },
    { week: 'Week 3', applications: 12, interviews: 3 },
    { week: 'Week 4', applications: 18, interviews: 4 },
    { week: 'Current', applications: total, interviews: interviewsCount },
  ];

  return (
    <div className="space-y-6 my-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <span>Analytics & Career Intelligence</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Data-driven conversion rates, recruitment funnel, and AI career search insights.
        </p>
      </div>

      {/* Key Metric Rates Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-5 rounded-2xl border transition-all ${
            theme === 'dark'
              ? 'glass-panel-dark border-cyan-500/20'
              : 'glass-panel-light border-slate-200'
          }`}
        >
          <p className="text-xs font-mono uppercase text-slate-400">Response Rate</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-cyan-400">{responseRate}%</span>
            <span className="text-xs text-emerald-400 font-semibold">+8.4% vs last mo</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Applications moving past initial submit</p>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            theme === 'dark'
              ? 'glass-panel-dark border-violet-500/20'
              : 'glass-panel-light border-slate-200'
          }`}
        >
          <p className="text-xs font-mono uppercase text-slate-400">Interview Rate</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-violet-400">{interviewRate}%</span>
            <span className="text-xs text-emerald-400 font-semibold">+5.1% vs last mo</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Applications reaching technical/HR rounds</p>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            theme === 'dark'
              ? 'glass-panel-dark border-emerald-500/20'
              : 'glass-panel-light border-slate-200'
          }`}
        >
          <p className="text-xs font-mono uppercase text-slate-400">Offer Rate</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">{offerRate}%</span>
            <span className="text-xs text-emerald-400 font-semibold">+2.3% vs last mo</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Final offer letters extended</p>
        </div>
      </div>

      {/* AI Automated Insights Cards */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-violet-950/60 border border-cyan-500/30">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Automated Career Search Insights</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="font-semibold text-slate-200">🚀 Interview conversion up by 8%</p>
            <p className="text-slate-400 mt-1 text-[11px]">
              Updating your Tech Resume 2026 resulted in higher recruiter callback velocity.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="font-semibold text-slate-200">📌 Active Screening Stage bottleneck</p>
            <p className="text-slate-400 mt-1 text-[11px]">
              Most applications are currently awaiting administrative review or technical grading.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="font-semibold text-slate-200">⭐ LinkedIn is your top channel</p>
            <p className="text-slate-400 mt-1 text-[11px]">
              LinkedIn applications account for 42% of your overall responses.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Funnel */}
        <div
          className={`p-5 rounded-2xl border ${
            theme === 'dark'
              ? 'glass-panel-dark border-cyan-500/15'
              : 'glass-panel-light border-slate-200'
          }`}
        >
          <h3 className="font-bold text-sm text-slate-100 mb-4 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Recruitment Funnel Velocity</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#00f0ff',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#00f0ff" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut Chart */}
        <div
          className={`p-5 rounded-2xl border ${
            theme === 'dark'
              ? 'glass-panel-dark border-cyan-500/15'
              : 'glass-panel-light border-slate-200'
          }`}
        >
          <h3 className="font-bold text-sm text-slate-100 mb-4 flex items-center space-x-2">
            <PieChartIcon className="w-4 h-4 text-violet-400" />
            <span>Status Distribution</span>
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name] || '#00f0ff'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#a855f7',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
