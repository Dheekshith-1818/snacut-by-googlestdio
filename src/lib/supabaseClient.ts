/**
 * Supabase Client Configuration & Types
 * Connects to Supabase Cloud when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present.
 */

export const SUPABASE_CONFIG = {
  url: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '',
  anonKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '',
  isConfigured: Boolean(
    typeof import.meta !== 'undefined' && 
    import.meta.env?.VITE_SUPABASE_URL && 
    import.meta.env?.VITE_SUPABASE_ANON_KEY
  )
};

export interface SupabaseAuthError {
  message: string;
  status?: number;
}
