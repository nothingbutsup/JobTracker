import React from 'react';
import { JobApplication } from '../types';
import StatusBadge from './StatusBadge';
import { Calendar, Briefcase, Building2, Link, FileText, StickyNote, Download, ExternalLink } from 'lucide-react';
import Button from './Button';

interface JobDetailsViewProps {
  application: JobApplication;
  onClose: () => void;
  onEdit: () => void;
}

const JobDetailsView: React.FC<JobDetailsViewProps> = ({ application, onClose, onEdit }) => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4 min-w-0 flex-1 mr-4">
          <div className="p-3 bg-primary-50 rounded-xl flex-shrink-0">
            <Building2 className="w-6 h-6 text-primary-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-slate-900 truncate" title={application.company}>{application.company}</h2>
            <div className="flex items-center text-slate-500 mt-0.5">
              <Briefcase className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span className="text-sm font-medium truncate" title={application.role}>{application.role}</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={application.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Details */}
        <div className="space-y-4">
          <div className="flex items-center text-slate-600">
            <Calendar className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Applied On</p>
              <p className="text-sm font-medium">{application.dateApplied}</p>
            </div>
          </div>

          <div className="flex items-center text-slate-600">
            <Link className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Job Link</p>
              {application.jobLink ? (
                <a 
                  href={application.jobLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-medium text-primary-600 hover:underline flex items-center truncate"
                >
                  <span className="truncate">View Listing</span> <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                </a>
              ) : (
                <p className="text-sm font-medium text-slate-400">Not provided</p>
              )}
            </div>
          </div>
        </div>

        {/* Assets */}
        <div className="space-y-4">
          <div className="flex items-center text-slate-600">
            <FileText className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Resume / CV</p>
              {application.cvBase64 ? (
                <a 
                  href={application.cvBase64} 
                  download={application.cvFileName || 'resume'} 
                  className="text-sm font-medium text-primary-600 hover:underline flex items-center truncate"
                  title={application.cvFileName || 'Download CV'}
                >
                  <span className="truncate">{application.cvFileName || 'Download CV'}</span> <Download className="w-3 h-3 ml-1 flex-shrink-0" />
                </a>
              ) : (
                <p className="text-sm font-medium text-slate-400">No file uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center mb-2">
          <StickyNote className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notes</h4>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-[100px]">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
            {application.notes || 'No notes added for this application.'}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end space-x-3 pt-6">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onEdit}>
          Edit Details
        </Button>
      </div>
    </div>
  );
};

export default JobDetailsView;
