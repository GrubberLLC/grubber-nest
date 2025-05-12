import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

// Common response type for Supabase queries
export interface SupabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

// Database table interfaces
export interface ListRecord {
  id: string;
  userId: string;
  name?: string;
}

// Type guard to check if an error is a PostgrestError
export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  );
}

// Type guard for checking if an unknown error is an Error instance
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Helper to safely extract error message
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (isPostgrestError(error)) {
    return `${error.message} (Code: ${error.code})`;
  }
  return String(error) || 'Unknown error';
}

// Type assertion helper for Supabase client
export function assertSupabaseClient(
  client: unknown,
): asserts client is SupabaseClient {
  if (!client || typeof client !== 'object') {
    throw new Error('Invalid Supabase client');
  }
}
