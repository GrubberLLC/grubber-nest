import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase/supabase.service.js';
import {
  CreateUserSettingsDto,
  UpdateUserSettingsDto,
} from './dto/user-settings.dto.js';
import {
  PostgrestSingleResponse,
  PostgrestResponse,
} from '@supabase/supabase-js';

export interface UserSettings {
  id: number;
  user_id: string;
  primary_location: string;
  primary_usage: string;
  receive_notifications: boolean;
  newsletter_subscription: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class UserSettingsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    createUserSettingsDto: CreateUserSettingsDto,
  ): Promise<UserSettings> {
    const response = await this.supabaseService.client
      .from('user_settings')
      .insert(createUserSettingsDto)
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<UserSettings>;

    if (error) throw error;
    return data;
  }

  async findAll(): Promise<UserSettings[]> {
    const response = await this.supabaseService.client
      .from('user_settings')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = response as PostgrestResponse<UserSettings>;

    if (error) throw error;
    return data;
  }

  async findOne(id: number): Promise<UserSettings> {
    const response = await this.supabaseService.client
      .from('user_settings')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = response as PostgrestSingleResponse<UserSettings>;

    if (error || !data) {
      throw new NotFoundException(`User settings with ID ${id} not found`);
    }

    return data;
  }

  async findByUserId(userId: string): Promise<UserSettings> {
    const response = await this.supabaseService.client
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data, error } = response as PostgrestSingleResponse<UserSettings>;

    if (error || !data) {
      throw new NotFoundException(`User settings for user ${userId} not found`);
    }

    return data;
  }

  async update(
    id: number,
    updateUserSettingsDto: UpdateUserSettingsDto,
  ): Promise<UserSettings> {
    const response = await this.supabaseService.client
      .from('user_settings')
      .update(updateUserSettingsDto)
      .eq('id', id)
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<UserSettings>;

    if (error || !data) {
      throw new NotFoundException(`User settings with ID ${id} not found`);
    }

    return data;
  }

  async remove(id: number): Promise<UserSettings> {
    const response = await this.supabaseService.client
      .from('user_settings')
      .delete()
      .eq('id', id)
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<UserSettings>;

    if (error || !data) {
      throw new NotFoundException(`User settings with ID ${id} not found`);
    }

    return data;
  }
}
