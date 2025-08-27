import { Controller, Get, Query, Res, Logger } from '@nestjs/common';
import { OneIdService } from './oneid.service';
import { Response } from 'express';

@Controller('oneid')
export class OneIdController {
  private readonly logger = new Logger(OneIdController.name);

  constructor(private readonly oneIdService: OneIdService) {}

  @Get('callback')
  async oneIdCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      if (!code) {
        return res.status(400).send('Code topilmadi');
      }

      // 1) code -> token
      const tokenData = await this.oneIdService.exchangeCodeForToken(code);
      if (!tokenData.access_token) {
        return res.status(400).json({ error: 'Access token olinmadi' });
      }

      // 2) token -> user info
      const userInfo = await this.oneIdService.identifyAccessToken(tokenData.access_token);

      // 3) payload
      const payload = {
        pin: userInfo.pin,
        user_id: userInfo.user_id,
        full_name: userInfo.full_name,
      };

      // 4) JWT yaratish
      const jwt = this.oneIdService.signJwt(payload);

      // 5) Cookie ga yozish
      res.cookie('auth_token', jwt, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      // 6) Frontendga redirect
      return res.redirect('/dashboard');
    } catch (err) {
      this.logger.error('OneID error', err);
      return res.status(500).json({ error: 'OneID bilan ishlashda xatolik' });
    }
  }
}
