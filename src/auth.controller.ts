import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { timingSafeEqual } from 'crypto';
import { Direktor, DirektorDocument } from './direktor.schema';

interface LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel(Direktor.name) private direktorModel: Model<DirektorDocument>,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && body.email === adminEmail) {
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword) {
        throw new InternalServerErrorException('Admin login serverda sozlanmagan');
      }
      if (this.constantTimeEqual(body.password, adminPassword)) {
        return this.createLoginResponse(adminEmail, 'admin');
      }
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    const direktor = await this.direktorModel
      .findOne({ email: body.email })
      .select('+password')
      .exec();
    if (direktor && await this.verifyDirektorPassword(body.password, direktor.password)) {
      if (!direktor.password.startsWith('$2')) {
        direktor.password = await hash(body.password, 12);
        await direktor.save();
      }
      return this.createLoginResponse(direktor.email, 'direktor', String(direktor._id));
    }

    throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
  }

  private async verifyDirektorPassword(password: string, storedPassword: string): Promise<boolean> {
    if (/^\$2[aby]\$/.test(storedPassword)) {
      return compare(password, storedPassword);
    }
    return this.constantTimeEqual(password, storedPassword);
  }

  private constantTimeEqual(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
  }

  private async createLoginResponse(email: string, role: 'admin' | 'direktor', id = email) {
    const accessToken = await this.jwtService.signAsync(
      { sub: id, email, role, scope: 'sim' },
      { expiresIn: '1h' },
    );
    return { email, role, accessToken };
  }
}
