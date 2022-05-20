import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private userService: UserService) {
    super()
  }

  canActivate(context: ExecutionContext) {

    const http = context.switchToHttp();
    const { headers } = http.getRequest();
    const response = http.getResponse();
    response.setHeader('Cache-Control', 'no-store');

    if (!headers.authorization) {
      return false
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

}