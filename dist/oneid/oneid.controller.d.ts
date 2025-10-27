import { Response } from 'express';
import { OneIdService } from './oneid.service';
export declare class OneIdController {
    private readonly oneIdService;
    private readonly logger;
    constructor(oneIdService: OneIdService);
    getLoginUrl(state: string): {
        url: string;
    };
    callback(code: string, state: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    userInfo(accessToken: string): Promise<any>;
    logout(accessToken: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
