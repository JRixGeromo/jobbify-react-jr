export type MediaType = 'image' | 'video' | 'pdf';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'mov'];
const PDF_EXTENSIONS = ['pdf'];

export function getMediaType(url: string): MediaType {
  const extension = url.split('.').pop()?.toLowerCase() || '';

  if (IMAGE_EXTENSIONS.includes(extension)) return 'image';
  if (VIDEO_EXTENSIONS.includes(extension)) return 'video';
  if (PDF_EXTENSIONS.includes(extension)) return 'pdf';

  return 'image'; // fallback to image
}
