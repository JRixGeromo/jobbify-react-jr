export const constructPublicUrl = (
  bucketName: string,
  relativePath: string
): string => {
  const baseUrl = import.meta.env.VITE_SUPABASE_STORAGE_URL;
  return `${baseUrl}/${bucketName}/${relativePath}`;
}; 