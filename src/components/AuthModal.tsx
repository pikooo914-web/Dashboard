import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  Users,
  X,
  Zap,
  Mail,
  Lock,
  User,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  getStoredUsers,
  loginUser,
  registerUser,
  setCurrentSessionUser,
} from '../lib/storage';
import { UserAccount } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount) => void;
  currentUserId?: string;
  theme: 'dark' | 'light';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  currentUserId,
  theme,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register' | 'switch'>('switch');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [avatar, setAvatar] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const usersList = getStoredUsers();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    const result = loginUser(email, password);
    if (result.success && result.user) {
      setSuccessMsg(`Welcome back, ${result.user.name}!`);
      setTimeout(() => {
        onAuthSuccess(result.user!);
        onClose();
      }, 600);
    } else {
      setErrorMsg(result.message || 'Login failed.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !email) {
      setErrorMsg('Please enter your name and email address.');
      return;
    }

    const result = registerUser(name, email, password, targetRole, avatar);
    if (result.success && result.user) {
      setSuccessMsg(`Account created! Logged in as ${result.user.name}`);
      setTimeout(() => {
        onAuthSuccess(result.user!);
        onClose();
      }, 600);
    } else {
      setErrorMsg(result.message || 'Registration failed.');
    }
  };

  const handleQuickSwitch = (user: UserAccount) => {
    setCurrentSessionUser(user);
    setSuccessMsg(`Switched to ${user.name}`);
    setTimeout(() => {
      onAuthSuccess(user);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div
        className={`w-full max-w-lg rounded-2xl border my-6 shadow-2xl transition-all overflow-hidden ${
          theme === 'dark'
            ? 'glass-panel-dark border-cyan-500/30 text-slate-100'
            : 'glass-panel-light border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-cyan-500/10 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
                <span>Multi-User Auth Center</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  v2.0
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Log in, register new account, or switch active user profile.
              </p>
            </div>
          </div>
          {currentUserId && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab Selection */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center space-x-2">
          <button
            onClick={() => {
              setMode('switch');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'switch'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch User</span>
          </button>

          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'login'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>

          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'register'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: Quick User Switcher */}
          {mode === 'switch' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono uppercase text-slate-400">
                  Select Active User Account
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {usersList.length} Accounts Registered
                </span>
              </div>

              <div className="space-y-2.5">
                {usersList.map((usr) => {
                  const isActive = usr.id === currentUserId;
                  return (
                    <div
                      key={usr.id}
                      onClick={() => handleQuickSwitch(usr)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 via-slate-900 to-violet-500/20 border-cyan-500/60 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                          : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-cyan-500/30'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={usr.avatar}
                          alt={usr.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/40 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-100 truncate group-hover:text-cyan-400">
                              {usr.name}
                            </h4>
                            {usr.isDemo && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                DEMO
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{usr.email}</p>
                          {usr.target_role && (
                            <p className="text-[10px] text-cyan-400 font-mono truncate mt-0.5">
                              {usr.target_role}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {isActive ? (
                          <span className="px-2.5 py-1 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-[10px] flex items-center space-x-1 shadow-[0_0_8px_#00f0ff]">
                            <ShieldCheck className="w-3 h-3" />
                            <span>ACTIVE</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-xl bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-300 font-bold text-xs transition-colors flex items-center space-x-1">
                            <span>Switch</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setMode('register')}
                  className="text-xs text-cyan-400 hover:underline flex items-center justify-center space-x-1 mx-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create new custom user account</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="e.g. ekodamaryogi1@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  (Demo password is <code className="text-cyan-400">password123</code> or leave blank)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-slate-950 font-extrabold text-xs shadow-[0_0_15px_rgba(0,240,255,0.35)] flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In to CyberTrack</span>
              </button>
            </form>
          )}

          {/* TAB 3: Sign Up Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Alex Pratama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="e.g. alex@company.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Target Career Role
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. AI Engineer / Data Architect"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-[0_0_15px_#00f0ff] flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account & Start Tracking</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
