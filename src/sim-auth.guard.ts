import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Direktor, DirektorDocument } from './direktor.schema';

export interface SimPrincipal {
  email: string;
  role: 'admin' | 'direktor';
  schoolName?: string;
  region?: string;
  districtOrCity?: string;
}

interface SimTokenPayload {
  sub?: string;
  email?: string;
  role?: string;
  scope?: string;
}

@Injectable()
export class SimAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Direktor.name) private readonly direktorModel: Model<DirektorDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) throw new UnauthorizedException('Tizimga qayta kiring');

    let payload: SimTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<SimTokenPayload>(token);
    } catch {
      throw new UnauthorizedException('Token yaroqsiz yoki muddati tugagan');
    }

    if (payload.scope !== 'sim' || typeof payload.sub !== 'string') {
      throw new UnauthorizedException('Token yaroqsiz');
    }

    if (payload.role === 'admin') {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail || payload.sub !== adminEmail || payload.email !== adminEmail) {
        throw new UnauthorizedException('Token yaroqsiz');
      }
      request.user = { email: adminEmail, role: 'admin' } as SimPrincipal;
      return true;
    }

    if (payload.role !== 'direktor' || typeof payload.email !== 'string') {
      throw new UnauthorizedException('Token yaroqsiz');
    }

    const direktor = await this.direktorModel.findById(payload.sub).exec();
    if (!direktor || direktor.role !== 'direktor' || direktor.email !== payload.email) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi yoki roli o‘zgargan');
    }

    request.user = {
      email: direktor.email,
      role: 'direktor',
      schoolName: direktor.schoolName,
      region: direktor.region,
      districtOrCity: direktor.districtOrCity,
    } as SimPrincipal;
    return true;
  }
}

@Injectable()
export class SimAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user?.role !== 'admin') {
      throw new ForbiddenException('Faqat admin ushbu amalni bajarishi mumkin');
    }
    return true;
  }
}
