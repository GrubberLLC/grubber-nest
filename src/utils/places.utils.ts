import {
  GooglePlaceDetailsResult,
  SupabasePlace,
} from '../types/places.types.js';

/**
 * Converts Google Place Details results into the format expected by the Supabase 'Places' table.
 * @param googlePlaces Array of Google Place Details results.
 * @param grubberIdsMap Map of Google IDs to Grubber IDs.
 * @returns Array of objects formatted for Supabase insertion/upsertion.
 */
export function convertGooglePlacesToSupabasePlaces(
  googlePlaces: GooglePlaceDetailsResult[],
  grubberIdsMap: Map<string, string>,
): SupabasePlace[] {
  return googlePlaces.map((place: GooglePlaceDetailsResult) => {
    const supabasePlace: Partial<SupabasePlace> = {
      place_id: grubberIdsMap.get(place.id),
      name: place.displayName.text || place.name || 'Unknown Name',
      latitude: place.location?.latitude || 0,
      longitude: place.location?.longitude || 0,
      address_full: place.formattedAddress,
      phone_number: place.nationalPhoneNumber,
      business_url: place.websiteUri,
      price: place.priceLevel,
      category: place.types?.join(','),
      description: place.editorialSummary?.text,
    };

    return supabasePlace as SupabasePlace;
  });
}

/**
 * Calculates the Haversine distance between two geographic coordinates.
 * @param lat1 Latitude of the first point.
 * @param lon1 Longitude of the first point.
 * @param lat2 Latitude of the second point.
 * @param lon2 Longitude of the second point.
 * @returns The distance in kilometers.
 */
export function getHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
