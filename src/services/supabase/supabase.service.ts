import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
        throw new Error('Missing Supabase configuration');
      }

      // Using a single client with admin privileges
      this.supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
      });

      this.logger.verbose('Supabase client initialized successfully.');
    } catch (error) {
      this.logger.error('Failed to initialize Supabase client:', error);
      throw error;
    }
  }

  get client(): SupabaseClient {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
    return this.supabaseClient;
  }

  // Keep this method for backward compatibility
  getAdminClient(): SupabaseClient {
    return this.client;
  }
}
