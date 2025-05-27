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
  @IsString()
  followed_id!: string;

  @IsEnum(FollowStatus)
  follow_status: FollowStatus = FollowStatus.PENDING;

  @IsEnum(FollowActive)
  follow_active: FollowActive = FollowActive.ACTIVE;
}

export class UpdateUserFollowDto {
  @IsEnum(FollowStatus)
  follow_status!: FollowStatus;

  @IsEnum(FollowActive)
  follow_active!: FollowActive;
} 