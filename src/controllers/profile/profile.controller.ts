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
import {
  CreateProfileDto,
  UpdateProfileDto,
  GetProfileDto,
  DeleteProfileDto,
} from './dto/profile.dto.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user profile' })
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
  async createProfile(@Body() createProfileDto: CreateProfileDto) {
    try {
      return await this.profileService.createProfile(createProfileDto);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to create profile',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBody({ type: GetProfileDto })
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
  async getProfile(@Body() getProfileDto: GetProfileDto) {
    try {
      return await this.profileService.getProfile(getProfileDto.userId);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to get profile',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
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
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    try {
      return await this.profileService.updateProfile(updateProfileDto);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to update profile',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user profile' })
  @ApiBody({ type: DeleteProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Profile deleted successfully' },
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
  async deleteProfile(@Body() deleteProfileDto: DeleteProfileDto) {
    try {
      return await this.profileService.deleteProfile(deleteProfileDto.id);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to delete profile',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 