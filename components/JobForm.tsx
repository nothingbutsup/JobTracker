import React, { useState, useEffect } from 'react';
import { JobApplication, JobApplicationFormData, JobStatus } from '../types';
import Button from './Button';
import { Save, Upload, FileText, Trash2 } from 'lucide-react';
import { fileToBase64 } from '../services/storage';
import DatePicker from './DatePicker';

interface JobFormProps {
  initialData?: JobApplication;
  onSubmit: (data: JobApplicationFormData) => Promise<void>;
  onCancel: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ initialData, onSubmit, onCancel }) => {
  // Helper to get today in dd/mm/yyyy
  const getTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const [formData, setFormData] = useState<JobApplicationFormData>({
    company: '',
    role: '',
    dateApplied: getTodayDate(),
    status: JobStatus.Waiting,
    jobLink: '',
    cvFileName: null,
    cvBase64: null,
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Callback specifically for the custom DatePicker
  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Size check: Firestore document limit is 1MB. 
      // Base64 increases size by ~33%. Safe limit ~750KB. 
      // We set limit to 800KB to be safe including other fields.
      if (file.size > 800 * 1024) {
        alert("File is too large. For database storage, please choose a file under 800KB.");
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        setFormData(prev => ({
          ...prev,
          cvFileName: file.name,
          cvBase64: base64
        }));
      } catch (err) {
        console.error("Error reading file", err);
        alert("Failed to read file.");
      }
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      cvFileName: null,
      cvBase64: null
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Company Name */}
        <div className="col-span-1">
          <label htmlFor="company" className="block text-sm font-medium text-slate-700">Company Name</label>
          <input
            type="text"
            id="company"
            name="company"
            required
            value={formData.company}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 bg-white text-slate-900 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g. Google"
          />
        </div>

        {/* Job Role */}
        <div className="col-span-1">
          <label htmlFor="role" className="block text-sm font-medium text-slate-700">Job Role</label>
          <input
            type="text"
            id="role"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 bg-white text-slate-900 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g. Frontend Engineer"
          />
        </div>

        {/* Date Applied (Custom Picker) */}
        <div className="col-span-1">
          <DatePicker 
            label="Date Applied"
            name="dateApplied"
            value={formData.dateApplied}
            onChange={handleDateChange}
            required
          />
        </div>

        {/* Status */}
        <div className="col-span-1">
          <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 bg-white text-slate-900 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            {Object.values(JobStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Job Link */}
        <div className="col-span-2">
          <label htmlFor="jobLink" className="block text-sm font-medium text-slate-700">Job Link</label>
          <input
            type="url"
            id="jobLink"
            name="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 bg-white text-slate-900 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="https://..."
          />
        </div>

        {/* CV/Resume */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700">CV / Resume</label>
          <div className="flex items-center mt-1 space-x-4">
            {formData.cvFileName ? (
               <div className="flex items-center justify-between w-full px-4 py-2 border border-slate-200 rounded-md bg-white">
                 <div className="flex items-center space-x-2 truncate">
                   <FileText className="w-5 h-5 text-primary-500 flex-shrink-0" />
                   <span className="text-sm text-slate-700 truncate">{formData.cvFileName}</span>
                 </div>
                 <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 ml-2 text-slate-400 hover:text-red-500"
                  title="Remove file"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
            ) : (
              <div className="w-full">
                <label 
                  htmlFor="cv-upload" 
                  className="flex items-center justify-center w-full px-6 py-4 bg-white border-2 border-dashed border-slate-300 rounded-md cursor-pointer hover:border-primary-500 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1 text-center">
                    <Upload className="w-8 h-8 mx-auto text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <span className="font-medium text-primary-600 hover:text-primary-500">Upload a file</span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PDF, DOCX up to 800KB</p>
                  </div>
                  <input id="cv-upload" name="cv" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 bg-white text-slate-900 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Add any notes, interview details, or thoughts here..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 space-x-3 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" icon={Save} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Application'}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;