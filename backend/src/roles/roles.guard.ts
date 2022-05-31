import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return false;
    }
    // const user = await context.getArgByIndex(1).req.user;
    const user = context.switchToHttp().getRequest().user;
    if (roles.includes(user._doc.role)) {
      return true;
    }
    return false;
  }


}