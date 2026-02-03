// utils/removeTypename.ts

/**
 * Recursively removes the `__typename` field from an object or an array of objects.
 *
 * @param data - The object or array to process
 * @returns A new object or array without the `__typename` field
 */
export const removeTypename = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map((item) => removeTypename(item)); // Recursively process arrays
  } else if (typeof data === 'object' && data !== null) {
    const { __typename, ...rest } = data; // Remove __typename
    return Object.entries(rest).reduce(
      (acc: Record<string, any>, [key, value]) => {
        acc[key] = removeTypename(value); // Recursively clean nested objects
        return acc;
      },
      {}
    );
  }
  return data; // Return other types (strings, numbers, etc.) as-is
};
