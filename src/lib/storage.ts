import {
  JobApplication,
  Company,
  DocumentFile,
  ReminderNotification,
  UserProfile,
} from '../types';
import {
  DEMO_USERS,
  DEFAULT_USER_DATA,
  UserAccount,
  INITIAL_USER,
} from '../data/mockData';
import { getSupabaseClient } from './supabase';

const KEYS = {
  USERS_DB: 'cybertrack_users_db_v2',
  SESSION_USER_ID: 'cybertrack_session_user_id_v2',
  THEME: 'cybertrack_theme_mode',
  APPS_PREFIX: 'cybertrack_apps_',
  COMPS_PREFIX: 'cybertrack_comps_',
  DOCS_PREFIX: 'cybertrack_docs_',
  NOTIFS_PREFIX: 'cybertrack_notifs_',
};

// --- MULTI-USER MANAGEMENT ---

export function getStoredUsers(): UserAccount[] {
  try {
    const data = localStorage.getItem(KEYS.USERS_DB);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading stored users list', e);
  }
  // Initialize with initial demo users
  localStorage.setItem(KEYS.USERS_DB, JSON.stringify(DEMO_USERS));
  return DEMO_USERS;
}

export function saveStoredUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(KEYS.USERS_DB, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users list', e);
  }
}

export function getCurrentSessionUser(): UserAccount | null {
  try {
    const sessionUserId = localStorage.getItem(KEYS.SESSION_USER_ID);
    const users = getStoredUsers();

    if (sessionUserId) {
      const found = users.find((u) => u.id === sessionUserId);
      if (found) return found;
    }

    // Default auto-login to first demo user (Eko) if no active session explicitly set or logged out
    const defaultUser = users[0] || DEMO_USERS[0];
    localStorage.setItem(KEYS.SESSION_USER_ID, defaultUser.id);
    return defaultUser;
  } catch (e) {
    console.error('Error getting session user', e);
  }
  return DEMO_USERS[0];
}

export function setCurrentSessionUser(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(KEYS.SESSION_USER_ID, user.id);
    } else {
      localStorage.removeItem(KEYS.SESSION_USER_ID);
    }
  } catch (e) {
    console.error('Error setting session user', e);
  }
}

export function loginUser(email: string, password?: string): { success: boolean; user?: UserAccount; message?: string } {
  const users = getStoredUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!found) {
    return { success: false, message: 'User account with this email was not found.' };
  }

  if (found.password && password && found.password !== password) {
    return { success: false, message: 'Invalid password. Please check your credentials.' };
  }

  setCurrentSessionUser(found);
  return { success: true, user: found };
}

export function registerUser(
  name: string,
  email: string,
  password?: string,
  targetRole?: string,
  avatar?: string
): { success: boolean; user?: UserAccount; message?: string } {
  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (existing) {
    return { success: false, message: 'An account with this email already exists. Please log in.' };
  }

  const newUserId = `usr_${Date.now()}`;
  const newUser: UserAccount = {
    id: newUserId,
    name: name.trim(),
    email: email.trim(),
    password: password || 'password123',
    avatar:
      avatar ||
      `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
    target_role: targetRole || 'Software Engineer',
    created_at: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveStoredUsers(updatedUsers);
  setCurrentSessionUser(newUser);

  // Initialize fresh user data starter
  saveUserApplications(newUserId, []);
  saveUserCompanies(newUserId, []);
  saveUserDocuments(newUserId, []);
  saveUserNotifications(newUserId, [
    {
      id: `notif_welcome_${Date.now()}`,
      user_id: newUserId,
      title: 'Welcome to CyberTrack!',
      description: `Welcome, ${newUser.name}! Start adding your active job applications to track your progress.`,
      type: 'status_change',
      reminder_date: new Date().toISOString(),
      read: false,
      completed: true,
      created_at: new Date().toISOString(),
    },
  ]);

  return { success: true, user: newUser };
}

export function logoutUser(): void {
  localStorage.removeItem(KEYS.SESSION_USER_ID);
}

// --- USER ISOLATED STORAGE DATA HELPERS ---

export function getUserApplications(userId: string): JobApplication[] {
  try {
    const key = `${KEYS.APPS_PREFIX}${userId}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);

    // If default user mock exists, initialize it
    if (DEFAULT_USER_DATA[userId]) {
      const defaultApps = DEFAULT_USER_DATA[userId].applications;
      saveUserApplications(userId, defaultApps);
      return defaultApps;
    }
  } catch (e) {
    console.error(`Error reading applications for user ${userId}`, e);
  }
  return [];
}

export function saveUserApplications(userId: string, apps: JobApplication[]): void {
  try {
    const key = `${KEYS.APPS_PREFIX}${userId}`;
    localStorage.setItem(key, JSON.stringify(apps));
    syncToSupabase('applications', apps);
  } catch (e) {
    console.error(`Error saving applications for user ${userId}`, e);
  }
}

