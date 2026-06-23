import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StudentExpiryService } from './student-expiry.service';

@Injectable()
export class StudentExpiryScheduler {
  private readonly logger = new Logger(StudentExpiryScheduler.name);

  constructor(private readonly studentExpiryService: StudentExpiryService) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyCheck() {
    this.logger.log('Muddati tugayotgan o\'quvchilar tekshirilmoqda...');
    const result = await this.studentExpiryService.notifyExpiringStudents();
    this.logger.log(`Telegram: ${result.sent} ta yuborildi, ${result.skipped} ta o'tkazib yuborildi`);
  }
}
