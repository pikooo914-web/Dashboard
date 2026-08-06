import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Plus,
  Link,
  Building,
  Briefcase,
  DollarSign,
  Calendar,
  User,
  Mail,
  FileText,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import {
  JobApplication,
  ApplicationSource,
  ApplicationStatus,
  WorkArrangement,
  JobType,
  DocumentCategory,
} from '../types';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (application: Partial<JobApplication>, documentFiles?: any[]) => void;
  initialData?: JobApplication | null;
  theme: 'dark' | 'light';
}

const SOURCES: ApplicationSource[] = [
  'LinkedIn',
  'JobStreet',
  'Glints',
  'Kalibrr',
  'Indeed',
  'Company Website',
  'Instagram',
  'WhatsApp',
  'Telegram',
  'Referral',
  'Campus / University',
  'Government Website',
  'Other',
];

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  theme,
}) => {
  if (!isOpen) return null;

  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('Jakarta, Indonesia');
  const [jobType, setJobType] = useState<JobType>('Full-time');
  const [workArrangement, setWorkArrangement] = useState<WorkArrangement>('Hybrid');
  const [salary, setSalary] = useState('');
  const [applicationSource, setApplicationSource] = useState<ApplicationSource>('LinkedIn');
  const [customSource, setCustomSource] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; category: DocumentCategory; size: number; content: string }[]
  >([]);

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.company_name || '');
      setPosition(initialData.position || '');
      setLocation(initialData.location || '');
      setJobType(initialData.job_type || 'Full-time');
      setWorkArrangement(initialData.work_arrangement || 'Hybrid');
      setSalary(initialData.salary || '');
      setApplicationSource(initialData.application_source || 'LinkedIn');
      setApplicationUrl(initialData.application_url || '');
      setAppliedDate(initialData.applied_date || new Date().toISOString().split('T')[0]);
      setDeadline(initialData.deadline || '');
      setStatus(initialData.status || 'Applied');
      setRecruiterName(initialData.recruiter_name || '');
      setRecruiterEmail(initialData.recruiter_email || '');
      setNotes(initialData.notes || '');
    } else {
      setCompanyName('');
      setPosition('');
      setLocation('Jakarta, Indonesia');
      setJobType('Full-time');
      setWorkArrangement('Hybrid');
      setSalary('');
      setApplicationSource('LinkedIn');
      setCustomSource('');
      setApplicationUrl('');
      setAppliedDate(new Date().toISOString().split('T')[0]);
      setDeadline('');
      setStatus('Applied');
      setRecruiterName('');
      setRecruiterEmail('');
      setNotes('');
      setUploadedFiles([]);
    }
  }, [initialData, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            category: 'CV',
            size: file.size,
            content: (event.target?.result as string) || 'Sample file payload',
          },
        ]);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !position.trim()) return;

    const sourceToSave =
      applicationSource === 'Other' && customSource.trim()
        ? (customSource.trim() as ApplicationSource)
        : applicationSource;

    onSave(
      {
        id: initialData?.id,
        company_name: companyName.trim(),
        position: position.trim(),
        location: location.trim(),
        job_type: jobType,
        work_arrangement: workArrangement,
        salary: salary.trim(),
        application_source: sourceToSave,
        application_url: applicationUrl.trim(),
        applied_date: appliedDate,
        deadline: deadline || undefined,
        status,
        recruiter_name: recruiterName.trim(),
        recruiter_email: recruiterEmail.trim(),
        notes: notes.trim(),
      },
      uploadedFiles
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        className={`w-full max-w-2xl rounded-2xl border my-8 shadow-2xl transition-all ${
          theme === 'dark'
            ? 'glass-panel-dark border-cyan-500/30 text-slate-100'
            : 'glass-panel-light border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-cyan-500/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-tight">
                {initialData ? 'Edit Application' : 'Add New Job Application'}
              </h3>
              <p className="text-xs text-slate-400">
                Track job opportunities, URLs, deadlines, and recruiter contacts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Company & Position Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Company Name *
              </label>
              <div className="relative flex items-center">
                <Building className="w-4 h-4 absolute left-3 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, BPS, Telkom"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Position *
              </label>
              <div className="relative flex items-center">
                <Briefcase className="w-4 h-4 absolute left-3 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Analyst, Senior Data Scientist"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Location & Work Arrangement Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Jakarta, Indonesia"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as JobType)}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Arrangement
              </label>
              <select
                value={workArrangement}
                onChange={(e) => setWorkArrangement(e.target.value as WorkArrangement)}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Application Source & URL (Critical Sections 23 & 24) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Application Source *
              </label>
              <select
                value={applicationSource}
                onChange={(e) => setApplicationSource(e.target.value as ApplicationSource)}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                {SOURCES.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            {applicationSource === 'Other' && (
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Custom Source Name
                </label>
                <input
                  type="text"
                  placeholder="Specify custom source..."
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Salary (Optional)
              </label>
              <div className="relative flex items-center">
                <DollarSign className="w-4 h-4 absolute left-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. IDR 25,000,000 / month"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Job Posting URL Field */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
              Job Posting / Application URL
            </label>
            <div className="relative flex items-center">
              <Link className="w-4 h-4 absolute left-3 text-cyan-400" />
              <input
                type="url"
                placeholder="https://www.linkedin.com/jobs/view/... or company portal URL"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                className="w-full pl-9 pr-24 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
              />
              {applicationUrl && (
                <a
                  href={applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 px-2 py-1 bg-cyan-500/10 rounded-lg border border-cyan-500/20 flex items-center space-x-1"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Dates & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Applied Date
              </label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Status Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-cyan-400 font-bold focus:border-cyan-400 focus:outline-none"
              >
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Assessment">Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          {/* Recruiter Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Recruiter / Contact Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                Recruiter Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3 text-slate-500" />
                <input
                  type="email"
                  placeholder="e.g. recruiter@company.com"
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
              Notes & Preparation
            </label>
            <textarea
              rows={3}
              placeholder="Record technical requirements, interview notes, or follow-up tasks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Attach Documents Section */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Attach Documents (CV, Cover Letter, Portfolio)</span>
              </span>
              <label className="cursor-pointer text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800 text-xs text-slate-200"
                  >
                    <span className="truncate max-w-[250px]">{file.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Ready</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-cyan-500/10 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-xs shadow-[0_0_15px_rgba(0,240,255,0.35)] hover:shadow-[0_0_22px_rgba(0,240,255,0.5)] transition-all"
            >
              {initialData ? 'Save Changes' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
