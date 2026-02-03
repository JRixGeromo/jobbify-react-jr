import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { useMutation } from '@apollo/client';
import { DELETE_JOB_MUTATION } from '@/graphql/mutations';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface DeleteJobButtonProps {
  jobId: string;
  onDeleted?: () => void;
}

export function DeleteJobButton({ jobId, onDeleted }: DeleteJobButtonProps) {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteJob, { error }] = useMutation(DELETE_JOB_MUTATION);

  const handleDelete = async () => {
    try {
      const { data } = await deleteJob({
        variables: {
          id: jobId,
        },
      });

      if (onDeleted) {
        console.log('heyyaasda');
        onDeleted();
      }

      toast.success('Job successfully deleted!', {
        description: `Job has been deleted from your jobs.`,
        action: {
          label: 'View all jobs',
          onClick: () => navigate('/jobs'),
        },
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job. Please try again.');
    } finally {
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmDialog(true)}
        className="ml-auto text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <AlertDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDelete}
        title="Delete Job"
        description={`Are you sure you want to delete tis? This action cannot be undone.`}
        type="danger"
      />
    </>
  );
}
