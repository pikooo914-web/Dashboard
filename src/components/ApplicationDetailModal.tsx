import React, { useState } from 'react';
import {
  X,
  Building,
  MapPin,
  ExternalLink,
  Calendar,
  Clock,
  User,
  Mail,
  DollarSign,
  FileText,
  Trash2,
  Edit,
  Plus,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Globe,
  Upload,
} from 'lucide-react';
import { JobApplication, ApplicationStatus, DocumentFile } from '../types';

interface ApplicationDetailModalProps {
  application: JobApplication | null;
  onClose: () => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (appId: string) => void;
  onStatusChange: (appId: string, status: ApplicationStatus) => void;
  onAddEvent: (appId: string, event: { title: string; description: string; event_type: any }) => void;
  onUpdateNotes: (appId: string, notes: string) => void;
  documents: DocumentFile[];
  onUploadDoc: (appId: string, companyName: string) => void;
  theme: 'dark' | 'light';
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onAddEvent,
  onUpdateNotes,
  documents,
  onUploadDoc,
  theme,
}) => {
  if (!application) return null;

  const [notesText, setNotesText] = useState(application.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [showAddEventForm, setShowAddEventForm] = useState(false);

  const appDocs = documents.filter((d) => d.application_id === application.id);

  const handleSaveNotes = () => {
    onUpdateNotes(application.id, notesText);
    setIsEditingNotes(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    onAddEvent(application.id, {
      title: newEventTitle.trim(),
      description: newEventDesc.trim(),
      event_type: 'Note',
    });
    setNewEventTitle('');
    setNewEventDesc('');
    setShowAddEventForm(false);
  };

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
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div
        className={`w-full max-w-3xl rounded-2xl border my-6 shadow-2xl transition-all ${
          theme === 'dark'
            ? 'glass-panel-dark border-cyan-500/30 text-slate-100'
            : 'glass-panel-light border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-cyan-500/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              {application.company_logo ? (
                <img
                  src={application.company_logo}
                  alt={application.company_name}
                  className="w-12 h-12 rounded-xl object-contain bg-slate-900 p-1.5 border border-slate-700 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {application.company_name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-100">
                    {application.company_name}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-cyan-400 mt-0.5">
                  {application.position}
                </p>
                <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{application.location}</span>
                  </span>
                  <span>•</span>
                  <span>{application.job_type}</span>
                  <span>•</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                    {application.work_arrangement}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar & Quick Job Link (Section 23 Requirements) */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Source & Job URL Info Box */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400">Source:</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/20">
                  {application.application_source}
                </span>
              </div>

              {application.application_url ? (
                <a
                  href={application.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>↗ View Job Posting</span>
                </a>
              ) : (
                <span className="text-slate-500 italic text-[11px]">No application link added</span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(application)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <select
                value={application.status}
                onChange={(e) => onStatusChange(application.id, e.target.value as ApplicationStatus)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 font-bold text-xs focus:outline-none"
              >
                <option value="Applied">Change: Applied</option>
                <option value="Screening">Change: Screening</option>
                <option value="Assessment">Change: Assessment</option>
                <option value="Interview">Change: Interview</option>
                <option value="Offer">Change: Offer</option>
                <option value="Accepted">Change: Accepted</option>
                <option value="Rejected">Change: Rejected</option>
              </select>

              <button
                onClick={() => onDelete(application.id)}
                className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                title="Delete application"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto divide-y divide-slate-800">
          {/* Key Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-400 font-mono text-[10px] uppercase">Applied Date</p>
              <p className="font-bold text-slate-200 mt-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{application.applied_date}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-400 font-mono text-[10px] uppercase">Deadline</p>
              <p className="font-bold text-slate-200 mt-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{application.deadline || 'No deadline'}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-400 font-mono text-[10px] uppercase">Salary</p>
              <p className="font-bold text-slate-200 mt-1 truncate">
                {application.salary || 'Undisclosed'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-400 font-mono text-[10px] uppercase">Recruiter</p>
              <p className="font-bold text-slate-200 mt-1 truncate">
                {application.recruiter_name || 'Not specified'}
              </p>
              {application.recruiter_email && (
                <a
                  href={`mailto:${application.recruiter_email}`}
                  className="text-[10px] text-cyan-400 hover:underline truncate block"
                >
                  {application.recruiter_email}
                </a>
              )}
            </div>
          </div>

          {/* Interactive Application Timeline (Section 7) */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Application Timeline</span>
              </h3>
              <button
                onClick={() => setShowAddEventForm(!showAddEventForm)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event / Update</span>
              </button>
            </div>

            {/* Add Event Form */}
            {showAddEventForm && (
              <form onSubmit={handleCreateEvent} className="mb-4 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <input
                  type="text"
                  placeholder="Event title (e.g. Completed HR Screening)"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-950 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Description..."
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-950 border border-slate-700 text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddEventForm(false)}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg"
                  >
                    Add Timeline Event
                  </button>
                </div>
              </form>
            )}

            {/* Timeline Visual Line */}
            <div className="relative pl-6 space-y-4 border-l-2 border-cyan-500/30">
              {application.events && application.events.length > 0 ? (
                application.events.map((ev) => (
                  <div key={ev.id} className="relative group">
                    <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_8px_#00f0ff]" />
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{ev.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(ev.event_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-400 leading-relaxed">{ev.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No timeline events logged yet.
                </p>
              )}
            </div>
          </div>

          {/* Notes & Prep Section */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Notes & Interview Preparation</span>
              </h3>
              {!isEditingNotes ? (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Edit Notes
                </button>
              ) : (
                <button
                  onClick={handleSaveNotes}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Save Notes
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                rows={4}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                className="w-full p-3 rounded-xl text-xs bg-slate-900 border border-cyan-500/40 text-slate-200 focus:outline-none"
              />
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {application.notes || 'No custom notes recorded for this application.'}
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Attached Documents</span>
              </h3>
              <button
                onClick={() => onUploadDoc(application.id, application.company_name)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
            </div>

            {appDocs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {appDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-200 truncate">{doc.file_name}</p>
                        <p className="text-[10px] text-slate-400">
                          {doc.file_type} • {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No files attached to this application.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
