import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetAuth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
  },
);
