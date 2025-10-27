import { JwtService } from '@nestjs/jwt';
export declare class OneIdService {
    private readonly jwtService;
    private readonly logger;
    private readonly authUrl;
    constructor(jwtService: JwtService);
    getAuthorizationUrl(state: string): string;
    exchangeCodeForToken(code: string): Promise<any>;
    getUserInfo(accessToken: string): Promise<any>;
    logout(accessToken: string): Promise<any>;
    signJwt(payload: any): string;
}
