import OpenAI from 'openai';
import { ChatCompletionMessageDto } from './dto/create-chat-completion.request';
export declare class OpenaiService {
    private readonly openai;
    constructor(openai: OpenAI);
    createChatCompletion(messages: ChatCompletionMessageDto[]): Promise<OpenAI.Chat.Completions.ChatCompletion & {
        _request_id?: string;
    }>;
}
