import React from 'react';
import { WithSkipModal } from '@/components/WithSkipModal';
import { FileUpload } from '@/components/ui/file-upload';
import { ThumbnailList } from '@/components/ui/ThumbnailList/ThumbnailList';

interface CompanyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyName: string, logoFile: string | null) => void;
}

export const CompanyInfoModal: React.FC<CompanyInfoModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [companyName, setCompanyName] = React.useState('');
  const [logoFile, setLogoFile] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileSelect = (url: string) => {
    console.log('Selected file URL:', url);
    setLogoFile(url);
  };

  const handleFileRemove = () => {
    console.log('Removed file URL:', logoFile);
    setLogoFile(null);
  };

  // Check if form is valid
  const isFormValid = companyName.trim().length > 0 && !isUploading;

  return (
    <WithSkipModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => {
        console.log('Submitting with:', companyName, logoFile);
        onSubmit(companyName, logoFile);
      }}
      title=""
      message="Can be done later"
      isConfirmDisabled={!isFormValid}
      confirmText={isUploading ? 'Uploading...' : 'Confirm'}
    >
      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="border p-2 mb-4 w-full rounded-md"
      />
      <FileUpload
        onFileSelect={handleFileSelect}
        onRemove={handleFileRemove}
        setUploading={setIsUploading}
        accept="image/jpeg,image/png"
        folder="company-logos"
        maxSize={5}
        multiple={false}
      />
      {logoFile && (
        <div className="mt-4">
          <ThumbnailList
            urls={[logoFile]}
            onRemove={(url) => handleFileRemove()}
          />
        </div>
      )}
    </WithSkipModal>
  );
}; 