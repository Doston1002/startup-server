import { Injectable } from '@nestjs/common';

/**
 * Token Blacklist Service
 * Logout qilganda tokenlarni invalid qilish uchun
 * In-memory storage (production da Redis ishlatish tavsiya etiladi)
 */
@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens: Set<string> = new Set();

  /**
   * Token ni blacklist ga qo'shish
   * @param token - JWT token
   * @param expiresIn - Token expire bo'lish vaqti (seconds)
   */
  addToBlacklist(token: string, expiresIn: number): void {
    this.blacklistedTokens.add(token);

    // Token expire bo'lgandan keyin avtomatik o'chirish
    // Bu xotira tejash uchun
    setTimeout(() => {
      this.blacklistedTokens.delete(token);
    }, expiresIn * 1000); // milliseconds ga o'tkazish
  }

  /**
   * Token blacklist da bor-yo'qligini tekshirish
   * @param token - JWT token
   * @returns true agar token blacklist da bo'lsa
   */
  isBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  /**
   * Token ni blacklist dan olib tashlash (kerak bo'lsa)
   * @param token - JWT token
   */
  removeFromBlacklist(token: string): void {
    this.blacklistedTokens.delete(token);
  }

  /**
   * Blacklist ni tozalash (test yoki admin uchun)
   */
  clearBlacklist(): void {
    this.blacklistedTokens.clear();
  }

  /**
   * Blacklist hajmini olish (monitoring uchun)
   */
  getBlacklistSize(): number {
    return this.blacklistedTokens.size;
  }
}

