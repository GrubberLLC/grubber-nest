import { Module } from '@nestjs/common';
import { PlacesController } from '../../controllers/places/places.controller.js';
import { PlacesService } from '../../services/places/places.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { GooglePlacesModule } from '../google-places/google-places.module.js';
import { PlacePhotoService } from '../../services/place-photos/place-photos.service.js';
import { SupabasePlaceDataService } from '../../services/supabase-place-data/supabase-place-data.service.js';
import { PlaceIdManagementService } from '../../services/place-id-management/place-id-management.service.js';

@Module({
  imports: [SupabaseModule, GooglePlacesModule],
  controllers: [PlacesController],
  providers: [
    PlacesService,
    PlacePhotoService,
    SupabasePlaceDataService,
    PlaceIdManagementService,
  ],
  // exports: [PlacesService, PlacePhotoService] // Optionally export if needed elsewhere
})
export class PlacesModule {}
