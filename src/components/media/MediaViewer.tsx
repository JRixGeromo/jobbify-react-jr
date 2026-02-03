import React from 'react';
import { getMediaType } from '@/types/media';
import { PDFViewer } from '@/components/media/PDFViewer';

interface MediaViewerProps {
  url: string;
}

export function MediaViewer({ url }: MediaViewerProps) {
  const type = getMediaType(url);

  switch (type) {
    case 'image':
      return (
        <img
          src={url}
          alt="Media content"
          className="max-w-full max-h-[90vh] object-contain"
        />
      );
    case 'video':
      return (
        <video
          src={url}
          controls
          className="max-w-full max-h-[90vh]"
          controlsList="nodownload"
        >
          Your browser does not support the video tag.
        </video>
      );
    case 'pdf':
      return <PDFViewer url={url} />;
  }
}
