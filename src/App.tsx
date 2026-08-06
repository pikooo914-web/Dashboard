import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { SummaryCards } from './components/SummaryCards';
import { KanbanBoard } from './components/KanbanBoard';
import { ApplicationsTable } from './components/ApplicationsTable';
import { AddApplicationModal } from './components/AddApplicationModal';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { CalendarView } from './components/CalendarView';
import { CompaniesView } from './components/CompaniesView';
import { DocumentsView } from './components/DocumentsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import {
  JobApplication,
  Company,
  DocumentFile,
  ReminderNotification,
  UserProfile,
  ApplicationStatus,
  DocumentCategory,
} from './types';
import {
  getStoredApplications,
  saveStoredApplications,
  getStoredCompanies,
  saveStoredCompanies,
  getStoredDocuments,
  saveStoredDocuments,
  getStoredNotifications,
  saveStoredNotifications,
  getStoredUser,
  saveStoredUser,
  getStoredTheme,
  saveStoredTheme,
  resetAllData,
} from './lib/storage';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getStoredTheme());
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<string>('All');

  // Application Data States
  const [user, setUser] = useState<UserProfile>(getStoredUser());
  const [applications, setApplications] = useState<JobApplication[]>(getStoredApplications());
  const [companies, setCompanies] = useState<Company[]>(getStoredCompanies());
  const [documents, setDocuments] = useState<DocumentFile[]>(getStoredDocuments());
  const [notifications, setNotifications] = useState<ReminderNotification[]>(
    getStoredNotifications()
  );

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [selectedDetailApp, setSelectedDetailApp] = useState<JobApplication | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Synchronize dark class to html document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${user.name.split(' ')[0]} 👋`;
    if (hour < 18) return `Good afternoon, ${user.name.split(' ')[0]} 👋`;
    return `Good evening, ${user.name.split(' ')[0]} 👋`;
  };

  // Search and status filter logic
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.application_source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedFilterStatus === 'All' || app.status === selectedFilterStatus;

    return matchesSearch && matchesStatus;
  });

  // Handle saving new/edited application
  const handleSaveApplication = (
    data: Partial<JobApplication>,
    newFiles?: { name: string; category: DocumentCategory; size: number; content: string }[]
  ) => {
    let updatedApps: JobApplication[] = [];

    if (data.id) {
      // Edit existing
      updatedApps = applications.map((app) => {
        if (app.id === data.id) {
          return {
            ...app,
            ...data,
            updated_at: new Date().toISOString(),
          } as JobApplication;
        }
        return app;
      });
    } else {
      // Create new application
      const newAppId = `app_${Date.now()}`;
      const newApp: JobApplication = {
        id: newAppId,
        user_id: user.id,
        company_name: data.company_name || 'New Company',
        company_logo: `https://www.google.com/favicon.ico`,
        position: data.position || 'Software Engineer',
        location: data.location || 'Jakarta, Indonesia',
        job_type: data.job_type || 'Full-time',
        work_arrangement: data.work_arrangement || 'Hybrid',
        salary: data.salary || '',
        application_source: data.application_source || 'LinkedIn',
        application_url: data.application_url || '',
        applied_date: data.applied_date || new Date().toISOString().split('T')[0],
        deadline: data.deadline || undefined,
        status: data.status || 'Applied',
        recruiter_name: data.recruiter_name || '',
        recruiter_email: data.recruiter_email || '',
        notes: data.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        events: [
          {
            id: `ev_${Date.now()}`,
            application_id: newAppId,
            event_type: 'Submitted',
            title: 'Application Submitted',
            description: `Applied via ${data.application_source || 'Online Portal'}.`,
            event_date: new Date().toISOString(),
            completed: true,
          },
        ],
      };
      updatedApps = [newApp, ...applications];

      // Auto-ensure company is added to company list
      const companyExists = companies.some(
        (c) => c.name.toLowerCase() === newApp.company_name.toLowerCase()
      );
      if (!companyExists) {
        const newCompany: Company = {
          id: `comp_${Date.now()}`,
          user_id: user.id,
          name: newApp.company_name,
          industry: 'Technology & Corporate',
          location: newApp.location,
          website: newApp.application_url,
          created_at: new Date().toISOString(),
        };
        const updatedComp = [newCompany, ...companies];
        setCompanies(updatedComp);
        saveStoredCompanies(updatedComp);
      }
    }

    setApplications(updatedApps);
    saveStoredApplications(updatedApps);

    // Process file uploads
    if (newFiles && newFiles.length > 0) {
      const newDocs: DocumentFile[] = newFiles.map((f, idx) => ({
        id: `doc_${Date.now()}_${idx}`,
        user_id: user.id,
        application_id: data.id || updatedApps[0].id,
        company_name: data.company_name,
        file_name: f.name,
        file_type: f.category,
        file_mime: 'application/pdf',
        file_content: f.content,
        file_size: f.size,
        created_at: new Date().toISOString(),
      }));
      const updatedDocs = [...newDocs, ...documents];
      setDocuments(updatedDocs);
      saveStoredDocuments(updatedDocs);
    }

    setEditingApplication(null);
  };

  // Status Change Handler
  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    const updated = applications.map((app) => {
      if (app.id === appId) {
        const updatedEvents = app.events || [];
        updatedEvents.push({
          id: `ev_status_${Date.now()}`,
          application_id: appId,
          event_type: 'Status Change',
          title: `Status Changed to ${newStatus}`,
          description: `Updated application stage to ${newStatus}.`,
          event_date: new Date().toISOString(),
          completed: true,
        });

        return {
          ...app,
          status: newStatus,
          updated_at: new Date().toISOString(),
          events: updatedEvents,
        };
      }
      return app;
    });

    setApplications(updated);
    saveStoredApplications(updated);

    if (selectedDetailApp && selectedDetailApp.id === appId) {
      setSelectedDetailApp(updated.find((a) => a.id === appId) || null);
    }
  };

  // Delete Handler
  const handleDeleteApplication = (appId: string) => {
    const updated = applications.filter((app) => app.id !== appId);
    setApplications(updated);
    saveStoredApplications(updated);
    if (selectedDetailApp?.id === appId) setSelectedDetailApp(null);
  };

  // Add event handler
  const handleAddTimelineEvent = (
    appId: string,
    event: { title: string; description: string; event_type: any }
  ) => {
    const updated = applications.map((app) => {
      if (app.id === appId) {
        const currentEvs = app.events || [];
        return {
          ...app,
          events: [
            ...currentEvs,
            {
              id: `ev_custom_${Date.now()}`,
              application_id: appId,
              event_type: event.event_type,
              title: event.title,
              description: event.description,
              event_date: new Date().toISOString(),
              completed: true,
            },
          ],
        };
      }
      return app;
    });
    setApplications(updated);
    saveStoredApplications(updated);
    if (selectedDetailApp?.id === appId) {
      setSelectedDetailApp(updated.find((a) => a.id === appId) || null);
    }
  };

  // Update Notes Handler
  const handleUpdateNotes = (appId: string, notes: string) => {
    const updated = applications.map((app) => {
      if (app.id === appId) return { ...app, notes, updated_at: new Date().toISOString() };
      return app;
    });
    setApplications(updated);
    saveStoredApplications(updated);
    if (selectedDetailApp?.id === appId) {
      setSelectedDetailApp(updated.find((a) => a.id === appId) || null);
    }
  };

  // Document upload handler
  const handleUploadDocument = (doc: {
    file_name: string;
    file_type: DocumentCategory;
    file_content: string;
    file_size: number;
    company_name?: string;
  }) => {
    const newDoc: DocumentFile = {
      id: `doc_${Date.now()}`,
      user_id: user.id,
      company_name: doc.company_name || 'General',
      file_name: doc.file_name,
      file_type: doc.file_type,
      file_mime: 'application/pdf',
      file_content: doc.file_content,
      file_size: doc.file_size,
      created_at: new Date().toISOString(),
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveStoredDocuments(updated);
  };

  const handleDeleteDocument = (docId: string) => {
    const updated = documents.filter((d) => d.id !== docId);
    setDocuments(updated);
    saveStoredDocuments(updated);
  };

  // Reset and JSON backup
  const handleResetData = () => {
    resetAllData();
    setApplications(getStoredApplications());
    setCompanies(getStoredCompanies());
    setDocuments(getStoredDocuments());
    setNotifications(getStoredNotifications());
    setUser(getStoredUser());
  };

  const handleExportData = () => {
    const payload = {
      user,
      applications,
      companies,
      documents,
      notifications,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberTrack_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportData = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.applications) {
        setApplications(data.applications);
        saveStoredApplications(data.applications);
      }
      if (data.companies) {
        setCompanies(data.companies);
        saveStoredCompanies(data.companies);
      }
      if (data.documents) {
        setDocuments(data.documents);
        saveStoredDocuments(data.documents);
      }
      if (data.user) {
        setUser(data.user);
        saveStoredUser(data.user);
      }
      alert('Data imported successfully!');
    } catch (e) {
      alert('Failed to parse backup JSON file.');
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'cyber-grid-dark' : 'cyber-grid-light'
      }`}
    >
      {/* Desktop & Mobile Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onLogout={handleResetData}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content View Container */}
      <div className="md:pl-64 flex flex-col min-h-screen pb-20 md:pb-6">
        {/* Topbar */}
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          onMarkAllNotificationsRead={() => {
            const updated = notifications.map((n) => ({ ...n, read: true }));
            setNotifications(updated);
            saveStoredNotifications(updated);
          }}
          onSelectNotification={(notif) => {
            if (notif.application_id) {
              const app = applications.find((a) => a.id === notif.application_id);
              if (app) setSelectedDetailApp(app);
            }
          }}
          onOpenQuickAdd={() => {
            setEditingApplication(null);
            setIsAddModalOpen(true);
          }}
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          selectedFilterStatus={selectedFilterStatus}
          setSelectedFilterStatus={setSelectedFilterStatus}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
        />

        {/* Dynamic View Pages */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
          {/* Dashboard Tab */}
          {currentTab === 'dashboard' && (
            <div>
              {/* Dynamic Greeting */}
              <div className="mb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <span>{getGreeting()}</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                  Here's an overview of your job search pipeline and application velocity.
                </p>
              </div>

              {/* Metric Summary Cards */}
              <SummaryCards
                applications={filteredApplications}
                theme={theme}
                onFilterClick={(st) => setSelectedFilterStatus(st)}
              />

              {/* Kanban Application Pipeline */}
              <KanbanBoard
                applications={filteredApplications}
                onStatusChange={handleStatusChange}
                onSelectApplication={(app) => setSelectedDetailApp(app)}
                theme={theme}
              />

              {/* Recent Applications Table */}
              <ApplicationsTable
                applications={filteredApplications}
                onSelectApplication={(app) => setSelectedDetailApp(app)}
                onStatusChange={handleStatusChange}
                onDeleteApplication={handleDeleteApplication}
                theme={theme}
              />
            </div>
          )}

          {/* Applications Tab */}
          {currentTab === 'applications' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    All Applications
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Filter, sort, and inspect all job postings and submission links.
                  </p>
                </div>
              </div>

              <ApplicationsTable
                applications={filteredApplications}
                onSelectApplication={(app) => setSelectedDetailApp(app)}
                onStatusChange={handleStatusChange}
                onDeleteApplication={handleDeleteApplication}
                theme={theme}
              />
            </div>
          )}

          {/* Companies Tab */}
          {currentTab === 'companies' && (
            <CompaniesView
              companies={companies}
              applications={applications}
              onSelectCompany={(compName) => {
                setSearchQuery(compName);
                setCurrentTab('applications');
              }}
              theme={theme}
            />
          )}

          {/* Calendar Tab */}
          {currentTab === 'calendar' && (
            <CalendarView
              applications={applications}
              notifications={notifications}
              onSelectApplication={(app) => setSelectedDetailApp(app)}
              theme={theme}
            />
          )}

          {/* Documents Tab */}
          {currentTab === 'documents' && (
            <DocumentsView
              documents={documents}
              onUploadDocument={handleUploadDocument}
              onDeleteDocument={handleDeleteDocument}
              theme={theme}
            />
          )}

          {/* Analytics Tab */}
          {currentTab === 'analytics' && (
            <AnalyticsView applications={applications} theme={theme} />
          )}

          {/* Settings Tab */}
          {currentTab === 'settings' && (
            <SettingsView
              user={user}
              onUpdateUser={(updated) => {
                setUser(updated);
                saveStoredUser(updated);
              }}
              onResetData={handleResetData}
              onExportData={handleExportData}
              onImportData={handleImportData}
              theme={theme}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Application Modal */}
      <AddApplicationModal
        isOpen={isAddModalOpen || editingApplication !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingApplication(null);
        }}
        onSave={handleSaveApplication}
        initialData={editingApplication}
        theme={theme}
      />

      {/* Application Detail View Modal */}
      <ApplicationDetailModal
        application={selectedDetailApp}
        onClose={() => setSelectedDetailApp(null)}
        onEdit={(app) => {
          setSelectedDetailApp(null);
          setEditingApplication(app);
        }}
        onDelete={handleDeleteApplication}
        onStatusChange={handleStatusChange}
        onAddEvent={handleAddTimelineEvent}
        onUpdateNotes={handleUpdateNotes}
        documents={documents}
        onUploadDoc={(appId, compName) => {
          handleUploadDocument({
            file_name: `Updated_CV_${compName}.pdf`,
            file_type: 'CV',
            file_content: `Updated CV payload for ${compName}`,
            file_size: 1520000,
            company_name: compName,
          });
        }}
        theme={theme}
      />
    </div>
  );
}
