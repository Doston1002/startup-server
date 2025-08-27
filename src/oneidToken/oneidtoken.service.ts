import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OneIdService {
  constructor(private readonly httpService: HttpService) {}

  // CODE -> TOKEN
  async exchangeCodeForToken(code: string) {
    const params = new URLSearchParams();
    params.append('grant_type', 'one_authorization_code');
    params.append('code', code);
    params.append('client_id', process.env.ONEID_CLIENT_ID!);
    params.append('client_secret', process.env.ONEID_CLIENT_SECRET!);
    params.append('redirect_uri', process.env.ONEID_REDIRECT_URI!);

    const { data } = await this.httpService.axiosRef.post(
      process.env.ONEID_TOKEN_URL!,
      params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    return data; // { access_token, refresh_token, expires_in, ... }
  }

  // TOKEN -> USER INFO
  async getUserInfo(accessToken: string) {
    const params = new URLSearchParams();
    params.append('token', accessToken);

    const { data } = await this.httpService.axiosRef.post(
      process.env.ONEID_USERINFO_URL!,
      params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    return data; // OneID foydalanuvchi ma'lumotlari
  }
}
