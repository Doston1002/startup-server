import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaService {
  private readonly verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  /**
   * Verify reCAPTCHA token from Google
   * @param token - reCAPTCHA token from client
   * @param remoteIp - Optional client IP address for additional verification
   * @throws BadRequestException if verification fails
   */
  async verifyToken(token: string, remoteIp?: string): Promise<void> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secret) {
      throw new BadRequestException('recaptcha_not_configured');
    }
    
    if (!token || token.trim().length === 0) {
      throw new BadRequestException('recaptcha_token_missing');
    }

    try {
      const params = new URLSearchParams();
      params.append('secret', secret);
      params.append('response', token);
      
      // Add IP address if provided (helps with rate limiting)
      if (remoteIp) {
        params.append('remoteip', remoteIp);
      }

      const { data } = await axios.post(this.verifyUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000, // 10 second timeout
      });

      // Check if verification was successful
      if (!data?.success) {
        const errorCodes = data?.['error-codes'] || [];
        console.error('reCAPTCHA verification failed:', errorCodes);
        throw new BadRequestException('recaptcha_failed');
      }

      // For reCAPTCHA v3: check score (0.0 = bot, 1.0 = human)
      // Score threshold of 0.5 means we accept scores >= 0.5
      if (typeof data.score === 'number' && data.score < 0.5) {
        throw new BadRequestException('recaptcha_score_low');
      }

      // Verification successful
    } catch (error) {
      // If it's already a BadRequestException, re-throw it
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle axios errors
      if (error?.response) {
        console.error('reCAPTCHA API error:', error.response.data);
        throw new BadRequestException('recaptcha_verification_error');
      }

      // Handle network/timeout errors
      if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
        throw new BadRequestException('recaptcha_timeout');
      }

      // Generic error
      console.error('reCAPTCHA verification error:', error);
      throw new BadRequestException('recaptcha_verification_error');
    }
  }
}
