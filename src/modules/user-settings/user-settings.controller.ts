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
import { UserSettingsService } from './user-settings.service.js';
import {
  CreateUserSettingsDto,
  UpdateUserSettingsDto,
} from './dto/user-settings.dto.js';
import { JwtAuthGuard } from '../../services/auth/guards/jwt-auth.guard.js';
import { GetUser } from '../../controllers/auth/decorators/get-user.decorator.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user-settings')
@UseGuards(JwtAuthGuard)
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create user settings' })
  @ApiResponse({
    status: 201,
    description: 'User settings created successfully',
  })
  async create(
    @GetUser('userId') userId: string,
    @Body() createUserSettingsDto: CreateUserSettingsDto,
  ) {
    return this.userSettingsService.create({
      ...createUserSettingsDto,
      user_id: userId,
    });
  }

  @Get('me')
  findMySettings(@GetUser('userId') userId: string) {
    return this.userSettingsService.findByUserId(userId);
  }

  @Get()
  findAll() {
    return this.userSettingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userSettingsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.userSettingsService.update(id, updateUserSettingsDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userSettingsService.remove(id);
  }
}
