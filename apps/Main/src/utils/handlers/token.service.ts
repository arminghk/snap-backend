import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {  
  constructor(
    private readonly jwt: NestJwtService,
    private readonly config: ConfigService
  ) {}

  generateAccessToken(payload: object) {
    const secret = this.config.get<string>('Jwt.access.secret');
    const expiresIn = this.config.get<number>('Jwt.access.expiresInSeconds');
    return this.jwt.sign(payload, { secret, expiresIn });
  }

  generateRefreshToken(payload: object) {
    const secret = this.config.get<string>('Jwt.refresh.secret');
    const expiresIn = this.config.get<number>('Jwt.refresh.expiresInSeconds');
    return this.jwt.sign(payload, { secret, expiresIn });
  }

  verifyAccessToken(token: string) {
    const secret = this.config.get<string>('Jwt.access.secret');
    return this.jwt.verify(token, { secret });
  }

  verifyRefreshToken(token: string) {
    const secret = this.config.get<string>('Jwt.refresh.secret');
    return this.jwt.verify(token, { secret });
  }
}
