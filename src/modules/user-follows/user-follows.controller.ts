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
import { UserFollowsService, UserFollow } from './user-follows.service';
import { CreateUserFollowDto, UpdateUserFollowDto } from './dto/user-follows.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('user-follows')
@UseGuards(JwtAuthGuard)
export class UserFollowsController {
  constructor(private readonly userFollowsService: UserFollowsService) {}

  @Post()
  create(
    @GetUser('id') followerId: number,
    @Body() createUserFollowDto: CreateUserFollowDto,
  ): Promise<UserFollow> {
    return this.userFollowsService.create(followerId, createUserFollowDto);
  }

  @Get()
  findAll(): Promise<UserFollow[]> {
    return this.userFollowsService.findAll();
  }

  @Get('following')
  findFollowing(@GetUser('id') followerId: number): Promise<UserFollow[]> {
    return this.userFollowsService.findByFollowerId(followerId);
  }

  @Get('followers')
  findFollowers(@GetUser('id') followedId: number): Promise<UserFollow[]> {
    return this.userFollowsService.findByFollowedId(followedId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserFollow> {
    return this.userFollowsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserFollowDto: UpdateUserFollowDto,
  ): Promise<UserFollow> {
    return this.userFollowsService.update(id, updateUserFollowDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<UserFollow> {
    return this.userFollowsService.remove(id);
  }
} 