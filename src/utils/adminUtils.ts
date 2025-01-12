export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return contentType ? contentType.startsWith('image/') : false;
  } catch {
    return false;
  }
};

export const formatPrice = (price: string): string => {
  // Remove any non-numeric characters except decimal point
  const cleanPrice = price.replace(/[^0-9.]/g, '');
  return `$${parseFloat(cleanPrice).toFixed(2)}`;
};

export const validateAmazonUrl = (url: string): boolean => {
  if (!url) return true; // Empty URLs are valid (optional)
  
  try {
    // Just check if it's a valid URL format
    new URL(url);
    return true;
  } catch {
    return false;
  }
}; 