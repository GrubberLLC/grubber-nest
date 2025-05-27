import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  username!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  full_name!: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  avatar_url?: string;
}
