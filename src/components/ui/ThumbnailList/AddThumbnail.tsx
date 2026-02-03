import React from 'react';
import { Upload } from 'lucide-react';

interface AddThumbnailProps {
  onClick: () => void;
}

export function AddThumbnail({ onClick }: AddThumbnailProps) {
  return (
    // <div
    //   onClick={onClick}
    //   className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-purple-400 transition-colors"
    // >
    //   <Upload className="h-8 w-8 text-slate-400 mb-2" />
    //   <p className="text-sm text-slate-600">Add more</p>
    // </div>
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors bg-white dark:bg-gray-800"
    >
      <Upload className="h-8 w-8 text-slate-400 dark:text-gray-500 mb-2" />
      <p className="text-sm text-slate-600 dark:text-gray-400">Add more</p>
    </div>
  );
}
