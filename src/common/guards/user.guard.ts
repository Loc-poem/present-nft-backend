import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, RequestMethod, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { Utils } from "../utils/utils";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = Utils.decodeJwtService(request.headers['authorization'], this.jwtService);
    request.user = user;
    return true;
    throw new UnauthorizedException('Unauthorized');
  }
}
