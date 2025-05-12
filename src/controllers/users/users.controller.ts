import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../../services/users/users.service.js';
import { DeleteUserDto } from './dto/delete-user.dto.js';
import { getErrorMessage } from '../../types/supabase.types.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller()
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
}
