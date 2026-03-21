export enum JobStatus {
  Waiting = 'Waiting',
  Interviewing = 'Interviewing',
  Offered = 'Offered',
  Declined = 'Declined',
  Pending = 'Pending',
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  dateApplied: string;
  status: JobStatus;
  jobLink: string;
  cvFileName: string | null;
  cvBase64: string | null;
  notes: string;
}

export type JobApplicationFormData = Omit<JobApplication, 'id'>;
