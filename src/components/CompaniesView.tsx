import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Globe,
  Briefcase,
  Calendar,
  Search,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { Company, JobApplication } from '../types';

interface CompaniesViewProps {
  companies: Company[];
  applications: JobApplication[];
  onSelectCompany: (companyName: string) => void;
  theme: 'dark' | 'light';
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  companies,
  applications,
  onSelectCompany,
  theme,
}) => {
  const [search, setSearch] = useState('');

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 my-6">
      {/* Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>Target Companies Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Overview of companies, active recruitment pipelines, and interview statistics.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search company or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((comp) => {
          const companyApps = applications.filter(
            (a) => a.company_name.toLowerCase() === comp.name.toLowerCase()
          );
          const activeCount = companyApps.filter((a) =>
            ['Applied', 'Screening', 'Assessment', 'Interview'].includes(a.status)
          ).length;
          const interviewCount = companyApps.filter((a) => a.status === 'Interview').length;

          return (
            <div
              key={comp.id}
              onClick={() => onSelectCompany(comp.name)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                theme === 'dark'
                  ? 'glass-panel-dark border-cyan-500/15 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                  : 'glass-panel-light border-slate-200 hover:border-cyan-400'
              }`}
            >
              {/* Header: Logo, Name & Website */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  {comp.logo_url ? (
                    <img
                      src={comp.logo_url}
                      alt={comp.name}
                      className="w-10 h-10 rounded-xl object-contain bg-slate-900 p-1.5 border border-slate-700 shadow-md shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {comp.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-100 truncate hover:text-cyan-400">
                      {comp.name}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">{comp.industry}</p>
                  </div>
                </div>

                {comp.website && (
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    title="Visit official website"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                )}
              </div>

              {/* Location */}
              <p className="mt-3 text-xs text-slate-400 flex items-center space-x-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{comp.location}</span>
              </p>

              {/* Company Stats Grid */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Total</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{companyApps.length}</p>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Active</p>
                  <p className="text-sm font-bold text-cyan-400 mt-0.5">{activeCount}</p>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Interviews</p>
                  <p className="text-sm font-bold text-amber-400 mt-0.5">{interviewCount}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
