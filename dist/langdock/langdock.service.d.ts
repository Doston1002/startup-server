import { ConfigService } from '@nestjs/config';
export declare class LangdockService {
    private configService;
    private readonly logger;
    private readonly apiKey;
    private readonly apiUrl;
    private readonly region;
    constructor(configService: ConfigService);
    generateCompletion(prompt: string, options?: {}): Promise<any>;
    chatCompletion(messages: any[], options?: {}): Promise<any>;
    streamChatCompletion(messages: any[], options?: {}): Promise<any>;
}
