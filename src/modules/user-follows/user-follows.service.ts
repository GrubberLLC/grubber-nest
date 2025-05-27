import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserFollowDto, UpdateUserFollowDto, FollowStatus, FollowActive } from './dto/user-follows.dto';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

export interface UserFollow {
  follow_id: number;
  follower_id: number;
  followed_id: number;
  follow_status: FollowStatus;
  follow_active: FollowActive;
  follow_date: Date;
}

@Injectable()
export class UserFollowsService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
    });
  }

  async create(
    followerId: number,
    createUserFollowDto: CreateUserFollowDto,
  ): Promise<UserFollow> {
    // Check if follow relationship already exists
    const existingFollow = await this.pool.query<UserFollow>(
      'SELECT * FROM UserFollows WHERE follower_id = $1 AND followed_id = $2',
      [followerId, createUserFollowDto.followed_id],
    );

    if (existingFollow.rows[0]) {
      throw new ConflictException('Follow relationship already exists');
    }

    const query = `
      INSERT INTO UserFollows (
        follower_id, followed_id, follow_status, follow_active
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      followerId,
      createUserFollowDto.followed_id,
      createUserFollowDto.follow_status,
      createUserFollowDto.follow_active,
    ];

    const result = await this.pool.query<UserFollow>(query, values);
    return result.rows[0];
  }

  async findAll(): Promise<UserFollow[]> {
    const query = 'SELECT * FROM UserFollows;';
    const result = await this.pool.query<UserFollow>(query);
    return result.rows;
  }

  async findOne(followId: number): Promise<UserFollow> {
    const query = 'SELECT * FROM UserFollows WHERE follow_id = $1;';
    const result = await this.pool.query<UserFollow>(query, [followId]);

    if (!result.rows[0]) {
      throw new NotFoundException(`Follow relationship with ID ${followId} not found`);
    }

    return result.rows[0];
  }

  async findByFollowerId(followerId: number): Promise<UserFollow[]> {
    const query = 'SELECT * FROM UserFollows WHERE follower_id = $1;';
    const result = await this.pool.query<UserFollow>(query, [followerId]);
    return result.rows;
  }

  async findByFollowedId(followedId: number): Promise<UserFollow[]> {
    const query = 'SELECT * FROM UserFollows WHERE followed_id = $1;';
    const result = await this.pool.query<UserFollow>(query, [followedId]);
    return result.rows;
  }

  async update(
    followId: number,
    updateUserFollowDto: UpdateUserFollowDto,
  ): Promise<UserFollow> {
    const query = `
      UPDATE UserFollows
      SET
        follow_status = $1,
        follow_active = $2
      WHERE follow_id = $3
      RETURNING *;
    `;

    const values = [
      updateUserFollowDto.follow_status,
      updateUserFollowDto.follow_active,
      followId,
    ];

    const result = await this.pool.query<UserFollow>(query, values);

    if (!result.rows[0]) {
      throw new NotFoundException(`Follow relationship with ID ${followId} not found`);
    }

    return result.rows[0];
  }

  async remove(followId: number): Promise<UserFollow> {
    const query = 'DELETE FROM UserFollows WHERE follow_id = $1 RETURNING *;';
    const result = await this.pool.query<UserFollow>(query, [followId]);

    if (!result.rows[0]) {
      throw new NotFoundException(`Follow relationship with ID ${followId} not found`);
    }

    return result.rows[0];
  }
} 