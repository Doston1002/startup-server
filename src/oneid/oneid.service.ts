import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class OneIdService {
private readonly logger = new Logger(OneIdService.name);


constructor(private readonly jwtService: JwtService) {}


async exchangeCodeForToken(code: string) {
const url = process.env.ONEID_AUTH_URL!; // same endpoint used per OneID docs


const params = new URLSearchParams();
params.append('grant_type', 'one_authorization_code');
params.append('client_id', process.env.ONEID_CLIENT_ID!);
params.append('client_secret', process.env.ONEID_CLIENT_SECRET!);
params.append('redirect_uri', process.env.ONEID_REDIRECT_URI!);
params.append('code', code);


const resp = await axios.post(url, params.toString(), {
headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});


return resp.data; // expected: { access_token, refresh_token, expires_in, token_type, scope }
}


async identifyAccessToken(accessToken: string) {
const url = process.env.ONEID_AUTH_URL!;


const params = new URLSearchParams();
params.append('grant_type', 'one_access_token_identify');
params.append('client_id', process.env.ONEID_CLIENT_ID!);
params.append('client_secret', process.env.ONEID_CLIENT_SECRET!);
params.append('access_token', accessToken);
params.append('scope', process.env.ONEID_SCOPE!);


const resp = await axios.post(url, params.toString(), {
headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});


return resp.data; // expected user info JSON
}


signJwt(payload: any) {
return this.jwtService.sign(payload);
}
}