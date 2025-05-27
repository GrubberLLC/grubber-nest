import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
    type: String,
  })
  @IsString()
  email!: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 8,
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(8)
  password!: string;
} 