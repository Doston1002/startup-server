import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private resolvedChannelId = '';

  constructor(private readonly configService: ConfigService) {}

  private get botToken(): string {
    return this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '';
  }

  private get configuredChannelId(): string {
    return (
      this.configService.get<string>('TELEGRAM_CHANNEL_ID')?.trim() ||
      this.resolvedChannelId ||
      ''
    );
  }

  private get personalChatIds(): string[] {
    const raw = this.configService.get<string>('TELEGRAM_CHAT_ID') || '';
    return raw
      .split(',')
      .map(id => id.trim())
      .filter(Boolean);
  }

  getDestinations(): { channelId: string; personalChatIds: string[] } {
    return {
      channelId: this.configuredChannelId,
      personalChatIds: this.personalChatIds,
    };
  }

  isConfigured(): boolean {
    return Boolean(this.botToken && (this.configuredChannelId || this.personalChatIds.length > 0));
  }

  isChannelConfigured(): boolean {
    return Boolean(this.botToken && this.configuredChannelId);
  }

  async onModuleInit() {
    if (!this.botToken) return;

    const envChannelId = this.configService.get<string>('TELEGRAM_CHANNEL_ID')?.trim();
    if (envChannelId) return;

    const discovered = await this.discoverChannelIdFromUpdates();
    if (discovered) {
      this.resolvedChannelId = discovered;
      this.logger.log(`Telegram kanal ID topildi (getUpdates): ${discovered}`);
    } else if (!this.personalChatIds.length) {
      this.logger.warn(
        'Telegram kanal ID topilmadi. Botni kanalga admin qilib, kanalga xabar yozing, keyin TELEGRAM_CHANNEL_ID ni .env ga kiriting.',
      );
    }
  }

  async sendMessage(text: string): Promise<boolean> {
    if (!this.botToken) {
      this.logger.warn('TELEGRAM_BOT_TOKEN sozlanmagan');
      return false;
    }

    const { channelId, personalChatIds } = this.getDestinations();
    const targets = [...(channelId ? [channelId] : []), ...personalChatIds.filter(id => id !== channelId)];

    if (!targets.length) {
      this.logger.warn('Telegram kanal yoki chat ID sozlanmagan');
      return false;
    }

    let anySuccess = false;

    for (const chatId of targets) {
      const ok = await this.sendToChat(chatId, text);
      if (ok) {
        anySuccess = true;
        this.logger.log(`Telegram xabar yuborildi: chat_id=${chatId}`);
      }
    }

    return anySuccess;
  }

  private async sendToChat(chatId: string, text: string): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      await axios.post(url, {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
      return true;
    } catch (error: any) {
      const description = error?.response?.data?.description || error?.message;
      this.logger.error(`Telegram xabar yuborilmadi (chat_id=${chatId}): ${description}`);
      return false;
    }
  }

  async getRecentUpdates(): Promise<any> {
    if (!this.botToken) return null;
    const url = `https://api.telegram.org/bot${this.botToken}/getUpdates`;
    const { data } = await axios.get(url, { params: { limit: 50 } });
    return data;
  }

  async discoverChannels(): Promise<
    Array<{ id: string; title: string; type: string; username?: string }>
  > {
    const data = await this.getRecentUpdates();
    if (!data?.result) return [];

    const channels = new Map<string, { id: string; title: string; type: string; username?: string }>();

    for (const update of data.result) {
      const chat =
        update.channel_post?.chat ||
        update.message?.forward_from_chat ||
        update.message?.sender_chat ||
        (update.message?.chat?.type === 'channel' || update.message?.chat?.type === 'supergroup'
          ? update.message.chat
          : null);

      if (!chat?.id) continue;
      if (chat.type !== 'channel' && chat.type !== 'supergroup') continue;

      const id = String(chat.id);
      channels.set(id, {
        id,
        title: chat.title || 'Nomsiz kanal',
        type: chat.type,
        username: chat.username,
      });
    }

    return Array.from(channels.values());
  }

  private async discoverChannelIdFromUpdates(): Promise<string> {
    const channels = await this.discoverChannels();
    return channels[0]?.id || '';
  }
}
