import React, { useState } from 'react';
import {
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  Globe,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../types';

interface KanbanBoardProps {
  applications: JobApplication[];
  onStatusChange: (appId: string, newStatus: ApplicationStatus) => void;
  onSelectApplication: (app: JobApplication) => void;
  theme: 'dark' | 'light';
}

const PIPELINE_STAGES: { id: ApplicationStatus; label: string; color: string; border: string }[] = [
  { id: 'Applied', label: 'Applied', color: 'bg-cyan-500/20 text-cyan-400', border: 'border-cyan-500/30' },
  { id: 'Screening', label: 'Screening', color: 'bg-indigo-500/20 text-indigo-400', border: 'border-indigo-500/30' },
  { id: 'Assessment', label: 'Assessment', color: 'bg-violet-500/20 text-violet-400', border: 'border-violet-500/30' },
  { id: 'Interview', label: 'Interview', color: 'bg-amber-500/20 text-amber-400', border: 'border-amber-500/30' },
  { id: 'Offer', label: 'Offer', color: 'bg-emerald-500/20 text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'Accepted', label: 'Accepted', color: 'bg-green-500/20 text-green-400', border: 'border-green-500/30' },
  { id: 'Rejected', label: 'Rejected', color: 'bg-rose-500/20 text-rose-400', border: 'border-rose-500/30' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onStatusChange,
  onSelectApplication,
  theme,
}) => {
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData('text/plain', appId);
    setDraggedAppId(appId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('text/plain') || draggedAppId;
    if (appId) {
      onStatusChange(appId, targetStatus);
    }
    setDraggedAppId(null);
  };

  // Helper for source badge styling
  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'LinkedIn':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'Glints':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'JobStreet':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Government Website':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <span>Application Pipeline</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Interactive Kanban
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Drag cards or click stage arrows to move applications through your hiring pipeline.
          </p>
        </div>
      </div>

      {/* Horizontal Kanban Scroll Area */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
        {PIPELINE_STAGES.map((stage) => {
          const stageApps = applications.filter((app) => app.status === stage.id);
          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`w-80 shrink-0 rounded-2xl p-3.5 snap-start transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/60 border border-slate-800/80 backdrop-blur-md'
                  : 'bg-slate-100/90 border border-slate-200'
              }`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${stage.color} ${stage.border}`}
                  >
                    {stage.label}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-semibold">
                    {stageApps.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 min-h-[350px]">
                {stageApps.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-700/30 rounded-xl flex items-center justify-center text-xs text-slate-500">
                    Drop applications here
                  </div>
                ) : (
                  stageApps.map((app) => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      onClick={() => onSelectApplication(app)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group border transform hover:-translate-y-0.5 ${
                        theme === 'dark'
                          ? 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 hover:border-cyan-500/40 shadow-md hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-cyan-400 shadow-xs'
                      }`}
                    >
                      {/* Header: Logo, Company & Position */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          {app.company_logo ? (
                            <img
                              src={app.company_logo}
                              alt={app.company_name}
                              className="w-8 h-8 rounded-lg object-contain bg-slate-800 p-1 border border-slate-700 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                              {app.company_name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-200 dark:text-slate-100 truncate group-hover:text-cyan-400 transition-colors">
                              {app.company_name}
                            </h4>
                            <p className="text-xs font-medium text-slate-400 truncate">
                              {app.position}
                            </p>
                          </div>
                        </div>

                        {/* Source Badge */}
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${getSourceBadgeColor(
                            app.application_source
                          )}`}
                        >
                          {app.application_source}
                        </span>
                      </div>

                      {/* Location & Work Arrangement */}
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center space-x-1 truncate max-w-[170px]">
                          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="truncate">{app.location}</span>
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {app.work_arrangement}
                        </span>
                      </div>

                      {/* Next Action Indicator */}
                      {app.next_step && (
                        <div className="mt-2.5 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center justify-between">
                          <span className="font-medium truncate">Next: {app.next_step}</span>
                          {app.next_step_date && (
                            <span className="text-[10px] font-mono text-cyan-400 shrink-0 ml-1">
                              {new Date(app.next_step_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Dates & Quick Job Posting Link */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center space-x-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>
                            Applied:{' '}
                            {new Date(app.applied_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </span>

                        {app.application_url ? (
                          <a
                            href={app.application_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium hover:underline"
                            title="View official job posting"
                          >
                            <span>↗ Job Posting</span>
                          </a>
                        ) : (
                          <span className="text-slate-600 text-[10px]">No link</span>
                        )}
                      </div>

                      {/* Quick Move Stage Controls (Manual fallback for touch/mobile) */}
                      <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Move stage:</span>
                        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                          {PIPELINE_STAGES.map((st, idx) => {
                            if (st.id === app.status) return null;
                            return (
                              <button
                                key={st.id}
                                onClick={() => onStatusChange(app.id, st.id)}
                                title={`Move to ${st.label}`}
                                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 border border-slate-700 transition-colors"
                              >
                                {st.label.substring(0, 3)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
