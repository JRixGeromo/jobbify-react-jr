import React from 'react';
import { X } from 'lucide-react';
import { DemoModeNotice } from '../DemoModeNotice';

interface PDFPreviewProps {
  type: 'quote' | 'invoice';
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

export function PDFPreview({ type, data, isOpen, onClose }: PDFPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-[90vw] h-[90vh] bg-white rounded-lg shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            {type === 'quote' ? 'Quote' : 'Invoice'} Preview
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <div className="flex-1 p-4 bg-slate-100">
          <DemoModeNotice feature="PDF generation" />
          <div className="mt-4 bg-white rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">
              {type === 'quote' ? 'Quote' : 'Invoice'} #{data.id || 'New'}
            </h3>
            <div className="prose max-w-none">
              <p>Client: {data.client}</p>
              <p>Service: {data.service}</p>
              <p>Date: {data.date}</p>
              <p>Due Date: {data.dueDate}</p>
              <p>Total: ${data.total?.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
