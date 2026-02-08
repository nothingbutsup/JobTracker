import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}) => {
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75 backdrop-blur-sm" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>

        {/* Center Trick */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Panel */}
        <div className="inline-block w-full max-w-sm p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:align-middle">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-red-50">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            
            <h3 className="text-lg font-semibold leading-6 text-slate-900" id="modal-title">
              {title}
            </h3>
            
            <div className="mt-2">
              <p className="text-sm text-slate-500">
                {message}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button variant="secondary" onClick={onClose} fullWidth>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} fullWidth>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;