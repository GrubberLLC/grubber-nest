import {
  GooglePlaceDetailsResult,
  PlaceCoreData,
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
): PlaceCoreData[] {
  return googlePlaces.map((place: GooglePlaceDetailsResult) => {
    const longitude = place.location?.longitude;
    const latitude = place.location?.latitude;

    const supabasePlace: PlaceCoreData = {
      place_id: grubberIdsMap.get(place.id),
      name: place.displayName?.text || place.name || 'Unknown Name',
      latitude: latitude !== undefined ? latitude : 0,
      longitude: longitude !== undefined ? longitude : 0,
      location:
        longitude !== undefined && latitude !== undefined
          ? `POINT(${longitude} ${latitude})`
          : '',
      address_full: place.formattedAddress,
      phone_number: place.nationalPhoneNumber,
      business_url: place.websiteUri,
      price: place.priceLevel,
      category: place.types?.join(', '),
      description: place.editorialSummary?.text,
      weekday_descriptions: place.regularOpeningHours?.weekdayDescriptions,
    };

    if (
      !supabasePlace.location &&
      (latitude !== undefined || longitude !== undefined)
    ) {
      console.warn(
        `Could not form location string for place: ${place.id}, lat: ${latitude}, lng: ${longitude}`,
      );
    }
    if (
      supabasePlace.latitude === 0 &&
      supabasePlace.longitude === 0 &&
      (latitude !== undefined || longitude !== undefined)
    ) {
      console.warn(
        `Defaulted lat/lng to 0 for place: ${place.id} as original values were lat: ${latitude}, lng: ${longitude}`,
      );
    }

    return supabasePlace;
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
