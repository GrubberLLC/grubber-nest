import { Module } from '@nestjs/common';
import { PlacesController } from '../../controllers/places/places.controller.js';
import { PlacesService } from '../../services/places/places.service.js';
import { SupabaseModule } from '../supabase/supabase.module.js';
import { GooglePlacesModule } from '../google-places/google-places.module.js';

@Module({
  imports: [SupabaseModule, GooglePlacesModule],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
