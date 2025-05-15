// grubber-server/src/types/places.types.ts

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
  // Add other fields if needed from the API response
  // fetchedPhotos?: GooglePhotoData[]; // Photos data after fetching URLs // REMOVED
}

export interface GooglePhotoData {
  name: string; // The resource name like "places/..."
  photoUri: string; // The actual URI like "https://lh3.googleusercontent.com/..."
}

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
    periods?: unknown[];
    weekdayText?: string[];
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
export interface SupabasePlace {
  name: string;
  latitude: number;
  longitude: number;
  address_full?: string;
  phone_number?: string;
  business_url?: string;
  price?: string;
  category?: string;
  description?: string;
  place_id?: string;
}
