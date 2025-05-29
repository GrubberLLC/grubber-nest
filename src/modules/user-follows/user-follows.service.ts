import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase/supabase.service.js';
import {
  CreateUserFollowDto,
  UpdateUserFollowDto,
} from './dto/user-follows.dto.js';
import {
  PostgrestSingleResponse,
  PostgrestResponse,
} from '@supabase/supabase-js';

export interface UserFollow {
  id: number;
  follower_id: string;
  followed_id: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class UserFollowsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createUserFollowDto: CreateUserFollowDto): Promise<UserFollow> {
    const response = await this.supabaseService.client
      .from('user_follows')
      .insert(createUserFollowDto)
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<UserFollow>;

    if (error) throw error;
    return data;
  }

  async findAll(): Promise<UserFollow[]> {
    const response = await this.supabaseService.client
      .from('user_follows')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = response as PostgrestResponse<UserFollow>;

    if (error) throw error;
    return data;
  }

  async findOne(id: number): Promise<UserFollow> {
    const response = await this.supabaseService.client
      .from('user_follows')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = response as PostgrestSingleResponse<UserFollow>;

    if (error || !data) {
      throw new NotFoundException(`User follow with ID ${id} not found`);
    }

    return data;
  }

  async findByFollowerId(followerId: string): Promise<UserFollow[]> {
    const response = await this.supabaseService.client
      .from('user_follows')
      .select('*')
      .eq('follower_id', followerId)
      .order('created_at', { ascending: false });

    const { data, error } = response as PostgrestResponse<UserFollow>;

    if (error) throw error;
    return data;
  }

  async findByFollowedId(followedId: string): Promise<UserFollow[]> {
    const response = await this.supabaseService.client
      .from('user_follows')
      .select('*')
      .eq('followed_id', followedId)
      .order('created_at', { ascending: false });

    const { data, error } = response as PostgrestResponse<UserFollow>;

    if (error) throw error;
    return data;
  }

  async update(
    id: number,
    updateUserFollowDto: UpdateUserFollowDto,
  ): Promise<UserFollow> {
    const response = await this.supabaseService.client
      .from('user_follows')
      .update(updateUserFollowDto)
      .eq('id', id)
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<UserFollow>;

    if (error || !data) {
      throw new NotFoundException(`User follow with ID ${id} not found`);
    }

    return data;
  }

  async remove(id: number): Promise<UserFollow> {
    const response = await this.supabaseService.client
      .from('user_follows')
      .delete()
      .eq('id', id)
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<UserFollow>;

    if (error || !data) {
      throw new NotFoundException(`User follow with ID ${id} not found`);
    }

    return data;
  }
}
