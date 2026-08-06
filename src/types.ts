export type ApplicationStatus =
  | 'Applied'
  | 'Screening'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn';

export type WorkArrangement = 'On-site' | 'Hybrid' | 'Remote';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export type ApplicationSource =
  | 'LinkedIn'
  | 'JobStreet'
  | 'Glints'
  | 'Kalibrr'
  | 'Indeed'
  | 'Company Website'
  | 'Instagram'
  | 'WhatsApp'
  | 'Telegram'
  | 'Referral'
  | 'Campus / University'
  | 'Government Website'
  | 'Other';

export type DocumentCategory = 'CV' | 'Cover Letter' | 'Portfolio' | 'Certificate' | 'Other';

export interface ApplicationEvent {
  id: string;
  application_id: string;
  event_type: 'Submitted' | 'Viewed' | 'Screening' | 'Assessment' | 'Interview' | 'Offer' | 'Status Change' | 'Note';
  title: string;
  description: string;
  event_date: string; // ISO String
  completed: boolean;
}

export interface DocumentFile {
  id: string;
  user_id: string;
  application_id?: string;
  company_name?: string;
  file_name: string;
  file_type: DocumentCategory;
  file_mime: string;
  file_url?: string;
  file_content?: string; // Base64 or plain text representation for preview
  file_size: number; // in bytes
  created_at: string;
}

export interface Company {
  id: string;
  user_id: string;
  name: string;
  logo_url?: string;
  industry: string;
  location: string;
  website?: string;
  created_at: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  company_id?: string;
  company_name: string;
  company_logo?: string;
  position: string;
  location: string;
  job_type: JobType;
  work_arrangement: WorkArrangement;
  salary?: string;
  application_source: ApplicationSource;
  application_url?: string;
  applied_date: string;
  deadline?: string;
  status: ApplicationStatus;
  recruiter_name?: string;
  recruiter_email?: string;
  notes?: string;
  events?: ApplicationEvent[];
  documents?: DocumentFile[];
  next_step?: string;
  next_step_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ReminderNotification {
  id: string;
  user_id: string;
  application_id?: string;
  title: string;
  description: string;
  type: 'interview' | 'assessment' | 'deadline' | 'followup' | 'status_change';
  reminder_date: string;
  read: boolean;
  completed: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  target_role?: string;
  created_at: string;
}

export interface AnalyticsSummary {
  totalApplications: number;
  activeApplications: number;
  interviewsCount: number;
  offersCount: number;
  acceptedCount: number;
  rejectedCount: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
}
