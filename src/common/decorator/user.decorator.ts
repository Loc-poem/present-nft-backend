import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Utils } from "../utils/utils";
import { JwtService } from "@nestjs/jwt";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    //const jwtService = new JwtService();
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);