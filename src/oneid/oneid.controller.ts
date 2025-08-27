import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { OneIdService } from './oneid.service';
import { Response } from 'express';

@Controller('api/oneid')
export class OneIdController {
  private readonly logger = new Logger(OneIdController.name);

  constructor(private readonly oneIdService: OneIdService) {}

  @Post('login')
  async oneIdLogin(@Body('code') code: string, @Body('state') state: string, @Res() res: Response) {
    try {
      if (!code) {
        return res.status(400).json({ error: 'Code topilmadi' });
      }

      // 1) code → token
      const tokenData = await this.oneIdService.exchangeCodeForToken(code);
      if (!tokenData.access_token) {
        return res.status(400).json({ error: 'Access token olinmadi' });
      }

      // 2) token → user info
      const userInfo = await this.oneIdService.identifyAccessToken(tokenData.access_token);

      // 3) JWT payload
      const payload = {
        pin: userInfo.pin,
        user_id: userInfo.user_id,
        full_name: userInfo.full_name,
      };

      // 4) JWT yasash
      const jwt = this.oneIdService.signJwt(payload);

      // 5) Cookie ga yozish
      res.cookie('auth_token', jwt, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 kun
      });

      // 6) Frontendga javob
      return res.json({
        success: true,
        message: 'Login muvaffaqiyatli',
        user: payload,
      });
    } catch (err) {
      this.logger.error('OneID login error', err);
      return res.status(500).json({ error: 'OneID bilan ishlashda xatolik' });
    }
  }
}
