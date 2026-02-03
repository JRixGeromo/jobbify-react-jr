import React from 'react';
import { FileText } from 'lucide-react';

interface PDFViewerProps {
  url: string;
}

export function PDFViewer({ url }: PDFViewerProps) {
  return (
    <div className="w-[90vw] h-[90vh] bg-white rounded-lg p-8 flex flex-col items-center justify-center">
      <FileText className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold mb-2">PDF Document</h3>
      <p className="text-gray-600 mb-4 text-center">
        For security reasons, PDFs are opened in a new tab
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg 
                 transition-colors duration-200 flex items-center gap-2"
      >
        <FileText className="w-4 h-4" />
        Open PDF
      </a>
    </div>
  );
}
