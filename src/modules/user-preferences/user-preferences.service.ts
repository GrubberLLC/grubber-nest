import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase/supabase.service.js';
import {
  CreateUserPreferencesDto,
  UpdateUserPreferencesDto,
} from './dto/user-preferences.dto.js';
import {
  PostgrestSingleResponse,
  PostgrestResponse,
} from '@supabase/supabase-js';

export interface UserPreferences {
  id: number;
  user_id: string;
  theme: string;
  language: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class UserPreferencesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    createUserPreferencesDto: CreateUserPreferencesDto,
  ): Promise<UserPreferences> {
    const response = await this.supabaseService.client
      .from('user_preferences')
      .insert(createUserPreferencesDto)
      .select()
      .single();

    const { data, error } =
      response as PostgrestSingleResponse<UserPreferences>;

    if (error) throw error;
    return data;
  }

  async findAll(): Promise<UserPreferences[]> {
    const response = await this.supabaseService.client
      .from('user_preferences')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = response as PostgrestResponse<UserPreferences>;

    if (error) throw error;
    return data;
  }

  async findOne(id: number): Promise<UserPreferences> {
    const response = await this.supabaseService.client
      .from('user_preferences')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } =
      response as PostgrestSingleResponse<UserPreferences>;

    if (error || !data) {
      throw new NotFoundException(`User preferences with ID ${id} not found`);
    }

    return data;
  }

  async findByUserId(userId: string): Promise<UserPreferences> {
    const response = await this.supabaseService.client
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data, error } =
      response as PostgrestSingleResponse<UserPreferences>;

    if (error || !data) {
      throw new NotFoundException(
        `User preferences for user ${userId} not found`,
      );
    }

    return data;
  }

  async update(
    id: number,
    updateUserPreferencesDto: UpdateUserPreferencesDto,
  ): Promise<UserPreferences> {
    const response = await this.supabaseService.client
      .from('user_preferences')
      .update(updateUserPreferencesDto)
      .eq('id', id)
      .select()
      .single();

    const { data, error } =
      response as PostgrestSingleResponse<UserPreferences>;

    if (error || !data) {
      throw new NotFoundException(`User preferences with ID ${id} not found`);
    }

    return data;
  }

  async remove(id: number): Promise<UserPreferences> {
    const response = await this.supabaseService.client
      .from('user_preferences')
      .delete()
      .eq('id', id)
      .select()
      .single();

    const { data, error } =
      response as PostgrestSingleResponse<UserPreferences>;

    if (error || !data) {
      throw new NotFoundException(`User preferences with ID ${id} not found`);
    }

    return data;
  }
}
