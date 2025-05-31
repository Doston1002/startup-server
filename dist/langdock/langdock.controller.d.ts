import { Response } from 'express';
import { LangdockService } from './langdock.service';
export declare class LangdockController {
    private readonly langdockService;
    constructor(langdockService: LangdockService);
    generateChat(body: {
        messages: any[];
        options?: any;
    }): Promise<any>;
    generateText(body: {
        prompt: string;
        options?: any;
    }): Promise<any>;
    streamChat(body: {
        messages: any[];
        options?: any;
    }, res: Response): Promise<void>;
}
