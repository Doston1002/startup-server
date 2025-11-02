import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface RecaptchaVerificationResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

@Injectable()
export class RecaptchaService {
  private readonly secretKey: string;
  private readonly verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
  }

  /**
   * reCAPTCHA token ni tekshirish
   * @param token - Frontend dan kelgan reCAPTCHA token
   * @param remoteip - Foydalanuvchi IP manzili (ixtiyoriy)
   * @returns Verification natijasi
   */
  async verifyToken(token: string, remoteip?: string): Promise<boolean> {
    if (!token) {
      throw new BadRequestException('reCAPTCHA token talab qilinadi');
    }

    try {
      const params: any = {
        secret: this.secretKey,
        response: token,
      };
      
      if (remoteip) {
        params.remoteip = remoteip;
      }

      const response = await firstValueFrom(
        this.httpService.post<RecaptchaVerificationResponse>(
          this.verifyUrl,
          params,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      const result = response.data;

      if (!result.success) {
        const errorCodes = result['error-codes'] || [];
        console.error('reCAPTCHA verification failed:', errorCodes);
        throw new BadRequestException(
          `reCAPTCHA tekshiruvi muvaffaqiyatsiz: ${errorCodes.join(', ')}`,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('reCAPTCHA verification error:', error);
      throw new BadRequestException('reCAPTCHA tekshiruvi amalga oshirilmadi');
    }
  }
}

