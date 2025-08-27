import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OneIdService {
  private readonly logger = new Logger(OneIdService.name);

  constructor(private readonly jwtService: JwtService) {}

  // STEP 1: code -> access_token
  async exchangeCodeForToken(code: string) {
    const params = new URLSearchParams();
    params.append('grant_type', 'one_authorization_code');
    params.append('client_id', process.env.ONEID_CLIENT_ID!);
    params.append('client_secret', process.env.ONEID_CLIENT_SECRET!);
    params.append('redirect_uri', process.env.ONEID_REDIRECT_URI!);
    params.append('code', code);

    const { data } = await axios.post(
      process.env.ONEID_AUTH_URL!, // https://sso.egov.uz/sso/oauth/Authorization.do
      params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    return data; // { access_token, refresh_token, ... }
  }

  // STEP 2: access_token -> user info
  async identifyAccessToken(accessToken: string) {
    const params = new URLSearchParams();
    params.append('grant_type', 'one_access_token_identify');
    params.append('client_id', process.env.ONEID_CLIENT_ID!);
    params.append('client_secret', process.env.ONEID_CLIENT_SECRET!);
    params.append('access_token', accessToken);

    const { data } = await axios.post(
      process.env.ONEID_USERINFO_URL!, // https://sso.egov.uz/sso/oauth/UserInfoByToken.do
      params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    return data; // foydalanuvchi ma’lumotlari
  }

  // STEP 3: JWT yasash
  signJwt(payload: any) {
    return this.jwtService.sign(payload);
  }
}
