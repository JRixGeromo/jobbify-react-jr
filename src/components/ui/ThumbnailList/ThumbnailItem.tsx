import React, { useState } from 'react';
import { X } from 'lucide-react';
import { getFileIcon, getFileType } from '@/types/fileType';

interface ThumbnailItemProps {
  url: string;
  onClick: (url: string) => void;
  onRemove: (url: string) => void;
  index: number;
}

export function ThumbnailItem({
  url,
  onClick,
  onRemove,
  index,
}: ThumbnailItemProps) {
  const [showLightbox, setShowLightbox] = useState(false);
  const fileType = getFileType(url);
  const isImage = fileType === 'image';

  const handleClick = (e: React.MouseEvent) => {
    onClick('testing');
  };

  if (isImage) {
    return (
      <>
        {/* <div className="relative group">
          <div
            onClick={handleClick}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <img
              src={url}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(url);
            }}
            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            type="button"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div> */}
        <div className="relative group">
          <div
            onClick={handleClick}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <img
              src={url}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg bg-white dark:bg-gray-800"
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(url);
            }}
            className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-gray-700 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            type="button"
          >
            <X className="h-4 w-4 text-slate-500 dark:text-gray-300" />
          </button>
        </div>
      </>
    );
  }

  const Icon = getFileIcon(fileType);
  const label = fileType.charAt(0).toUpperCase() + fileType.slice(1);

  return (
    <>
      {/* <div className="relative group">
        <div
          onClick={handleClick}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <div className="flex flex-col items-center justify-center h-32 bg-slate-100 rounded-lg">
            <Icon className="h-8 w-8 text-slate-600 mb-2" />
            <span className="text-sm text-slate-600">
              {label} {index + 1}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(url);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          type="button"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div> */}
      <div className="relative group">
        <div
          onClick={handleClick}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <div className="flex flex-col items-center justify-center h-32 bg-slate-100 dark:bg-gray-800 rounded-lg">
            <Icon className="h-8 w-8 text-slate-600 dark:text-gray-400 mb-2" />
            <span className="text-sm text-slate-600 dark:text-gray-400">
              {label} {index + 1}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(url);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-gray-700 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          type="button"
        >
          <X className="h-4 w-4 text-slate-500 dark:text-gray-300" />
        </button>
      </div>
    </>
  );
}
