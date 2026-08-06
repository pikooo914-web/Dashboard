import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Eye,
  Download,
  Trash2,
  FolderOpen,
  Plus,
  Building,
  CheckCircle,
} from 'lucide-react';
import { DocumentFile, DocumentCategory } from '../types';
import { DocumentPreviewModal } from './DocumentPreviewModal';

interface DocumentsViewProps {
  documents: DocumentFile[];
  onUploadDocument: (file: {
    file_name: string;
    file_type: DocumentCategory;
    file_content: string;
    file_size: number;
    company_name?: string;
  }) => void;
  onDeleteDocument: (docId: string) => void;
  theme: 'dark' | 'light';
}

const CATEGORIES: DocumentCategory[] = ['CV', 'Cover Letter', 'Portfolio', 'Certificate', 'Other'];

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onUploadDocument,
  onDeleteDocument,
  theme,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);

  const filteredDocs =
    activeCategory === 'All'
      ? documents
      : documents.filter((d) => d.file_type === activeCategory);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        onUploadDocument({
          file_name: file.name,
          file_type: (activeCategory !== 'All' ? activeCategory : 'CV') as DocumentCategory,
          file_content: (evt.target?.result as string) || 'Document content payload',
          file_size: file.size,
          company_name: 'General Career Vault',
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 my-6">
      {/* Header & Upload Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-cyan-400" />
            <span>Document Manager & Career Vault</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Store and manage CVs, Cover Letters, Portfolios, and Official Certificates.
          </p>
        </div>

        <label className="cursor-pointer flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-semibold shadow-[0_0_15px_rgba(0,240,255,0.35)] hover:shadow-[0_0_22px_rgba(0,240,255,0.5)] transition-all">
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
              activeCategory === cat
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Document Grid / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              theme === 'dark'
                ? 'glass-panel-dark border-cyan-500/15 hover:border-cyan-500/30'
                : 'glass-panel-light border-slate-200 hover:border-cyan-400'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-100 truncate" title={doc.file_name}>
                    {doc.file_name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {doc.file_type} • {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            {/* Document Info */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{doc.company_name || 'General'}</span>
              <span>
                {new Date(doc.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Actions */}
            <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-between">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <div className="flex items-center space-x-2">
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    doc.file_content || 'Sample document file payload'
                  )}`}
                  download={doc.file_name}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Download file"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onDeleteDocument(doc.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  title="Delete document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        theme={theme}
      />
    </div>
  );
};
