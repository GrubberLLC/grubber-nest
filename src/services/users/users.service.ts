import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import {
  ListRecord,
  SupabaseResponse,
  getErrorMessage,
} from '../../types/supabase.types.js';
import { CreateUserDto } from '../../controllers/users/dto/create-user.dto.js';
import { UpdateUserDto } from '../../controllers/users/dto/update-user.dto.js';
import {
  PostgrestSingleResponse,
  PostgrestResponse,
} from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  user_metadata: Record<string, unknown>;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async deleteUser(userId: string): Promise<void> {
    this.logger.log(`Deleting user with ID: ${userId}`);

    try {
      // Get client
      const supabase = this.supabaseService.client;

      // Fetch all lists owned by the user
      const response = await supabase
        .from('Lists')
        .select('id')
        .eq('userId', userId);

      // Type assertion for response
      const { data: userLists, error: fetchListsError } =
        response as unknown as SupabaseResponse<ListRecord[]>;

      if (fetchListsError) {
        throw new Error(
          `Failed to fetch user lists: ${fetchListsError.message}`,
        );
      }

      const listIds = (userLists || []).map((list) => list.id);

      // Delete all user-related data in correct order
      await this.deleteUserData(userId, listIds);

      // Delete user from Supabase Auth (must be last)
      const authResponse = await supabase.auth.admin.deleteUser(userId);
      const { error: authError } = authResponse as unknown as {
        error: { message: string } | null;
      };

      if (authError) {
        throw new Error(
          `Failed to delete user from Auth: ${authError.message}`,
        );
      }

      this.logger.log(`Successfully deleted user with ID: ${userId}`);
    } catch (error) {
      this.logger.error(`Error deleting user: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  /**
   * Deletes all user-related data in the correct order to satisfy foreign key constraints.
   */
  private async deleteUserData(
    userId: string,
    listIds: string[],
  ): Promise<void> {
    const supabase = this.supabaseService.client;
    try {
      // 1. Delete dependent records first
      if (listIds.length > 0) {
        await supabase.from('Activity').delete().in('listId', listIds);
        await supabase.from('PlacesInLists').delete().in('listId', listIds);
        await supabase.from('Members').delete().in('listId', listIds);
      }

      // 2. Delete lists (once all references are gone)
      if (listIds.length > 0) {
        await supabase.from('Lists').delete().eq('userId', userId);
      }

      // 3. Delete other references to user
      await supabase
        .from('Following')
        .delete()
        .or(`followerId.eq.${userId}, followingId.eq.${userId}`);

      await supabase.from('Profiles').delete().eq('userId', userId);
    } catch (error) {
      this.logger.error(`Error deleting user data: ${getErrorMessage(error)}`);
      throw new Error(
        `Failed to delete user-related data: ${getErrorMessage(error)}`,
      );
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    this.logger.log(`Attempting login for user with email: ${email}`);

    try {
      const supabase = this.supabaseService.client;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(`Login failed: ${error.message}`);
      }

      if (!data.session) {
        throw new Error('No session data returned from login');
      }

      this.logger.log(`Successfully logged in user with email: ${email}`);

      return {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };
    } catch (error) {
      this.logger.error(`Error during login: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async signup(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    this.logger.log(`Attempting signup for user with email: ${email}`);

    try {
      const supabase = this.supabaseService.client;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(`Signup failed: ${error.message}`);
      }

      if (!data.session) {
        throw new Error('No session data returned from signup');
      }

      this.logger.log(`Successfully signed up user with email: ${email}`);

      return {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };
    } catch (error) {
      this.logger.error(`Error during signup: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const response = await this.supabaseService.client
      .from('users')
      .insert(createUserDto)
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<User>;

    if (error) throw error;
    return data;
  }

  async findAll(): Promise<User[]> {
    const response = await this.supabaseService.client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = response as PostgrestResponse<User>;

    if (error) throw error;
    return data;
  }

  async findOne(id: string): Promise<User> {
    const response = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = response as PostgrestSingleResponse<User>;

    if (error || !data) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return data;
  }

  async findByEmail(email: string): Promise<User> {
    const response = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    const { data, error } = response as PostgrestSingleResponse<User>;

    if (error || !data) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const response = await this.supabaseService.client
      .from('users')
      .update(updateUserDto)
      .eq('id', id)
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<User>;

    if (error || !data) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return data;
  }

  async remove(id: string): Promise<User> {
    const response = await this.supabaseService.client
      .from('users')
      .delete()
      .eq('id', id)
      .select()
      .single();

    const { data, error } = response as PostgrestSingleResponse<User>;

    if (error || !data) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return data;
  }
}
