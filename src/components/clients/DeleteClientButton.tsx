import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { useMutation } from '@apollo/client';
import { DELETE_CLIENT_MUTATION } from '@/graphql/mutations';
import { toast } from 'sonner';

interface DeleteClientButtonProps {
  clientId: string;
  onDeleted?: () => void;
}

export function DeleteClientButton({ clientId, onDeleted }: DeleteClientButtonProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteClient] = useMutation(DELETE_CLIENT_MUTATION);

  const handleDelete = async () => {
    try {
      await deleteClient({ variables: { id: clientId } });

      if (onDeleted) {
        onDeleted();
      }

      toast.success('Client successfully deleted!', {
        description: `Client has been removed from your list.`,
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client. Please try again.');
    } finally {
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmDialog(true)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <AlertDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDelete}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
        type="danger"
      />
    </>
  );
}
