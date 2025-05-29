import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpException,
  HttpStatus,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../../services/users/users.service.js';
import { DeleteUserDto } from './dto/delete-user.dto.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto.js';
import { SignupDto } from './dto/signup.dto.js';
import { JwtAuthGuard } from '../../services/auth/guards/jwt-auth.guard.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('delete-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user and all associated data' })
  @ApiBody({ type: DeleteUserDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User deleted successfully' },
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
  async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    try {
      await this.usersService.deleteUser(deleteUserDto.userId);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to delete user',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refresh_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
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
  async login(@Body() loginDto: LoginDto) {
    try {
      const tokens = await this.usersService.login(
        loginDto.email,
        loginDto.password,
      );
      return tokens;
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to login user',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Signup a user' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed up',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refresh_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
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
  async signup(@Body() signupDto: SignupDto) {
    try {
      const tokens = await this.usersService.signup(
        signupDto.email,
        signupDto.password,
      );
      return tokens;
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to signup user',
          details: getErrorMessage(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'Current user information',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string', nullable: true },
        avatar_url: { type: 'string', nullable: true },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
        user_metadata: { type: 'object' },
      },
    },
  })
  async getMe(@GetUser('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string', nullable: true },
        avatar_url: { type: 'string', nullable: true },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
        user_metadata: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
