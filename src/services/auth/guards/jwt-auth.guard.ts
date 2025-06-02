// @ts-expect-erro there is an issue with the return type of the service

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from '../../supabase/supabase.service.js';
import { Request } from 'express';
import { Observable } from 'rxjs';

interface User {
  id: string;
  email: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly supabaseService: SupabaseService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    return this.validateToken(token).then(() => true);
  }

  private async validateToken(token: string): Promise<void> {
    try {
      const { data, error } =
        await this.supabaseService.client.auth.getUser(token);

      if (error || !data.user) {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Authentication failed';
      throw new UnauthorizedException(errorMessage);
    }
  }

  handleRequest<TUser extends User>(err: unknown, user: TUser | null): TUser {
    if (err || !user) {
      const errorMessage = err instanceof Error ? err.message : 'Unauthorized';
      throw new UnauthorizedException(errorMessage);
    }
    return user;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
