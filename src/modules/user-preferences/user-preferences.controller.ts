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
import { UserPreferencesService, UserPreferences } from './user-preferences.service';
import { CreateUserPreferencesDto, UpdateUserPreferencesDto } from './dto/user-preferences.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('user-preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) {}

  @Post()
  create(
    @GetUser('id') userId: number,
    @Body() createUserPreferencesDto: CreateUserPreferencesDto,
  ): Promise<UserPreferences> {
    return this.userPreferencesService.create(userId, createUserPreferencesDto);
  }

  @Get()
  findAll(): Promise<UserPreferences[]> {
    return this.userPreferencesService.findAll();
  }

  @Get('me')
  findMyPreferences(@GetUser('id') userId: number): Promise<UserPreferences> {
    return this.userPreferencesService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserPreferences> {
    return this.userPreferencesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserPreferencesDto: UpdateUserPreferencesDto,
  ): Promise<UserPreferences> {
    return this.userPreferencesService.update(id, updateUserPreferencesDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<UserPreferences> {
    return this.userPreferencesService.remove(id);
  }
} 