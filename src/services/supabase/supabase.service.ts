import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { getErrorMessage } from '../../types/supabase.types.js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private supabaseClient!: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
      const supabaseServiceRoleKey = this.configService.get<string>(
        'SUPABASE_SERVICE_ROLE_KEY',
      );

      if (!supabaseUrl || !supabaseServiceRoleKey) {
        this.logger.error('Supabase configuration is missing!');
        throw new Error('Supabase configuration is missing!');
      }

      // Using a single client with admin privileges
      // Type assertion is needed due to strict TypeScript setting
      this.supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

      this.logger.log('Supabase client initialized successfully.');
    } catch (error) {
      this.logger.error(
        'Failed to initialize Supabase client:',
        getErrorMessage(error),
      );
      throw error;
    }
  }

  getClient(): SupabaseClient {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
    return this.supabaseClient;
  }

  // Keep this method for backward compatibility
  getAdminClient(): SupabaseClient {
    return this.getClient();
  }
}
