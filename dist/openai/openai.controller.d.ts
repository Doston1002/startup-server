import { CreateChatCompletionRequest } from './dto/create-chat-completion.request';
import { OpenaiService } from './openai.service';
export declare class OpenaiController {
    private readonly openaiService;
    constructor(openaiService: OpenaiService);
    createChatCompletion(body: CreateChatCompletionRequest): Promise<import("openai/resources").ChatCompletion & {
        _request_id?: string;
    }>;
}
