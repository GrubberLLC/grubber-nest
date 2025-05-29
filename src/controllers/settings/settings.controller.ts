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
import { SettingsService } from '../../services/settings/settings.service.js';
import {
  CreateSettingsDto,
  UpdateSettingsDto,
  GetSettingsDto,
  DeleteSettingsDto,
} from './dto/settings.dto.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

interface DeleteResponse {
  message: string;
}

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user settings' })
  @ApiBody({ type: CreateSettingsDto })
  @ApiResponse({
    status: 201,
    description: 'Settings successfully created',
    type: CreateSettingsDto,
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
  async createSettings(
    @Body() createSettingsDto: CreateSettingsDto,
  ): Promise<CreateSettingsDto> {
    try {
      return await this.settingsService.createSettings(createSettingsDto);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to create settings',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user settings' })
  @ApiBody({ type: GetSettingsDto })
  @ApiResponse({
    status: 200,
    description: 'Settings successfully retrieved',
    type: [CreateSettingsDto],
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
  async getSettings(
    @Body() getSettingsDto: GetSettingsDto,
  ): Promise<CreateSettingsDto[]> {
    try {
      return await this.settingsService.getSettings(getSettingsDto.userId);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to get settings',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user settings' })
  @ApiBody({ type: UpdateSettingsDto })
  @ApiResponse({
    status: 200,
    description: 'Settings successfully updated',
    type: UpdateSettingsDto,
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
  async updateSettings(
    @Body() updateSettingsDto: UpdateSettingsDto,
  ): Promise<UpdateSettingsDto> {
    try {
      return await this.settingsService.updateSettings(updateSettingsDto);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to update settings',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user settings' })
  @ApiBody({ type: DeleteSettingsDto })
  @ApiResponse({
    status: 200,
    description: 'Settings successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Settings deleted successfully' },
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
  async deleteSettings(
    @Body() deleteSettingsDto: DeleteSettingsDto,
  ): Promise<DeleteResponse> {
    try {
      return await this.settingsService.deleteSettings(deleteSettingsDto.id);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to delete settings',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
