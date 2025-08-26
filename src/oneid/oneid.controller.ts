import { Controller, Get, Query, Res, Logger } from '@nestjs/common';
import { OneIdService } from './oneid.service';
import { Response } from 'express';


@Controller('/OneId')
export class OneIdController {
private readonly logger = new Logger(OneIdController.name);
constructor(private readonly oneIdService: OneIdService) {}


// Bu siz bergan redirect uri: /api/OneId/OneIdApi
@Get('OneIdApi')
async oneIdCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
try {
if (!code) {
return res.status(400).send('Code yo\'q');
}


// 1) Code -> access_token
const tokenData = await this.oneIdService.exchangeCodeForToken(code);
const accessToken = tokenData.access_token;


// 2) access_token -> user info
const userInfo = await this.oneIdService.identifyAccessToken(accessToken);


// 3) Bu yerda siz DB ga yozish / tekshirish qilasiz.
// Misol uchun minimal payload:
const payload = {
pin: userInfo.pin,
user_id: userInfo.user_id,
full_name: userInfo.full_name,
};


// 4) JWT yaratish
const jwt = this.oneIdService.signJwt(payload);


// 5) Cookiega joylash (httpOnly): frontendga yuborish
res.cookie('auth_token', jwt, {
httpOnly: true,
secure: true, // HTTPS bo'lsa true
sameSite: 'lax',
maxAge: 24 * 60 * 60 * 1000,
});


// 6) Redirect qilamiz (frontenddagi dashboard yoki kerakli sahifa)
return res.redirect('/dashboard');
} catch (err) {
this.logger.error(err);
return res.status(500).send('OneID bilan ishlashda xatolik');
}
}
}