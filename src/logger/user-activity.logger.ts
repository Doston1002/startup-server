import { Injectable } from '@nestjs/common';
import { existsSync, appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UserActivityLogger {
  private readonly logDir = '/var/log/users-log';
  private readonly logFile = join(this.logDir, 'users-access.log');

  constructor() {
    // Log papkasini yaratish (agar mavjud bo'lmasa)
    if (!existsSync(this.logDir)) {
      try {
        mkdirSync(this.logDir, { recursive: true, mode: 0o755 });
        console.log(`✅ Log papkasi yaratildi: ${this.logDir}`);
      } catch (error) {
        console.error('❌ Log papkasini yaratishda xatolik:', error);
        console.error('Iltimos, qo\'lda yarating: sudo mkdir -p /var/log/users-log && sudo chmod 755 /var/log/users-log');
      }
    } else {
      console.log(`✅ Log papkasi mavjud: ${this.logDir}`);
    }
  }

  /**
   * Nginx formatidagi log yozish
   * Format: IP - - [DATE] "METHOD URL HTTP_VERSION" STATUS SIZE "REFERER" "USER_AGENT" "EMAIL" "USER_ID" "ACTION"
   * Nginx Combined Log Format: %h %l %u %t "%r" %s %b "%{Referer}i" "%{User-Agent}i"
   */
  logUserActivity(data: {
    ip?: string;
    email?: string;
    userId?: string;
    method?: string;
    url?: string;
    userAgent?: string;
    referer?: string;
    statusCode?: number;
    responseSize?: number;
    action?: string;
    fullName?: string;
    role?: string;
    error?: string;
  }): void {
    try {
      const date = new Date();
      const dateStr = this.formatDate(date);
      const ip = data.ip || '-';
      const userAgent = data.userAgent || '-';
      const referer = data.referer || '-';
      const userId = data.userId || '-';
      const email = data.email || '-';
      const fullName = data.fullName || '-';
      const role = data.role || '-';
      const method = data.method || 'GET';
      const url = data.url || '/';
      const statusCode = data.statusCode || 200;
      const responseSize = data.responseSize || 0;
      const action = data.action || '-';
      const error = data.error || '-';

      // Nginx Combined Log Format + qo'shimcha user ma'lumotlari
      // Format: IP - - [DATE] "METHOD URL HTTP_VERSION" STATUS SIZE "REFERER" "USER_AGENT" "EMAIL" "USER_ID" "FULL_NAME" "ROLE" "ACTION" "ERROR"
      const logLine = `${ip} - - [${dateStr}] "${method} ${url} HTTP/1.1" ${statusCode} ${responseSize} "${referer}" "${userAgent}" "${email}" "${userId}" "${fullName}" "${role}" "${action}" "${error}"\n`;

      appendFileSync(this.logFile, logLine, { encoding: 'utf8', flag: 'a' });
    } catch (error) {
      console.error('Log yozishda xatolik:', error);
    }
  }

  /**
   * Soddalashtirilgan format (auth harakatlar uchun)
   */
  logUserActivitySimple(data: {
    ip?: string;
    email: string;
    action: 'REGISTER' | 'LOGIN' | 'LOGOUT' | string;
    status: 'SUCCESS' | 'FAILED';
    userId?: string;
    error?: string;
    userAgent?: string;
    url?: string;
    method?: string;
    fullName?: string;
    role?: string;
  }): void {
    try {
      const date = new Date();
      const dateStr = this.formatDate(date);
      const ip = data.ip || '-';
      const userId = data.userId || '-';
      const error = data.error || '-';
      const userAgent = data.userAgent || '-';
      const url = data.url || `/api/auth/${data.action.toLowerCase()}`;
      const method = data.method || 'POST';
      const fullName = data.fullName || '-';
      const role = data.role || '-';
      const statusCode = data.status === 'SUCCESS' ? 200 : 400;

      // Nginx formatida log
      const logLine = `${ip} - - [${dateStr}] "${method} ${url} HTTP/1.1" ${statusCode} ${data.email.length} "-" "${userAgent}" "${data.email}" "${userId}" "${fullName}" "${role}" "${data.action}" "${error}"\n`;

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

