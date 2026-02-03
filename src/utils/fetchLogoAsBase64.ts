// Utility to fetch the logo and convert it to Base64
export const fetchLogoAsBase64 = async (logoUrl: string): Promise<string> => {
  try {
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || '');
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to fetch logo:', error);
    return '';
  }
}; 