// API Configuration
const isDevelopment = import.meta.env.DEV;
const apiBaseUrl = isDevelopment
  ? "http://localhost:4000" // Development: local backend
  : "https://web-production-5c9d.up.railway.app"; // Production: Railway backend

export const API_BASE_URL = apiBaseUrl;

// Helper function to construct full API URLs
export const apiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Export for use in components
export default {
  BASE_URL: API_BASE_URL,
  url: apiUrl,
};
