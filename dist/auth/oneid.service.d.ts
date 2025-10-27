import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export interface OneIdUserData {
    valid: string;
    validation_method: string[];
    pin: string;
    user_id: string;
    full_name: string;
    pport_no: string;
    birth_date: string;
    sur_name: string;
    first_name: string;
    mid_name: string;
    user_type: string;
    sess_id: string;
    ret_cd: string;
    auth_method: string;
    pkcs_legal_tin: string;
    legal_info: Array<{
        is_basic: boolean;
        tin: string;
        acron_UZ: string;
        le_tin: string;
        le_name: string;
    }>;
}
export declare class OneIdService {
    private readonly httpService;
    private readonly configService;
    private readonly oneIdBaseUrl;
    private readonly clientId;
    private readonly clientSecret;
    private readonly redirectUri;
    constructor(httpService: HttpService, configService: ConfigService);
    getAccessToken(code: string): Promise<string>;
    getUserInfo(accessToken: string): Promise<OneIdUserData>;
}
