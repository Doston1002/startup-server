// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import axios from 'axios';

// @Injectable()
// export class LangdockService {
//   private readonly logger = new Logger(LangdockService.name);
//   private readonly apiKey: string;
//   private readonly apiUrl: string;

//   constructor(private configService: ConfigService) {
//     this.apiKey = this.configService.get<string>(
//       'sk--wweAYkGmSNM0mRt_yDCVPddHHZKNAGopjwcZI2yCVJSDzUZlVu2XB5NDn3r8_zvVov18HwL53E9MnfWLv6Yjg',
//     );
//     this.apiUrl =
//       this.configService.get<string>('https://api.langdock.com') || 'https://api.langdock.com';
//   }

//   /**
//    * Langdock API orqali matn yaratish
//    */
//   async generateCompletion(prompt: string, options = {}) {
//     try {
//       const response = await axios.post(
//         `${this.apiUrl}/v1/completions`,
//         {
//           model: 'claude-3-sonnet-20240229',
//           prompt,
//           max_tokens: 1000,
//           ...options,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${this.apiKey}`,
//           },
//         },
//       );

//       return response.data;
//     } catch (error) {
//       this.logger.error(`Langdock API xatosi: ${error.message}`);
//       throw error;
//     }
//   }

//   /**
//    * Langdock Assistant API orqali so'rovni yuborish
//    */
//   async queryAssistant(assistantId: string, query: string, options = {}) {
//     try {
//       const response = await axios.post(
//         `${this.apiUrl}/v1/assistants/${assistantId}/query`,
//         {
//           query,
//           ...options,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${this.apiKey}`,
//           },
//         },
//       );

//       return response.data;
//     } catch (error) {
//       this.logger.error(`Langdock Assistant API xatosi: ${error.message}`);
//       throw error;
//     }
//   }
// }

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class LangdockService {
  private readonly logger = new Logger(LangdockService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>(
      'sk--wweAYkGmSNM0mRt_yDCVPddHHZKNAGopjwcZI2yCVJSDzUZlVu2XB5NDn3r8_zvVov18HwL53E9MnfWLv6Yjg',
    );
    this.region = this.configService.get<string>('eu') || 'eu';
    this.apiUrl = `https://api.langdock.com/openai/${this.region}/v1`;
  }

  /**
   * Langdock OpenAI API orqali chat completion yaratish
   */
  async generateCompletion(prompt: string, options = {}) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'gpt-4o-mini', // yoki boshqa model
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          ...options,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Langdock API xatosi: ${error.message}`);
      throw error;
    }
  }

  /**
   * Langdock OpenAI API orqali chat completion yaratish (system message bilan)
   */
  async chatCompletion(messages: any[], options = {}) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'gpt-4o-mini', // yoki boshqa model
          messages,
          ...options,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Langdock API xatosi: ${error.message}`);
      throw error;
    }
  }

  /**
   * Langdock OpenAI API orqali stream chat completion yaratish
   */
  async streamChatCompletion(messages: any[], options = {}) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'gpt-4o-mini', // yoki boshqa model
          messages,
          stream: true,
          ...options,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          responseType: 'stream',
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Langdock API xatosi: ${error.message}`);
      throw error;
    }
  }
}
