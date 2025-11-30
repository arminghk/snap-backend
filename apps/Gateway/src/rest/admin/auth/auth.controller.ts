import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/response/httpException.filter';
import { ResponseInterceptor } from 'src/response/response.interceptors';
import { AdminAuthService } from './auth.service';
import {
  AdminSignInInputDto,
  GetAdminProfileOutputDto,
} from 'src/dtos/admin.dto';
import type { Response } from 'express';
import { AdminAuthGuard } from './auth.guard';
import type { RequestWithUserData } from 'src/dtos/public.dto';

@ApiTags('Admin: Auth')
@Controller('auth')
@ApiBadRequestResponse({ description: 'Bad Request | Bad Inputs' })
@ApiUnauthorizedResponse({ description: 'Session is expired | Unauthorized' })
@ApiForbiddenResponse({
  description: 'Permission denied | No Access | Not Subscribed',
})
@ApiUnsupportedMediaTypeResponse({
  description: 'Content|Context format is not supported or invalid',
})
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('signin')
  @ApiOperation({
    summary: 'Signin to panel as admin by username and password',
  })
  async signIn(
    @Body() body: AdminSignInInputDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetAdminProfileOutputDto> {
    const signInData = await this.authService.signIn(body);
    const tokenData = signInData.tokenData;
    res.cookie(tokenData.name, tokenData.token, {
      maxAge: tokenData.ttl,
      httpOnly: true,
    });
    delete signInData.tokenData;
    return signInData;
  }
  @Get('profile')
  @UseGuards(AdminAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get admin profile (guarded)' })
  async getProfile(
    @Req() req: RequestWithUserData,
  ): Promise<GetAdminProfileOutputDto> {
    return {
      userType: 'ADMIN',
      profile: req.acc_profile,
      session: req.acc_session,
    };
  }
}
