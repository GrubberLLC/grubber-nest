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
import { PreferencesService } from '../../services/preferences/preferences.service.js';
import {
  CreatePreferenceDto,
  UpdatePreferenceDto,
  GetPreferenceDto,
  DeletePreferenceDto,
} from './dto/preferences.dto.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('preferences')
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user preferences' })
  @ApiBody({ type: CreatePreferenceDto })
  @ApiResponse({
    status: 201,
    description: 'Preferences successfully created',
    type: CreatePreferenceDto,
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
  async createPreference(@Body() createPreferenceDto: CreatePreferenceDto) {
    try {
      return await this.preferencesService.createPreference(createPreferenceDto);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to create preferences',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user preferences' })
  @ApiBody({ type: GetPreferenceDto })
  @ApiResponse({
    status: 200,
    description: 'Preferences successfully retrieved',
    type: [CreatePreferenceDto],
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
  async getPreferences(@Body() getPreferenceDto: GetPreferenceDto) {
    try {
      return await this.preferencesService.getPreferences(getPreferenceDto.userId);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to get preferences',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiBody({ type: UpdatePreferenceDto })
  @ApiResponse({
    status: 200,
    description: 'Preferences successfully updated',
    type: UpdatePreferenceDto,
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
  async updatePreference(@Body() updatePreferenceDto: UpdatePreferenceDto) {
    try {
      return await this.preferencesService.updatePreference(updatePreferenceDto);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to update preferences',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user preferences' })
  @ApiBody({ type: DeletePreferenceDto })
  @ApiResponse({
    status: 200,
    description: 'Preferences successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Preference deleted successfully' },
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
  async deletePreference(@Body() deletePreferenceDto: DeletePreferenceDto) {
    try {
      return await this.preferencesService.deletePreference(deletePreferenceDto.preferenceId);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to delete preferences',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
