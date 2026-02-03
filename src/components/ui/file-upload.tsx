import React, { useRef, useState } from 'react';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { validateFileType, validateFileSize } from '../../utils/security';
import { supabase } from '@/lib/supabase';
import { v4 } from 'uuid';

interface FileUploadProps {
  onFileSelect: (url: string) => void; // Updated to return the uploaded file URL
  onRemove: (fileUrl: string) => void; // Updated to accept a string parameter
  setUploading: (uploading: boolean) => void; // New prop to set uploading state in parent
  accept?: string;
  folder?: string;
  maxSize?: number; // in MB
  currentFile?: string | null;
  multiple?: boolean;
}

export function FileUpload({
  onFileSelect,
  onRemove,
  setUploading, // New prop
  accept = 'image/*,image/pdf,image/jpeg',
  folder,
  maxSize = 5,
  currentFile,
  multiple = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentFile || null);
  const [fileSize, setFileSize] = useState<number | null>(null);

  const allowedTypes = accept.split(',');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (!validateFileSize(file, maxSize)) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Check file type
    if (!validateFileType(file, allowedTypes)) {
      setError(`Invalid file type: ${file.type}`);
      return false;
    }

    setError(null);
    return true;
  };

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      // Upload to Supabase
      const uuid = v4();
      const imagePath = `uploads/${folder}/${uuid}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('jobbify')
        .upload(imagePath, file);

      if (error) {
        console.error('Error uploading file to Supabase:', error.message);
        setError('Failed to upload file. Please try again.');
        return null;
      }

      // Get public URL
      const { data: imageUrlData } = supabase.storage
        .from('jobbify') // Replace with your actual bucket name
        .getPublicUrl(imagePath);

      // Check if the public URL exists before proceeding
      if (!imageUrlData || !imageUrlData.publicUrl) {
        console.error('Error generating public URL for image');
        return null;
      }

      return imagePath;
    } catch (err) {
      console.error('Unexpected error during upload:', err);
      setError('Unexpected error occurred during upload.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFile = async (file: File) => {
    console.log('File size:', file.size);
    setFileSize(file.size);
    setPreview(URL.createObjectURL(file)); // Set preview with data URL

    if (validateFile(file)) {
      const publicUrl = await uploadToSupabase(file);

      if (publicUrl) {
        onFileSelect(publicUrl);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => handleFile(file));
    }
  };

  const handleRemove = () => {
    setPreview(null); // Clear the preview
    setFileSize(null); // Clear the file size
    setError(null); // Clear any error messages
    onRemove(''); // Notify parent to clear the file
    if (inputRef.current) {
      inputRef.current.value = ''; // Clear the input field
    }
  };

  console.log('Preview:', preview);

  return (
    <div className="relative">
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-purple-500 bg-purple-50'
            : 'border-slate-300 hover:border-purple-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview && (
          preview.startsWith('data:image') || preview.startsWith('http') ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center cursor-pointer" onClick={() => inputRef.current?.click()}>
              <Upload className="h-10 w-10 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600 text-center mb-1">
                Drag and drop your file here, or click to select
              </p>
              <p className="text-xs text-slate-500">
                Supports {accept.replace(/\*/g, 'files')} up to {maxSize}MB
              </p>
            </div>
          )
        )}
        {!preview && (
          <div
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-10 w-10 text-slate-400 mb-2" />
            <p className="text-sm text-slate-600 text-center mb-1">
              Drag and drop your file here, or click to select
            </p>
            <p className="text-xs text-slate-500">
              Supports {accept.replace(/\*/g, 'files')} up to {maxSize}MB
            </p>
          </div>
        )}
        {preview && (
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-slate-100"
            type="button"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {preview && fileSize !== null && (
        <p className="mt-2 text-sm text-slate-600">
          File size: {(fileSize / (1024 * 1024)).toFixed(2)} MB
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
        multiple={multiple}
      />
    </div>
  );
}
