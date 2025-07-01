// src/common/decorators/user-id.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/domainObjects/user';

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<{ user: number }>().user,
);