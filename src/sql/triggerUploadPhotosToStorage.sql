-- This trigger will be used to upload photos to storage when a new photo is inserted

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA public;

-- ✅ Drop the trigger if it exists
DROP TRIGGER IF EXISTS tr_upsert_photos_to_storage ON public."PlacePhotos";

-- ✅ Drop the function if it exists
DROP FUNCTION IF EXISTS public.trigger_upsert_photos_to_storage;

-- ✅ Create the function
CREATE OR REPLACE FUNCTION public.trigger_upsert_photos_to_storage()
RETURNS TRIGGER AS $$
BEGIN
  -- Call your Supabase Edge Function
  PERFORM net.http_post(
    url := 'https://gsnzrnbcezfirfaeunjb.supabase.co/functions/v1/upsert-photos-to-storage',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzbnpybmJjZXpmaXJmYWV1bmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNzU3NTcsImV4cCI6MjA1NzY1MTc1N30.8Dct29pP83aKxhH0vaGlw9l8O8cQUurqQ7TF8ebKmwQ',
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'place_photo_id', NEW.place_photo_id,
      'place_id', NEW.place_id,
      'photo_reference_name', NEW.photo_reference_name,
      'storage_path', NEW.storage_path,
      'original_uri', NEW.original_uri
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ Create the trigger (INSERT only)
CREATE TRIGGER tr_upsert_photos_to_storage
AFTER INSERT ON public."PlacePhotos"
FOR EACH ROW
EXECUTE FUNCTION public.trigger_upsert_photos_to_storage();