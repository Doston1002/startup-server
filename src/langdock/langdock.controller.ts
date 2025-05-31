import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { LangdockService } from './langdock.service';

@Controller('langdock')
export class LangdockController {
  constructor(private readonly langdockService: LangdockService) {}

  @Post('chat')
  async generateChat(@Body() body: { messages: any[]; options?: any }) {
    const { messages, options } = body;
    return this.langdockService.chatCompletion(messages, options);
  }

  @Post('completion')
  async generateText(@Body() body: { prompt: string; options?: any }) {
    const { prompt, options } = body;
    return this.langdockService.generateCompletion(prompt, options);
  }

  @Post('stream')
  async streamChat(@Body() body: { messages: any[]; options?: any }, @Res() res: Response) {
    const { messages, options } = body;

    try {
      const stream = await this.langdockService.streamChatCompletion(messages, options);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      stream.on('data', chunk => {
        const lines = chunk
          .toString()
          .split('\n')
          .filter(line => line.trim() !== '');
        for (const line of lines) {
          if (line.includes('[DONE]')) {
            res.write('data: [DONE]\n\n');
          } else if (line.startsWith('data: ')) {
            res.write(`${line}\n\n`);
          }
        }
      });

      stream.on('end', () => {
        res.end();
      });

      stream.on('error', error => {
        console.error('Stream error:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}
