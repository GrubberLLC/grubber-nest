import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
    required: true,
  })
  @IsString()
  email!: string;

  @ApiProperty({
    description: 'Password',
    example: 'password123',
    required: true,
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
