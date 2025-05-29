import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../controllers/auth/dto/login.dto.js';
import { SignupDto } from '../../controllers/auth/dto/signup.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async login(loginDto: LoginDto) {
    try {
      const { data, error } =
        await this.supabaseService.client.auth.signInWithPassword({
          email: loginDto.email,
          password: loginDto.password,
        });

      if (error) {
        throw new UnauthorizedException(error.message);
      }

      return {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        user: data.user,
      };
    } catch (err) {
      const error = err as Error;
      throw new UnauthorizedException(error.message);
    }
  }

  async signup(signupDto: SignupDto) {
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

      if (error) {
        throw new UnauthorizedException(error.message);
      }

      return {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        user: data.user,
      };
    } catch (err) {
      const error = err as Error;
      throw new UnauthorizedException(error.message);
    }
  }

  async logout() {
    try {
      const { error } = await this.supabaseService.client.auth.signOut();

      if (error) {
        throw new UnauthorizedException(error.message);
      }

      return { message: 'Logged out successfully' };
    } catch (err) {
      const error = err as Error;
      throw new UnauthorizedException(error.message);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const { data, error } =
        await this.supabaseService.client.auth.refreshSession({
          refresh_token: refreshToken,
        });

      if (error) {
        throw new UnauthorizedException(error.message);
      }

      return {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      };
    } catch (err) {
      const error = err as Error;
      throw new UnauthorizedException(error.message);
    }
  }
}
