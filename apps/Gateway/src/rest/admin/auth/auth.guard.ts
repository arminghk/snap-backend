import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import { Response } from 'express';
import { RequestWithUserData } from 'src/dtos/public.dto';


@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(
        private readonly authService: AdminAuthService,
    ) { }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request: RequestWithUserData = context.switchToHttp().getRequest();
        const response: Response = context.switchToHttp().getResponse();
        const authorized = await this.authService.authorize('ADMIN');
        request.acc_profile = authorized.profile;
        request.acc_session = authorized.session;
        request.acc_type = "ADMIN";
        request.acc_isActive = authorized.isActive;

        if (authorized.clearCookie) response.clearCookie(authorized.clearCookie);
        if (!authorized.isAuthorized) throw new UnauthorizedException('err_auth_unauthorized');
        return authorized.isAuthorized;
    }
}