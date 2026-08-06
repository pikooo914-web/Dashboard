import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Database,
  User,
  Download,
  Upload,
  RefreshCw,
  Key,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
} from '../lib/supabase';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  theme: 'dark' | 'light';
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onResetData,
  onExportData,
  onImportData,
  theme,
}) => {
  const currentCreds = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(currentCreds.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(currentCreds.key);
  const [saveMessage, setSaveMessage] = useState('');

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [targetRole, setTargetRole] = useState(user.target_role || '');

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(supabaseUrl, supabaseAnonKey);
    setSaveMessage('Supabase credentials updated! Database synchronization active.');
    setTimeout(() => setSaveMessage(''), 3500);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, name, email, target_role: targetRole });
    setSaveMessage('User profile saved successfully.');
    setTimeout(() => setSaveMessage(''), 3500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          onImportData(evt.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 my-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" />
          <span>System Settings & Configuration</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure Supabase backend authentication, database backups, and personal profiles.
        </p>
      </div>

      {saveMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Profile Settings */}
      <div
        className={`p-5 rounded-2xl border ${
          theme === 'dark'
            ? 'glass-panel-dark border-cyan-500/15'
            : 'glass-panel-light border-slate-200'
        }`}
      >
        <h3 className="font-bold text-sm text-slate-100 mb-4 flex items-center space-x-2">
          <User className="w-4 h-4 text-cyan-400" />
          <span>User Profile & Target Role</span>
        </h3>

        <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono uppercase text-slate-400 mb-1">
              Target Career Role
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Data Analyst / Data Scientist"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_12px_#00f0ff]"
          >
            Save Profile
          </button>
        </form>
      </div>

      {/* Supabase Backend Integration (Section 18, 19, 20) */}
      <div
        className={`p-5 rounded-2xl border ${
          theme === 'dark'
            ? 'glass-panel-dark border-cyan-500/15'
            : 'glass-panel-light border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Supabase Database & Auth Integration</span>
          </h3>
          {currentCreds.isConfigured ? (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Connected</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Local Mode (Supabase Optional)
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Provide your Supabase URL and Anon Key to enable real-time PostgreSQL synchronization & Row Level Security.
        </p>

        <form onSubmit={handleSaveSupabase} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono uppercase text-slate-400 mb-1">
              NEXT_PUBLIC_SUPABASE_URL
            </label>
            <input
              type="text"
              placeholder="https://your-project.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono uppercase text-slate-400 mb-1">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-[0_0_12px_rgba(168,85,247,0.3)]"
          >
            Connect Supabase
          </button>
        </form>
      </div>

      {/* Data Import / Export & Reset */}
      <div
        className={`p-5 rounded-2xl border ${
          theme === 'dark'
            ? 'glass-panel-dark border-cyan-500/15'
            : 'glass-panel-light border-slate-200'
        }`}
      >
        <h3 className="font-bold text-sm text-slate-100 mb-4 flex items-center space-x-2">
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Data Backup, Restore & Reset</span>
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={onExportData}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Data (JSON)</span>
          </button>

          <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center space-x-1.5">
            <Upload className="w-4 h-4 text-violet-400" />
            <span>Import Data (JSON)</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={onResetData}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold flex items-center space-x-1.5 ml-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Sample Data (Eko)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
