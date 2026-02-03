// utils/duplicateQuote.ts

import { removeTypename } from '@/utils/removeTypename';

interface DuplicateQuoteParams {
  formData: any;
  currentUser: any;
  createQuote: (options: { variables: { input: any } }) => Promise<any>;
  navigate: (path: string) => void;
}

export const handleDuplicateQuote = async ({
  formData,
  currentUser,
  createQuote,
  navigate,
}: DuplicateQuoteParams) => {
  if (!formData) {
    alert('No quote to duplicate.');
    return;
  }

  try {
    console.log('Form Data:', formData);

    // Safely destructure `__typename`, `items`, `discountAmount`, and `taxAmount`
    const { __typename, items, discountAmount, taxAmount, ...cleanedData } = formData as {
      __typename?: string;
      items?: any[];
      discountAmount?: number;
      taxAmount?: number;
    };

    // Remove `__typename` from items
    const cleanedItems =
      typeof items === 'string'
        ? JSON.parse(items).map(removeTypename)
        : Array.isArray(items)
          ? items.map(removeTypename)
          : [];

    const duplicatedData = {
      ...removeTypename(cleanedData),
      items: JSON.stringify(cleanedItems), // Ensure items are serialized as JSON
      id: undefined, // Clear ID to create a new quote
      date: new Date().toISOString().split('T')[0], // Use current date
      status: 'Draft', // Set status to 'Draft'
      company_id: currentUser.user_metadata?.company_id, // Add company_id
      created_by: currentUser.id, // Add created_by
      discount_amount: discountAmount, // Ensure field name consistency
      tax_amount: taxAmount, // Ensure field name consistency
    };

    const { data } = await createQuote({
      variables: { input: duplicatedData },
    });

    if (data) {
      alert('Quote duplicated successfully!');
      navigate('/quotes');
    }
  } catch (error) {
    console.error('Error duplicating quote:', error);
    alert('An error occurred while duplicating the quote.');
  }
};