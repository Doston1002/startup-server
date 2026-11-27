import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export type SimUserRole = 'admin' | 'direktor';

export interface SimPrincipal {
  email: string;
  role: SimUserRole;
}

export interface SimAuthRequest extends Request {
  simUser?: SimPrincipal;
}

interface SimTokenPayload {
  email?: unknown;
  role?: unknown;
  scope?: unknown;
}

@Injectable()
export class SimAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<SimAuthRequest>();
    const authorization = request.headers.authorization;
    const token = typeof authorization === 'string'
      ? /^Bearer\s+(\S+)$/i.exec(authorization)?.[1]
      : undefined;

    if (!token) {
      throw new UnauthorizedException('SIM access token talab qilinadi');
    }

    let payload: SimTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<SimTokenPayload>(token);
    } catch {
      throw new UnauthorizedException('SIM access token yaroqsiz yoki muddati tugagan');
    }

    if (
      payload.scope !== 'sim' ||
      typeof payload.email !== 'string' ||
      !payload.email ||
      (payload.role !== 'admin' && payload.role !== 'direktor')
    ) {
      throw new UnauthorizedException('SIM access token yaroqsiz');
    }

    if (payload.role === 'admin' && payload.email !== process.env.ADMIN_EMAIL) {
      throw new UnauthorizedException('SIM access token yaroqsiz');
    }

    request.simUser = { email: payload.email, role: payload.role };
    return true;
  }
}

@Injectable()
export class SimAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<SimAuthRequest>();
    if (request.simUser?.role !== 'admin') {
      throw new ForbiddenException('Faqat admin ruxsatiga ega');
    }

    return true;
  }
}
