import React from 'react';
import {
  ExternalLink,
  Eye,
  MoreHorizontal,
  MapPin,
  Calendar,
  Building,
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../types';

interface ApplicationsTableProps {
  applications: JobApplication[];
  onSelectApplication: (app: JobApplication) => void;
  onStatusChange: (appId: string, status: ApplicationStatus) => void;
  onDeleteApplication: (appId: string) => void;
  theme: 'dark' | 'light';
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onSelectApplication,
  onStatusChange,
  onDeleteApplication,
  theme,
}) => {
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'Screening':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'Assessment':
        return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'Interview':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Offer':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Accepted':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Withdrawn':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'LinkedIn':
        return 'bg-blue-600/15 text-blue-400 border-blue-500/30';
      case 'Glints':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'JobStreet':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Government Website':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-600/30';
    }
  };

  if (applications.length === 0) {
    return (
      <div
        className={`p-10 rounded-2xl text-center border my-6 ${
          theme === 'dark'
            ? 'glass-panel-dark border-slate-800 text-slate-400'
            : 'glass-panel-light border-slate-200 text-slate-600'
        }`}
      >
        <Building className="w-12 h-12 mx-auto mb-3 text-cyan-400/50" />
        <h3 className="text-base font-bold text-slate-200 dark:text-slate-100">
          No applications found
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Start tracking your job applications and build your career pipeline command center.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border overflow-hidden my-6 ${
        theme === 'dark'
          ? 'glass-panel-dark border-cyan-500/15'
          : 'glass-panel-light border-slate-200'
      }`}
    >
      <div className="p-4 border-b border-cyan-500/10 flex items-center justify-between">
        <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <span>Recent Applications</span>
          <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {applications.length} total
          </span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr
              className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                theme === 'dark'
                  ? 'bg-slate-950/60 text-slate-400 border-slate-800'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              <th className="py-3.5 px-4 font-semibold">Company</th>
              <th className="py-3.5 px-4 font-semibold">Position</th>
              <th className="py-3.5 px-4 font-semibold">Source</th>
              <th className="py-3.5 px-4 font-semibold">Applied</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold">Next Step</th>
              <th className="py-3.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {applications.map((app) => (
              <tr
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className={`cursor-pointer transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-cyan-500/5 text-slate-200'
                    : 'hover:bg-cyan-50 text-slate-800'
                }`}
              >
                {/* Company Name & Logo */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2.5">
                    {app.company_logo ? (
                      <img
                        src={app.company_logo}
                        alt={app.company_name}
                        className="w-7 h-7 rounded-lg object-contain bg-slate-800 p-0.5 border border-slate-700 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {app.company_name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-slate-200 dark:text-slate-100 truncate hover:text-cyan-400">
                        {app.company_name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate flex items-center space-x-1">
                        <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                        <span>{app.location}</span>
                      </p>
                    </div>
                  </div>
                </td>

                {/* Position */}
                <td className="py-3.5 px-4 font-medium text-slate-200 dark:text-slate-100">
                  {app.position}
                </td>

                {/* Source Badge */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono border ${getSourceBadge(
                      app.application_source
                    )}`}
                  >
                    {app.application_source}
                  </span>
                </td>

                {/* Applied Date */}
                <td className="py-3.5 px-4 font-mono text-slate-400">
                  {new Date(app.applied_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold border ${getStatusBadge(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </td>

                {/* Next Step */}
                <td className="py-3.5 px-4 text-slate-300">
                  {app.next_step ? (
                    <span className="text-cyan-300 font-medium">{app.next_step}</span>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>

                {/* Action Buttons */}
                <td className="py-3.5 px-4 text-right">
                  <div
                    className="flex items-center justify-end space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onSelectApplication(app)}
                      className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors flex items-center space-x-1 text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    {app.application_url && (
                      <a
                        href={app.application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        title="View job posting URL"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
