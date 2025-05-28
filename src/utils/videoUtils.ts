/**
 * Validates if the provided URL is a valid video URL
 * @param url URL to validate
 * @returns boolean indicating if URL is valid
 */
export function validateVideoUrl(url: string): boolean {
  // Basic URL validation
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  
  // Check for common video platforms
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/;
  const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/;
  const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com)\/.+/;
  
  return (
    youtubeRegex.test(url) ||
    vimeoRegex.test(url) ||
    facebookRegex.test(url) ||
    tiktokRegex.test(url) ||
    url.includes('video') // Generic fallback for other platforms
  );
}

/**
 * Fetches video metadata from a URL (in a real app, this would call an API)
 * This is a mock implementation
 */
export async function fetchVideoMetadata(url: string): Promise<any> {
  // In a real app, this would make an API call to get video metadata
  // For now, we'll return mock data
  return {
    title: 'Sample Video Title',
    duration: Math.floor(Math.random() * 300) + 60, // Random duration between 60-360 seconds
    thumbnailUrl: 'https://images.pexels.com/photos/2833366/pexels-photo-2833366.jpeg?auto=compress&cs=tinysrgb&w=600'
  };
}