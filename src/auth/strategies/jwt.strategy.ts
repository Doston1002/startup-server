import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from 'src/user/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // ✅ SECURITY FIX: Token muddati tekshiriladi
      secretOrKey: configService.get<string>('SECRET_JWT'),
    });
  }

  async validate(payload: { _id: string; role?: string }) {
    const { _id, role: tokenRole } = payload;
    
    const user = await this.userModel.findById(_id);
    
    if (!user) {
      return null; // User topilmasa, authentication muvaffaqiyatsiz
    }

    // ✅ BLOCK CHECK: Foydalanuvchi bloklangan bo'lsa login qilish mumkin emas
    if (user.isBlocked) {
      return null;
    }

    // ✅ ROLE CHECK: Token dagi rol bilan database dagi rol mos kelishi kerak
    const dbRole = user.role || 'USER';
    const payloadRole = tokenRole || 'USER';
    
    if (payloadRole !== dbRole) {
      // Agar rol o'zgarganda, token invalid bo'ladi
      // Bu xavfsizlik uchun muhim - agar admin user ni USER ga o'zgartirsa, eski token ishlamaydi
      return null;
    }

    return user;
  }
}
