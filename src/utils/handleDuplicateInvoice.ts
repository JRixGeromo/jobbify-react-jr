// utils/duplicateDocument.ts

import { removeTypename } from '@/utils/removeTypename';

interface DuplicateDocumentParams {
  document: any; // Invoice or Quote data
  currentUser: any; // Current user object
  createDocument: (options: { variables: { input: any } }) => Promise<any>; // GraphQL mutation for creating a document
  navigate: (path: string) => void; // React Router's navigate function
  documentType: 'invoice' | 'quote'; // Type of the document being duplicated
}

export const handleDuplicateInvoice = async ({
  document,
  currentUser,
  createDocument,
  navigate,
  documentType,
}: DuplicateDocumentParams) => {
  if (!document) {
    alert(`No ${documentType} to duplicate.`);
    return;
  }

  try {
    // Clean up the document by removing `__typename`
    const cleanedDocument = removeTypename(document);

    const duplicatedData = {
      ...cleanedDocument,
      items: JSON.stringify(cleanedDocument.items || []), // Ensure items are serialized as JSON
      id: undefined, // Clear ID to create a new document
      [`${documentType}_number`]: `${documentType.toUpperCase()}-${Date.now()}`, // Generate a unique document number
      issued_date: new Date().toISOString().split('T')[0], // Use current date
      status: 'Draft', // Set status to 'Draft'
      company_id: currentUser!.user_metadata!.company_id, // Add company_id
      created_by: currentUser!.id, // Add created_by
      subtotal: cleanedDocument.subtotal?.toString() || '0', // Ensure numeric values are strings
      tax_amount: cleanedDocument.tax_amount?.toString() || '0',
      discount_amount: cleanedDocument.discount_amount?.toString() || '0',
      total: cleanedDocument.total?.toString() || '0',
    };

    const { data } = await createDocument({
      variables: { input: duplicatedData },
    });

    if (data) {
      alert(
        `${documentType.charAt(0).toUpperCase() + documentType.slice(1)} duplicated successfully!`
      );
      navigate(`/${documentType}s`); // Navigate to the document list page
    }
  } catch (err) {
    console.error(`Error duplicating ${documentType}:`, err);
    alert(`Failed to duplicate the ${documentType}. Please try again.`);
  }
};