export function getUserCompanies(userId: string): Company[] {
  try {
    const key = `${KEYS.COMPS_PREFIX}${userId}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);

    if (DEFAULT_USER_DATA[userId]) {
      const defaultComps = DEFAULT_USER_DATA[userId].companies;
      saveUserCompanies(userId, defaultComps);
      return defaultComps;
    }
  } catch (e) {
    console.error(`Error reading companies for user ${userId}`, e);
  }
  return [];
}

export function saveUserCompanies(userId: string, companies: Company[]): void {
  try {
    const key = `${KEYS.COMPS_PREFIX}${userId}`;
    localStorage.setItem(key, JSON.stringify(companies));
    syncToSupabase('companies', companies);
  } catch (e) {
    console.error(`Error saving companies for user ${userId}`, e);
  }
}

export function getUserDocuments(userId: string): DocumentFile[] {
  try {
    const key = `${KEYS.DOCS_PREFIX}${userId}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);

    if (DEFAULT_USER_DATA[userId]) {
      const defaultDocs = DEFAULT_USER_DATA[userId].documents;
      saveUserDocuments(userId, defaultDocs);
      return defaultDocs;
    }
  } catch (e) {
    console.error(`Error reading documents for user ${userId}`, e);
  }
  return [];
}

export function saveUserDocuments(userId: string, docs: DocumentFile[]): void {
  try {
    const key = `${KEYS.DOCS_PREFIX}${userId}`;
    localStorage.setItem(key, JSON.stringify(docs));
    syncToSupabase('documents', docs);
  } catch (e) {
    console.error(`Error saving documents for user ${userId}`, e);
  }
}

export function getUserNotifications(userId: string): ReminderNotification[] {
  try {
    const key = `${KEYS.NOTIFS_PREFIX}${userId}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);

    if (DEFAULT_USER_DATA[userId]) {
      const defaultNotifs = DEFAULT_USER_DATA[userId].notifications;
      saveUserNotifications(userId, defaultNotifs);
      return defaultNotifs;
    }
  } catch (e) {
    console.error(`Error reading notifications for user ${userId}`, e);
  }
  return [];
}

export function saveUserNotifications(userId: string, notifs: ReminderNotification[]): void {
  try {
    const key = `${KEYS.NOTIFS_PREFIX}${userId}`;
    localStorage.setItem(key, JSON.stringify(notifs));
  } catch (e) {
    console.error(`Error saving notifications for user ${userId}`, e);
  }
}

// --- LEGACY BACKWARD-COMPATIBLE HELPERS ---
export function getStoredApplications(): JobApplication[] {
  const current = getCurrentSessionUser();
  return current ? getUserApplications(current.id) : [];
}

export function saveStoredApplications(apps: JobApplication[]): void {
  const current = getCurrentSessionUser();
  if (current) saveUserApplications(current.id, apps);
}

export function getStoredCompanies(): Company[] {
  const current = getCurrentSessionUser();
  return current ? getUserCompanies(current.id) : [];
}

export function saveStoredCompanies(companies: Company[]): void {
  const current = getCurrentSessionUser();
  if (current) saveUserCompanies(current.id, companies);
}

export function getStoredDocuments(): DocumentFile[] {
  const current = getCurrentSessionUser();
  return current ? getUserDocuments(current.id) : [];
}

export function saveStoredDocuments(docs: DocumentFile[]): void {
  const current = getCurrentSessionUser();
  if (current) saveUserDocuments(current.id, docs);
}

export function getStoredNotifications(): ReminderNotification[] {
  const current = getCurrentSessionUser();
  return current ? getUserNotifications(current.id) : [];
}

export function saveStoredNotifications(notifs: ReminderNotification[]): void {
  const current = getCurrentSessionUser();
  if (current) saveUserNotifications(current.id, notifs);
}

export function getStoredUser(): UserProfile {
  const current = getCurrentSessionUser();
  return current || INITIAL_USER;
}

export function saveStoredUser(user: UserProfile): void {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...user };
    saveStoredUsers(users);
  }
}

// Theme Helper
export function getStoredTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {
    console.error('Error reading theme', e);
  }
  return 'dark';
}

export function saveStoredTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(KEYS.THEME, theme);
  } catch (e) {
    console.error('Error saving theme', e);
  }
}

// Reset data to default
export function resetAllData(): void {
  const current = getCurrentSessionUser();
  if (current && DEFAULT_USER_DATA[current.id]) {
    saveUserApplications(current.id, DEFAULT_USER_DATA[current.id].applications);
    saveUserCompanies(current.id, DEFAULT_USER_DATA[current.id].companies);
    saveUserDocuments(current.id, DEFAULT_USER_DATA[current.id].documents);
    saveUserNotifications(current.id, DEFAULT_USER_DATA[current.id].notifications);
  }
}

// Optional Supabase Background Sync
async function syncToSupabase(table: string, payload: any) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    await supabase.from(table).upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn(`Supabase sync skipped or failed for ${table}:`, err);
  }
}
