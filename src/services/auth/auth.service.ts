
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async login(loginDto: { email: string; password: string }) {
    try {
      const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
        email: loginDto.email,
        password: loginDto.password,
      });

      if (error) throw new UnauthorizedException(error.message);

      return {
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        user: data.user,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async signup(signupDto: { email: string; password: string; username: string }) {
    try {
      const { data, error } = await this.supabaseService.client.auth.signUp({
        email: signupDto.email,
        password: signupDto.password,
        options: {
          data: {
            username: signupDto.username,
          },
        },
      });

      if (error) throw new UnauthorizedException(error.message);

      return {
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        user: data.user,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to create account');
    }
  }

  async refreshToken(refreshTokenDto: { refreshToken: string }) {
    try {
      const { data, error } = await this.supabaseService.client.auth.refreshSession({
        refresh_token: refreshTokenDto.refreshToken,
      });

      if (error) throw new UnauthorizedException(error.message);

      return {
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');

    }
  }
} 