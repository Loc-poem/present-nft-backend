import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, RequestMethod, UnauthorizedException } from '@nestjs/common';
import { Utils } from "../utils/utils";
import { Reflector } from "@nestjs/core";
import { userService } from "../../modules/user/user.service";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: userService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let user = request.user;
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    user = await this.userService.getUserInformation(user);
    if (roles && !roles.includes(user.role)) throw new UnauthorizedException('Unauthorized');
    return true;
  }
}
