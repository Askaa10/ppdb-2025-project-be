import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CreatedBy = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.user.id; 

   
    const payload = request.body;
    if (Array.isArray(payload)) {
      return payload.map((item) => ({ ...item, created_by: { id: userId } }));
    } else {
      return { ...payload, created_by: { id: userId } };
    }
  },
);