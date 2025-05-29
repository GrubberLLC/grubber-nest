import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service.js';
import {
  CreateUserPreferencesDto,
  UpdateUserPreferencesDto,
} from './dto/user-preferences.dto.js';
import { JwtAuthGuard } from '../../services/auth/guards/jwt-auth.guard.js';
import { GetUser } from '../../controllers/auth/decorators/get-user.decorator.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user-preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create user preferences' })
  @ApiResponse({
    status: 201,
    description: 'User preferences created successfully',
  })
  async create(
    @GetUser('userId') userId: string,
    @Body() createUserPreferencesDto: CreateUserPreferencesDto,
  ) {
    return this.userPreferencesService.create({
      ...createUserPreferencesDto,
      user_id: userId,
    });
  }

  @Get()
  findAll() {
    return this.userPreferencesService.findAll();
  }

  @Get('me')
  findMyPreferences(@GetUser('userId') userId: string) {
    return this.userPreferencesService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userPreferencesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserPreferencesDto: UpdateUserPreferencesDto,
  ) {
    return this.userPreferencesService.update(id, updateUserPreferencesDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userPreferencesService.remove(id);
  }
}
