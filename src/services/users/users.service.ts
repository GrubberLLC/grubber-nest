import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';
import {
  ListRecord,
  SupabaseResponse,
  getErrorMessage,
} from '../../types/supabase.types.js';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async deleteUser(userId: string): Promise<void> {
    this.logger.log(`Deleting user with ID: ${userId}`);

    try {
      // Get client
      const supabase = this.supabaseService.getClient();

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
    const supabase = this.supabaseService.getClient();
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
}
