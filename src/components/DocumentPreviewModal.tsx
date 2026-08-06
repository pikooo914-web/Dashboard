import React from 'react';
import { X, FileText, Download, Calendar, HardDrive, Building } from 'lucide-react';
import { DocumentFile } from '../types';

interface DocumentPreviewModalProps {
  document: DocumentFile | null;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
  theme,
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div
        className={`w-full max-w-2xl rounded-2xl border my-6 shadow-2xl transition-all ${
          theme === 'dark'
            ? 'glass-panel-dark border-cyan-500/30 text-slate-100'
            : 'glass-panel-light border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-cyan-500/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 truncate max-w-md">
                {document.file_name}
              </h3>
              <p className="text-xs text-slate-400">
                {document.file_type} • {(document.file_size / 1024 / 1024).toFixed(2)} MB
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

        {/* Modal Content Preview */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[220px] max-h-[350px] overflow-y-auto text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
            {document.file_content || (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p>[ Binary PDF Preview Mode ]</p>
                <p className="text-[10px] mt-1">Official Document File Ready for Download</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 font-mono pt-2">
            <div>Company: {document.company_name || 'General'}</div>
            <div>
              Uploaded:{' '}
              {new Date(document.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-cyan-500/10 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            Close
          </button>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(
              document.file_content || 'Sample file payload'
            )}`}
            download={document.file_name}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-[0_0_12px_#00f0ff]"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </a>
        </div>
      </div>
    </div>
  );
};
