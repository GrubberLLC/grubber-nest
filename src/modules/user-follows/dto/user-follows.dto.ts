import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';

export enum FollowStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum FollowActive {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateUserFollowDto {
  @ApiProperty({ description: 'ID of the user being followed' })
  @IsString()
  followed_id!: string;

  @ApiProperty({ description: 'ID of the user who is following' })
  @IsString()
  follower_id!: string;

  @IsEnum(FollowStatus)
  follow_status: FollowStatus = FollowStatus.PENDING;

  @IsEnum(FollowActive)
  follow_active: FollowActive = FollowActive.ACTIVE;
}

export class UpdateUserFollowDto {
  @ApiProperty({ description: 'ID of the user being followed' })
  @IsString()
  followed_id?: string;

  @IsEnum(FollowStatus)
  follow_status!: FollowStatus;

  @IsEnum(FollowActive)
  follow_active!: FollowActive;
}
