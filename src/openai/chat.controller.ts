// src/chat/chat.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { OpenAiService } from './openai.service';

@Controller('api/ai')
export class ChatController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {
    return this.openAiService.chat(message);
  }
}
