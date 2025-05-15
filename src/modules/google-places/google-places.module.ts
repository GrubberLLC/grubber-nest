import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GooglePlacesApiService } from '../../services/google-places/google-places.service.js';

@Module({
  imports: [ConfigModule],
  providers: [GooglePlacesApiService],
  exports: [GooglePlacesApiService],
})
export class GooglePlacesModule {}
