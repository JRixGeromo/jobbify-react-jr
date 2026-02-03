import { FileText, Film, Image as ImageIcon } from 'lucide-react';

export type FileType = 'pdf' | 'video' | 'image' | 'other';

export function getFileType(url: string): FileType {
  if (url.match(/\.(pdf)$/i)) return 'pdf';
  if (url.match(/\.(mp4|mov|avi|wmv|flv|webm)$/i)) return 'video';
  if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return 'image';
  return 'other';
}

export function getFileIcon(type: FileType) {
  switch (type) {
    case 'pdf':
      return FileText;
    case 'video':
      return Film;
    default:
      return ImageIcon;
  }
}
