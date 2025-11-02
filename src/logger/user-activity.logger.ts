import { Injectable } from '@nestjs/common';
import { existsSync, appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UserActivityLogger {
  private readonly logDir = '/var/log/uyda-talim';
  private readonly logFile = join(this.logDir, 'user-activity.log');

  constructor() {
    // Log papkasini yaratish (agar mavjud bo'lmasa)
    if (!existsSync(this.logDir)) {
      try {
        mkdirSync(this.logDir, { recursive: true, mode: 0o755 });
        console.log(`✅ Log papkasi yaratildi: ${this.logDir}`);
      } catch (error) {
        console.error('❌ Log papkasini yaratishda xatolik:', error);
        console.error('Iltimos, qo\'lda yarating: sudo mkdir -p /var/log/uyda-talim && sudo chmod 755 /var/log/uyda-talim');
      }
    } else {
      console.log(`✅ Log papkasi mavjud: ${this.logDir}`);
    }
  }

  /**
   * Nginx formatidagi log yozish
   * Format: IP - - [DATE] "METHOD URL HTTP_VERSION" STATUS SIZE "REFERER" "USER_AGENT" "EMAIL" "ACTION"
   */
  logUserActivity(data: {
    ip?: string;
    email: string;
    action: 'REGISTER' | 'LOGIN' | 'LOGOUT';
    userAgent?: string;
    referer?: string;
    status: number;
    userId?: string;
    fullName?: string;
    role?: string;
  }): void {
    try {
      const date = new Date();
      const dateStr = this.formatDate(date);
      const ip = data.ip || '-';
      const userAgent = data.userAgent || '-';
      const referer = data.referer || '-';
      const userId = data.userId || '-';
      const fullName = data.fullName || '-';
      const role = data.role || '-';

      // Nginx o'xshash format
      const logLine = `${ip} - - [${dateStr}] "${data.action} /api/auth/${data.action.toLowerCase()} HTTP/1.1" ${data.status} ${data.email.length} "${referer}" "${userAgent}" "EMAIL:${data.email}" "USER_ID:${userId}" "FULL_NAME:${fullName}" "ROLE:${role}" "ACTION:${data.action}"\n`;

      appendFileSync(this.logFile, logLine, { encoding: 'utf8', flag: 'a' });
    } catch (error) {
      console.error('Log yozishda xatolik:', error);
    }
  }

  /**
   * Soddalashtirilgan format (keyingi o'zgartirishlar uchun)
   */
  logUserActivitySimple(data: {
    ip?: string;
    email: string;
    action: 'REGISTER' | 'LOGIN' | 'LOGOUT';
    status: 'SUCCESS' | 'FAILED';
    userId?: string;
    error?: string;
  }): void {
    try {
      const date = new Date().toISOString();
      const ip = data.ip || '-';
      const userId = data.userId || '-';
      const error = data.error || '-';

      const logLine = `[${date}] ${data.action} | IP: ${ip} | EMAIL: ${data.email} | USER_ID: ${userId} | STATUS: ${data.status} | ERROR: ${error}\n`;

      appendFileSync(this.logFile, logLine, { encoding: 'utf8', flag: 'a' });
    } catch (error) {
      console.error('Log yozishda xatolik:', error);
    }
  }

  /**
   * Nginx date formatiga o'girish
   * Format: 02/Nov/2025:14:30:45 +0500
   */
  private formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Timezone offset
    const offset = -date.getTimezoneOffset();
    const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
    const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0');
    const offsetSign = offset >= 0 ? '+' : '-';
    
    return `${day}/${month}/${year}:${hours}:${minutes}:${seconds} ${offsetSign}${offsetHours}${offsetMinutes}`;
  }
}

