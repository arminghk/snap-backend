import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export enum TokenAvailability {
  AVAILABLE = 'AVAILABLE',
  EXPIRED = 'EXPIRED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export interface AccessTokenPayload {
  driverId: string;
  sessionId: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
}

export interface AccessTokenResult {
  name: string;
  ttl: number;
  token: string;
  payload: AccessTokenPayload;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

 
  generateAccessToken(params: { driverId: string; sessionId: string }): AccessTokenResult {
    const now = Date.now();

    const accessExpiresInSec = this.config.get<number>('Jwt.access.expiresInSeconds')?? 3600;
    const refreshExpiresInSec = this.config.get<number>('Jwt.refresh.expiresInSeconds')?? 3600;

    const accessExpiresAt = now + accessExpiresInSec * 1000;
    const refreshExpiresAt = now + refreshExpiresInSec * 1000;

    const ttl = refreshExpiresInSec * 1000;

    const payload = {
      did: params.driverId,
      sid: params.sessionId,
      aea: accessExpiresAt,
      rea: refreshExpiresAt,
    };

    const token = this.jwt.sign(payload, {
      secret: this.config.get<string>('Jwt.access.secret'),
      expiresIn: accessExpiresInSec,
    });

    return {
      name: `auth_driver`,
      ttl,
      token,
      payload: {
        driverId: params.driverId,
        sessionId: params.sessionId,
        accessExpiresAt,
        refreshExpiresAt,
      },
    };
  }

  decode(token: string): any {
    try {
      return this.jwt.decode(token);
    } catch {
      return null;
    }
  }


  checkExpiry(token: string): TokenAvailability {
    const decoded: any = this.decode(token);
    if (!decoded) return TokenAvailability.UNAVAILABLE;

    const now = Date.now();

    if (decoded.aea > now) return TokenAvailability.AVAILABLE;

    if (decoded.aea < now && decoded.rea > now)
      return TokenAvailability.EXPIRED;

    return TokenAvailability.UNAVAILABLE;
  }


  verifyAccessToken(token: string): AccessTokenPayload | null {
    const secret = this.config.get<string>('Jwt.access.secret');

    try {
      const verified: any = this.jwt.verify(token, { secret });

      return {
        driverId: verified.did,
        sessionId: verified.sid,
        accessExpiresAt: verified.aea,
        refreshExpiresAt: verified.rea,
      };
    } catch {
      return null;
    }
  }


  verifyRefreshToken(token: string): any {
    const secret = this.config.get<string>('Jwt.refresh.secret');
    try {
      return this.jwt.verify(token, { secret });
    } catch {
      return null;
    }
  }


  revoke() {
    return {
      name: 'auth_driver',
      ttl: 0
    };
  }
}
