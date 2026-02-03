import React, { useState } from 'react';
import { ThumbnailItem } from './ThumbnailItem';
import { AddThumbnail } from './AddThumbnail';
import { Lightbox } from '@/components/Lightbox';
import { supabase } from '@/lib/supabase';
import { supabaseStorageURL as STORAGE_URL } from '@/lib/supabase';

interface ThumbnailListProps {
  urls: string[];
  onRemove: (url: string) => void;
  onAdd?: () => void;
  showAddButton?: boolean;
}

export function ThumbnailList({
  urls,
  onRemove,
  onAdd,
  showAddButton = false,
}: ThumbnailListProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const deleteFile = async (filePath: string) => {
    console.log(filePath);
    const { data, error } = await supabase.storage
      .from('jobbify') // Replace with your bucket name
      .remove([filePath]); // Pass the file path as an array
    if (error) {
      console.error('Error deleting file:', error);
      return;
    }

    onRemove(filePath);
    console.log('File deleted successfully:', data);
  };
  if (urls.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {urls.map((file, index) => (
        <ThumbnailItem
          key={`${STORAGE_URL}/${file}`}
          url={`${STORAGE_URL}/${file}`}
          index={index}
          onClick={() => openLightbox(index)}
          onRemove={() => deleteFile(file)}
        />
      ))}

      {isLightboxOpen && (
        <Lightbox
          urls={urls.map((file) => `${STORAGE_URL}/${file}`)}
          initialIndex={selectedIndex}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}
