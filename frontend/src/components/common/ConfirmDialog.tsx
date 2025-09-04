import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  icon?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmButtonClass = 'btn-primary',
  cancelButtonClass = 'btn-outline',
  icon
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md bg-white rounded-xl shadow-xl transform transition-all animate-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Icon and Title */}
            <div className="flex items-center mb-4">
              {icon && (
                <div className="mr-3 flex-shrink-0">
                  {icon}
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>

            {/* Message */}
            <div className="mb-6">
              <p className="text-gray-600">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`btn ${cancelButtonClass}`}
              >
                {cancelButtonText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`btn ${confirmButtonClass}`}
              >
                {confirmButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;