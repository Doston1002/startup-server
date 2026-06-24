import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
  const secret =
    configService.get<string>('SECRET_JWT') ||
    configService.get<string>('JWT_SECRET');

  if (!secret) {
    throw new Error('SECRET_JWT yoki JWT_SECRET .env faylida topilmadi');
  }

  return { secret };
};
