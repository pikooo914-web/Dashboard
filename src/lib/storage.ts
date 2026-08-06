import {
  JobApplication,
  Company,
  DocumentFile,
  ReminderNotification,
  UserProfile,
  ApplicationStatus,
} from '../types';
import {
  INITIAL_APPLICATIONS,
  INITIAL_COMPANIES,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER,
} from '../data/mockData';
import { getSupabaseClient } from './supabase';

const KEYS = {
  APPLICATIONS: 'cybertrack_applications_v1',
  COMPANIES: 'cybertrack_companies_v1',
  DOCUMENTS: 'cybertrack_documents_v1',
  NOTIFICATIONS: 'cybertrack_notifications_v1',
  USER: 'cybertrack_user_v1',
  THEME: 'cybertrack_theme_mode',
};

// Application State Helper
export function getStoredApplications(): JobApplication[] {
  try {
    const data = localStorage.getItem(KEYS.APPLICATIONS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading stored applications', e);
  }
  // Initialize with initial mock data
  saveStoredApplications(INITIAL_APPLICATIONS);
  return INITIAL_APPLICATIONS;
}

export function saveStoredApplications(apps: JobApplication[]): void {
  try {
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));
    syncToSupabase('applications', apps);
  } catch (e) {
    console.error('Error saving applications', e);
  }
}

// Companies Helper
export function getStoredCompanies(): Company[] {
  try {
    const data = localStorage.getItem(KEYS.COMPANIES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading stored companies', e);
  }
  saveStoredCompanies(INITIAL_COMPANIES);
  return INITIAL_COMPANIES;
}

export function saveStoredCompanies(companies: Company[]): void {
  try {
    localStorage.setItem(KEYS.COMPANIES, JSON.stringify(companies));
    syncToSupabase('companies', companies);
  } catch (e) {
    console.error('Error saving companies', e);
  }
}

// Documents Helper
export function getStoredDocuments(): DocumentFile[] {
  try {
    const data = localStorage.getItem(KEYS.DOCUMENTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading stored documents', e);
  }
  saveStoredDocuments(INITIAL_DOCUMENTS);
  return INITIAL_DOCUMENTS;
}

export function saveStoredDocuments(docs: DocumentFile[]): void {
  try {
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
    syncToSupabase('documents', docs);
  } catch (e) {
    console.error('Error saving documents', e);
  }
}

// Notifications Helper
export function getStoredNotifications(): ReminderNotification[] {
  try {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading stored notifications', e);
  }
  saveStoredNotifications(INITIAL_NOTIFICATIONS);
  return INITIAL_NOTIFICATIONS;
}

export function saveStoredNotifications(notifs: ReminderNotification[]): void {
  try {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  } catch (e) {
    console.error('Error saving notifications', e);
  }
}

// User Profile Helper
export function getStoredUser(): UserProfile {
  try {
    const data = localStorage.getItem(KEYS.USER);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading stored user', e);
  }
  return INITIAL_USER;
}

export function saveStoredUser(user: UserProfile): void {
  try {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user', e);
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
  return 'dark'; // Default to dark mode
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
  localStorage.removeItem(KEYS.APPLICATIONS);
  localStorage.removeItem(KEYS.COMPANIES);
  localStorage.removeItem(KEYS.DOCUMENTS);
  localStorage.removeItem(KEYS.NOTIFICATIONS);
  localStorage.removeItem(KEYS.USER);

  saveStoredApplications(INITIAL_APPLICATIONS);
  saveStoredCompanies(INITIAL_COMPANIES);
  saveStoredDocuments(INITIAL_DOCUMENTS);
  saveStoredNotifications(INITIAL_NOTIFICATIONS);
  saveStoredUser(INITIAL_USER);
}

// Optional Supabase Background Sync
async function syncToSupabase(table: string, payload: any) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    // Non-blocking upsert if Supabase tables exist
    await supabase.from(table).upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn(`Supabase sync skipped or failed for ${table}:`, err);
  }
}
