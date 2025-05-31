import { ConfigService } from '@nestjs/config';
export declare class OpenAiService {
    private configService;
    private openai;
    constructor(configService: ConfigService);
    chat(prompt: string): Promise<string>;
}
