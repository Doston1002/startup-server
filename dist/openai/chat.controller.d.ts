import { OpenAiService } from './openai.service';
export declare class ChatController {
    private readonly openAiService;
    constructor(openAiService: OpenAiService);
    chat(message: string): Promise<string>;
}
