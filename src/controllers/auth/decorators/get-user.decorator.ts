import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../../../types/request.types.js';

type UserProperty = keyof RequestWithUser['user'];

export const GetUser = createParamDecorator(
  (data: UserProperty | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return data ? user[data] : user;
  },
);
