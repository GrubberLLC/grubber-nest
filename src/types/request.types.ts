import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    user_metadata: Record<string, unknown>;
  };
}
