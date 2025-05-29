// @ts-expect-erro there is an issue with the return type of the service
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProfileService } from '../../services/profile/profile.service.js';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

interface DeleteResponse {
  message: string;
}

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create profile' })
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({
    status: 201,
    description: 'Profile successfully created',
    type: CreateProfileDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Server error',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        details: { type: 'string' },
      },
    },
  })
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<CreateProfileDto> {
    try {
      const result = await (
        this.profileService.createProfile as (
          ...args: unknown[]
        ) => Promise<unknown>
      )(createProfileDto);
      if (!result) {
        throw new Error('Failed to create profile');
      }
      return result as CreateProfileDto;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          error: 'Failed to create profile',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile successfully retrieved',
    type: CreateProfileDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Server error',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        details: { type: 'string' },
      },
    },
  })
  async getProfile(@Body('userId') userId: string): Promise<CreateProfileDto> {
    try {
      const result = await (
        this.profileService.getProfile as (
          ...args: unknown[]
        ) => Promise<unknown>
      )(userId);
      if (!result) {
        throw new Error('Failed to get profile');
      }
      return result as CreateProfileDto;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          error: 'Failed to get profile',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile successfully updated',
    type: UpdateProfileDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Server error',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        details: { type: 'string' },
      },
    },
  })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UpdateProfileDto> {
    try {
      const result = await (
        this.profileService.updateProfile as (
          ...args: unknown[]
        ) => Promise<unknown>
      )(updateProfileDto);
      if (!result) {
        throw new Error('Failed to update profile');
      }
      return result as UpdateProfileDto;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          error: 'Failed to update profile',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Profile deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Server error',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        details: { type: 'string' },
      },
    },
  })
  async deleteProfile(
    @Body('profileId') profileId: string,
  ): Promise<DeleteResponse> {
    try {
      const result = await this.profileService.deleteProfile(profileId);
      if (!result) {
        throw new Error('Failed to delete profile');
      }
      return result as DeleteResponse;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          error: 'Failed to delete profile',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
