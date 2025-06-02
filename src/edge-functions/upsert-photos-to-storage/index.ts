/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// @ts-expect-error deno std types
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import {
  createClient,
  SupabaseClient,
  // @ts-expect-error supabase types
} from 'https://esm.sh/@supabase/supabase-js@2';

type UpsertPhotoToStorageRequest = {
  place_photo_id: string;
  place_id: string;
  original_uri: string;
};

/**
 * Handles HTTP requests to upload photos to Supabase Storage.
 *
 * @param req - The incoming HTTP request containing the photo data.
 * @returns A Promise that resolves to an HTTP response.
 */
serve(async (req: Request) => {
  // Retrieve Supabase URL and Service Role Key from environment variables.
  // These are necessary to initialize the Supabase client with admin privileges.
  // @ts-expect-error deno env type
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  // @ts-expect-error deno env type
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  // Check if the required environment variables are set. If not, return a 500 error.
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return new Response(
      JSON.stringify({
        error: 'Missing required environment variables',
      }),
      {
        status: 500, // Internal Server Error
        headers: { 'Content-Type': 'application/json' }, // Specify JSON content type for the response.
      },
    );
  }

  // Initialize the Supabase client using the retrieved URL and service role key.
  // This client will be used to interact with Supabase services (Storage, Database).
  const supabase: SupabaseClient = createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
  );

  try {
    const {
      place_photo_id,
      place_id,
      original_uri,
    }: UpsertPhotoToStorageRequest =
      (await req.json()) as UpsertPhotoToStorageRequest;

    // Validate that all required fields are present in the parsed payload.
    // If any are missing, return a 400 Bad Request error.
    if (!place_photo_id || !place_id || !original_uri) {
      return new Response(
        JSON.stringify({
          error:
            'Missing required fields: place_photo_id, place_id or original_uri',
        }),
        {
          status: 400, // Bad Request
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Fetch the image from the 'original_uri' provided in the request payload.
    const imageResponse = await fetch(original_uri);
    // Check if the image fetch was successful (HTTP status 200-299).
    if (!imageResponse.ok) {
      // If fetching failed, return an error response with the status text from the image host.
      return new Response(
        JSON.stringify({
          error: `Failed to fetch image from original_uri: ${imageResponse.statusText}`,
        }),
        {
          status: imageResponse.status, // Use the actual status from the failed fetch attempt.
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Convert the fetched image response body to a Uint8Array (binary data buffer).
    const imageBuffer = new Uint8Array(await imageResponse.arrayBuffer());
    // Construct the file path for storing the image in Supabase Storage.
    // Uses a pattern: {place_id}/{place_photo_id}.jpg. Assumes JPEG format for simplicity.
    // For dynamic extensions, content-type sniffing would be needed here.
    const filePath = `${place_id}/${place_photo_id}.jpg`;

    // Upload the image buffer to the 'place-photos' bucket in Supabase Storage.
    // 'upsert: true' means it will overwrite if a file at 'filePath' already exists.
    const { error: uploadError } = await supabase.storage
      .from('place-photos') // Specify the Supabase Storage bucket name.
      .upload(filePath, imageBuffer, {
        contentType: imageResponse.headers.get('content-type') || undefined,
        upsert: true, // Overwrite if file exists, or create if not.
      });

    // Check if there was an error during the upload to Supabase Storage.
    if (uploadError) {
      return new Response(
        JSON.stringify({
          error: `Upload failed: ${uploadError?.message || 'Unknown storage error'}`,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // After successful upload, get the public URL for the newly uploaded file.
    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from('place-photos')
      .getPublicUrl(filePath); // Get the public URL using the file path.

    // Check if there was an error retrieving the public URL.
    if (publicUrlError) {
      return new Response(
        JSON.stringify({
          error: `Failed to get public URL: ${publicUrlError?.message || 'Unknown error getting public URL'}`,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Store the retrieved public URL. If 'publicUrlData' or 'publicUrl' is null/undefined, store null.
    const supabasePhotoUri = publicUrlData?.publicUrl ?? null;

    // Update the corresponding record in the 'PlacePhotos' database table.
    // Set the 'storage_path' (path within the bucket) and 'supabase_uri' (public URL).
    const { error: updateError } = await supabase
      .from('PlacePhotos') // Specify the database table name.
      .update({
        storage_path: filePath, // The path where the image is stored in the bucket.
        supabase_uri: supabasePhotoUri, // The publicly accessible URL of the image.
      })
      .eq('place_photo_id', place_photo_id); // Condition to update the correct photo record.

    // Check if there was an error during the database update operation.
    if (updateError) {
      return new Response(
        JSON.stringify({
          error: `Failed to update table: ${updateError?.message || 'Unknown database error'}`,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // If all operations were successful, return a 200 OK response.
    // Include a success message, the storage path, and the Supabase URI in the response body.
    return new Response(
      JSON.stringify({
        message: 'Photo processed and updated successfully.',
        storagePath: filePath,
        supabaseUri: supabasePhotoUri,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (e: unknown) {
    // Generic catch block for any other unhandled errors during the process.
    let errorMessage = 'Internal server error.';
    // Try to extract a more specific error message if possible.
    if (e instanceof Error) {
      errorMessage = e.message;
    } else if (typeof e === 'string') {
      errorMessage = e;
    } else if (
      e &&
      typeof e === 'object' &&
      'message' in e &&
      typeof e.message === 'string'
    ) {
      // Handle cases where 'e' is an object with a 'message' property (e.g., some library errors).
      errorMessage = e.message;
    }
    // Return a 500 Internal Server Error response with the determined error message.
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
