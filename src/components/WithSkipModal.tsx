import React from 'react';

interface WithSkipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  children: React.ReactNode;
  isConfirmDisabled?: boolean;
  confirmText?: string;
}

export const WithSkipModal: React.FC<WithSkipModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  children,
  isConfirmDisabled = false,
  confirmText = 'Confirm'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
        <span
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 cursor-pointer"
        >
          SKIP
        </span>
        <p className="absolute top-10 right-4 text-gray-500 text-xs mb-4">Can be done later</p>
        <br className="mb-11" />
        <div className="mb-4 text-center">
          <h1 className="text-xl font-bold">Welcome To Jobbify!</h1>
          <p>Add your company name and logo to start sending professional quotes and invoices.</p>
        </div>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        {children}
        <div className="flex justify-end mt-4">
          <button
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className={`px-4 py-2 rounded-lg ${
              isConfirmDisabled 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
