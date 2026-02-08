import React from 'react';
import { JobStatus } from '../types';

interface StatusBadgeProps {
  status: JobStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    // Blue for Waiting/Applied
    [JobStatus.Waiting]: 'bg-blue-50 text-blue-700 border-blue-200',
    // Orange/Amber for Interviewing (Active)
    [JobStatus.Interviewing]: 'bg-orange-50 text-orange-700 border-orange-200',
    // Green for Offered (Success)
    [JobStatus.Offered]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    // Red for Declined (Failure)
    [JobStatus.Declined]: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;