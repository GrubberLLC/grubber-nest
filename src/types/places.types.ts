// grubber-server/src/types/places.types.ts
// import type { Tables } from './supabase.types.js'; // Tables type not found in this file

// Types related to Google Places API interactions and Supabase Place structure

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface FetchRestaurantsProps {
  searchString: string;
  coordinates: Coordinates;
}

export interface GooglePhotoReference {
  name: string;
  photo_reference: string; // The unique identifier for the photo from Google
  heightPx: number; // Added based on usage in place-photos.service.ts
  widthPx: number; // Added based on usage in place-photos.service.ts
  // Add other fields if needed from the API response
  // fetchedPhotos?: GooglePhotoData[]; // Photos data after fetching URLs // REMOVED
}

// Renamed from GooglePhotoData to be more specific to its origin before Supabase storage
export interface FetchedGooglePhotoData {
  name: string; // The resource name like "places/..."
  photoUri: string; // The actual URI from Google
}

// New interface for photo data in the API response
export interface PlacePhotoResponse {
  storage_path?: string | null; // Will be populated once processed and stored in Supabase
  original_uri: string; // The Google URI, available immediately for new places, or the stored original URI
  photo_reference_name: string; // Google's reference for the photo
  supabase_uri?: string; // Supabase Storage URI for the photo
}

// --- Start: Added/Modified for PlaceHours ---
export interface GoogleOpeningPeriodTime {
  day: number; // 0-6 (Sunday to Saturday)
  hour: number; // 0-23
  minute: number; // 0-59
  // date?: { year: number, month: number, day: number }; // Present for special hours
  // truncated?: boolean; // If true, the point in time is not known, only the date
}

export interface GoogleOpeningPeriod {
  open: GoogleOpeningPeriodTime;
  close?: GoogleOpeningPeriodTime; // 'close' can be missing for places open 24/7 if 'open.day' is Sunday, 'open.time' is '0000' and no 'close' object
}
// --- End: Added/Modified for PlaceHours ---

// --- Start: Added/Modified for Supabase Stored Photos ---
export interface SupabasePlacePhoto {
  place_photo_id?: string; // UUID, auto-generated by DB
  place_id: string; // UUID, FK to Places table
  photo_reference_name: string; // Renamed from google_photo_reference_name
  storage_path: string | null; // Path in Supabase Storage, e.g., "place_id/uuid.jpg"
  original_uri?: string; // Renamed from original_google_uri
  supabase_uri?: string; // Supabase Storage URI for the photo
  // created_at is handled by DB
}
// --- End: Added/Modified for Supabase Stored Photos ---

export interface GooglePlaceDetailsResult {
  id: string;
  name: string;
  photos?: GooglePhotoReference[];
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  location?: { latitude: number; longitude: number };
  displayName: { text: string };
  regularOpeningHours?: {
    openNow?: boolean;
    periods?: GoogleOpeningPeriod[];
    weekdayDescriptions?: string[];
  };
  priceLevel?: string;
  priceRange?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  types?: string[]; // Added for category mapping
  editorialSummary?: { text?: string }; // Added for description mapping
  // fetchedPhotos?: GooglePhotoData[]; // Photos data after fetching URLs // REMOVED
}

export interface GooglePlaceSearchResult {
  place_id: string;
  name: string;
  photos?: GooglePhotoReference[];
}

// Structure matching relevant columns in your Supabase 'Places' table
// intended for mapping from Google Places API results
export interface PlaceWithPhotosResponse {
  place_id?: string;
  name: string;
  latitude: number;
  longitude: number;
  location: string;
  address_full?: string;
  phone_number?: string;
  business_url?: string;
  price?: string;
  category?: string;
  description?: string;
  weekday_descriptions?: string[]; // Added for storing Google's formatted weekly hours
  created_at?: string;
  photos?: PlacePhotoResponse[]; // Array of photo objects from our DB
}

// Represents the core data stored in the 'Places' table
export interface PlaceCoreData /* extends Omit<Tables<'Places'>, 'created_at' | 'updated_at' | 'id'> */ {
  place_id?: string;
  name: string;
  latitude: number;
  longitude: number;
  location: string;
  address_full?: string;
  phone_number?: string;
  business_url?: string;
  price?: string;
  category?: string;
  description?: string;
  weekday_descriptions?: string[];
  created_at?: string; // Kept as it was explicitly defined
  // No 'photos' field here as it's not a direct column in 'Places' table
}
