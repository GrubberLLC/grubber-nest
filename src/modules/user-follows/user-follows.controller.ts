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
  Request,
} from '@nestjs/common';
import { UserFollowsService, UserFollow } from './user-follows.service.js';
import {
  CreateUserFollowDto,
  UpdateUserFollowDto,
} from './dto/user-follows.dto.js';
import { JwtAuthGuard } from '../../services/auth/guards/jwt-auth.guard.js';
import { GetUser } from '../../controllers/auth/decorators/get-user.decorator.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FollowStatus, FollowActive } from './user-follows.enum.js';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@Controller('user-follows')
@UseGuards(JwtAuthGuard)
export class UserFollowsController {
  constructor(private readonly userFollowsService: UserFollowsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new user follow relationship' })
  @ApiResponse({
    status: 201,
    description: 'User follow relationship created successfully',
  })
  async create(
    @Body() createUserFollowDto: CreateUserFollowDto,
    @Request() req: RequestWithUser,
  ): Promise<UserFollow> {
    const followerId = req.user.id;
    return this.userFollowsService.create({
      follower_id: followerId,
      followed_id: createUserFollowDto.followed_id,
      follow_status: FollowStatus.PENDING,
      follow_active: FollowActive.ACTIVE,
    });
  }

  @Get()
  findAll(): Promise<UserFollow[]> {
    return this.userFollowsService.findAll();
  }

  @Get('following')
  findFollowing(@GetUser('userId') followerId: string): Promise<UserFollow[]> {
    return this.userFollowsService.findByFollowerId(followerId);
  }

  @Get('followers')
  findFollowers(@GetUser('userId') followedId: string): Promise<UserFollow[]> {
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
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') followerId: string,
  ): Promise<UserFollow> {
    console.log(followerId);
    return this.userFollowsService.remove(id);
  }
}
