import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserFollowsService } from './user-follows.service';
import { UserFollowsController } from './user-follows.controller';

@Module({
  imports: [ConfigModule],
  controllers: [UserFollowsController],
  providers: [UserFollowsService],
  exports: [UserFollowsService],
})
export class UserFollowsModule {} 