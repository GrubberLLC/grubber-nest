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
} from './dto/preferences.dto.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

interface DeleteResponse {
  message: string;
}

@ApiTags('preferences')
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create preference' })
  @ApiBody({ type: CreatePreferenceDto })
  @ApiResponse({
    status: 201,
    description: 'Preference successfully created',
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
  async createPreference(
    @Body() createPreferenceDto: CreatePreferenceDto,
  ): Promise<CreatePreferenceDto> {
    try {
      const result: CreatePreferenceDto | null =
        await this.preferencesService.create(createPreferenceDto);
      if (!result) {
        throw new Error('Failed to create preference');
      }
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          error: 'Failed to create preference',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get preferences' })
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
  async getPreferences(
    @Body('userId') userId: string,
  ): Promise<CreatePreferenceDto[]> {
    try {
      const result: CreatePreferenceDto[] =
        await this.preferencesService.findAll(userId);
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          error: 'Failed to get preferences',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update preference' })
  @ApiBody({ type: UpdatePreferenceDto })
  @ApiResponse({
    status: 200,
    description: 'Preference successfully updated',
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
  async updatePreference(
    @Body() updatePreferenceDto: UpdatePreferenceDto,
  ): Promise<UpdatePreferenceDto> {
    try {
      const result: UpdatePreferenceDto | null =
        await this.preferencesService.update(
          updatePreferenceDto.preferenceId,
          updatePreferenceDto,
        );
      if (!result) {
        throw new Error('Failed to update preference');
      }
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          error: 'Failed to update preference',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete preference' })
  @ApiBody({ type: UpdatePreferenceDto })
  @ApiResponse({
    status: 200,
    description: 'Preference successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Preference deleted successfully',
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
  async deletePreference(
    @Body('preferenceId') preferenceId: string,
  ): Promise<DeleteResponse> {
    try {
      const result: DeleteResponse | null =
        await this.preferencesService.remove(preferenceId);
      if (!result) {
        throw new Error('Failed to delete preference');
      }
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        {
          error: 'Failed to delete preference',
          details: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
