// supabase-config.js
// This file provides Supabase configuration
// It will try to use environment variables if available (for production)
// or fallback to demo values for development

// For Vercel deployment, set these as environment variables
const DEFAULT_SUPABASE_URL = 'https://demo.supabase.co'; // Replace with your actual URL in production
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo.key'; // Replace with actual key in production

// Export the configuration, using environment variables if available
export const SUPABASE_URL = typeof window !== 'undefined' && window.SUPABASE_URL ? window.SUPABASE_URL : DEFAULT_SUPABASE_URL;
export const SUPABASE_ANON_KEY = typeof window !== 'undefined' && window.SUPABASE_ANON_KEY ? window.SUPABASE_ANON_KEY : DEFAULT_SUPABASE_ANON_KEY;
