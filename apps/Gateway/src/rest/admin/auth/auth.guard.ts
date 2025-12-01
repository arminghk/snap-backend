import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import { Response } from 'express';
import { RequestWithUserData } from 'src/dtos/public.dto';
import { UtilsService } from 'src/_utils/utils.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AdminAuthService,
    private readonly utils: UtilsService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: RequestWithUserData = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    if (isPublic) {
      const token =
        request.cookies[this.utils.JwtHandler.AccessToken.revoke('ADMIN').name];

      if (token) {
        throw new UnauthorizedException('already_logged_in');
      }

      return true;
    }

    const authorized = await this.authService.authorize(
      request.cookies[this.utils.JwtHandler.AccessToken.revoke('ADMIN').name],
    );

    request.acc_profile = authorized.profile;
    request.acc_session = authorized.session;
    request.acc_type = 'ADMIN';
    request.acc_isActive = authorized.isActive;

    if (authorized.clearCookie) response.clearCookie(authorized.clearCookie);
    if (!authorized.isAuthorized)
      throw new UnauthorizedException('err_auth_unauthorized');

    if (authorized.tokenData) {
      const td = authorized.tokenData;
      response.cookie('auth_admin', td.token, {
        maxAge: td.ttl, 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    }

    return authorized.isAuthorized;
  }
}
