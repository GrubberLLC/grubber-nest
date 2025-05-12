import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindNearbyPlacesDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: 37.7749,
    type: Number,
  })
  @IsNumber()
  latitude!: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -122.4194,
    type: Number,
  })
  @IsNumber()
  longitude!: number;

  @ApiProperty({
    description: 'Optional keyword to filter places',
    example: 'coffee',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  keyword?: string;
}
