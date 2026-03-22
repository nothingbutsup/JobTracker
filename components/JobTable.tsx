import React from 'react';
import { JobApplication, JobStatus } from '../types';
import StatusBadge from './StatusBadge';
import { Edit2, Trash2, ExternalLink, Download, FileText, StickyNote } from 'lucide-react';

interface JobTableProps {
  applications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
  onView: (app: JobApplication) => void;
}

const JobTable: React.FC<JobTableProps> = ({ applications, onEdit, onDelete, onView }) => {
  // Helper to ensure date is displayed as dd/mm/yyyy
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    
    // If it's already in dd/mm/yyyy (approximate check), return it
    if (dateString.includes('/')) return dateString;
    
    // Fallback for legacy YYYY-MM-DD data
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    
    return dateString;
  };

  const truncate = (str: string, length: number) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  };

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border rounded-lg border-slate-200 shadow-sm">
        <div className="p-4 mb-4 bg-slate-50 rounded-full">
           <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No applications yet</h3>
        <p className="mt-1 text-sm text-slate-500">Get started by adding a new job application.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full table-fixed divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="w-[25%] px-6 py-3 text-xs font-medium tracking-wider text-left text-slate-500 uppercase">Company & Role</th>
              <th scope="col" className="w-[12%] px-6 py-3 text-xs font-medium tracking-wider text-left text-slate-500 uppercase">Job Link</th>
              <th scope="col" className="w-[12%] px-6 py-3 text-xs font-medium tracking-wider text-left text-slate-500 uppercase">Date</th>
              <th scope="col" className="w-[12%] px-6 py-3 text-xs font-medium tracking-wider text-left text-slate-500 uppercase">Status</th>
              <th scope="col" className="w-[20%] px-6 py-3 text-xs font-medium tracking-wider text-left text-slate-500 uppercase">Notes</th>
              <th scope="col" className="w-[10%] px-6 py-3 text-xs font-medium tracking-wider text-left text-slate-500 uppercase">Resume</th>
              <th scope="col" className="w-[9%] relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {applications.map((app) => (
              <tr 
                key={app.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => onView(app)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{app.company}</span>
                    <span className="text-xs text-slate-500" title={app.role}>
                      {truncate(app.role, 45)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                  {app.jobLink ? (
                    <a 
                      href={app.jobLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center text-primary-600 hover:text-primary-800 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Link <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                  {formatDate(app.dateApplied)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate text-left">
                  <div className="flex items-center justify-start gap-1.5" title={app.notes}>
                    {app.notes ? (
                      <>
                        <StickyNote className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{app.notes}</span>
                      </>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                   {app.cvBase64 ? (
                     <a 
                       href={app.cvBase64} 
                       download={app.cvFileName || 'resume'} 
                       className="flex items-center text-slate-600 hover:text-primary-600" 
                       title={app.cvFileName || 'Download CV'}
                       onClick={(e) => e.stopPropagation()}
                     >
                        <Download className="w-4 h-4 mr-1" /> CV
                     </a>
                   ) : (
                     <span className="text-slate-300">-</span>
                   )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(app);
                      }}
                      className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(app.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobTable;
