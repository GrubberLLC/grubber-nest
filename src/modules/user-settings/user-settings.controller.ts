import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { CreateUserSettingsDto, UpdateUserSettingsDto } from './dto/user-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user-settings')
@UseGuards(JwtAuthGuard)
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Post()
  create(@Request() req, @Body() createUserSettingsDto: CreateUserSettingsDto) {
    return this.userSettingsService.create(req.user.userId, createUserSettingsDto);
  }

  @Get()
  findAll() {
    return this.userSettingsService.findAll();
  }

  @Get('me')
  findMySettings(@Request() req) {
    return this.userSettingsService.findByUserId(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSettingsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.userSettingsService.update(+id, updateUserSettingsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSettingsService.remove(+id);
  }
} 