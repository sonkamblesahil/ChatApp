const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Empty because we'll use relative URLs in production
  : 'http://localhost:3001';

export const config = {
  API_URL: API_BASE_URL,
  // Add other config values here
};
