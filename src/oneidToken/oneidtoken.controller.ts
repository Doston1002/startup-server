import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { OneIdService } from './oneidtoken.service';

@Controller('OneId')
export class OneIdController {
  constructor(private readonly oneIdService: OneIdService) {}

  @Get('OneIdApi')
  async oneIdCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      // STEP 1: code -> access_token
      const tokenData = await this.oneIdService.exchangeCodeForToken(code);

      if (!tokenData.access_token) {
        return res.status(400).json({ error: 'Access token olinmadi' });
      }

      // STEP 2: token -> user info
      const userInfo = await this.oneIdService.getUserInfo(tokenData.access_token);

      // STEP 3: cookie saqlash (JWT yoki OneID access_token)
      res.cookie('token', tokenData.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });

      // STEP 4: frontendga redirect qilish
      return res.redirect('/dashboard');
    } catch (e) {
      console.error('OneID error:', e);
      return res.status(500).json({ error: e.message });
    }
  }
}
