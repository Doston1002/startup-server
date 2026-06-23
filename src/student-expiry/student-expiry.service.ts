import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from '../student.schema';
import { TelegramService } from '../telegram/telegram.service';
import { getIllnessLabel } from '../utils/illness-labels';
import {
  getStudentPeriodDaysRemaining,
  getStudentPeriodEndIso,
  isStudentPeriodExpiringSoon,
} from '../utils/illness-duration';

@Injectable()
export class StudentExpiryService {
  private readonly logger = new Logger(StudentExpiryService.name);

  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
    private readonly telegramService: TelegramService,
  ) {}

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private formatStudentMessage(student: StudentDocument, daysRemaining: number): string {
    const endDate = getStudentPeriodEndIso(student);
    const educationType = student.educationType === 'inklyuziv' ? 'Inklyuziv ta\'lim' : 'Uyda ta\'lim';
    const statusLine =
      daysRemaining > 0
        ? `⏳ <b>Qolgan vaqt:</b> ${daysRemaining} kun`
        : '❗ <b>Holat:</b> Amal qilish muddati tugagan';

    return [
      '⚠️ <b>Direktor tomonidan qoʻshilgan oʻquvchi</b>',
      '<b>Amal qilish muddati tugashiga 1 oydan kam vaqt qoldi</b>',
      '',
      `👤 <b>F.I.Sh:</b> ${this.escapeHtml(student.fullName)}`,
      `📚 <b>Sinf:</b> ${this.escapeHtml(student.class)}`,
      `🏫 <b>Maktab:</b> ${this.escapeHtml(student.schoolName)}`,
      `🎓 <b>Ta'lim turi:</b> ${educationType}`,
      `📅 <b>O'quv yili:</b> ${this.escapeHtml(student.academicYear)}`,
      `🏥 <b>Kasallik:</b> ${this.escapeHtml(getIllnessLabel(student.illnessType))}`,
      `📋 <b>Xulosa sanasi:</b> ${this.escapeHtml(student.conclusionDate || '—')}`,
      `📆 <b>Muddat tugash:</b> ${this.escapeHtml(endDate || '—')}`,
      statusLine,
      `📞 <b>Telefon:</b> ${this.escapeHtml(student.phone)}`,
      `📍 <b>Manzil:</b> ${this.escapeHtml(student.address)}`,
      student.teacherName ? `👨‍🏫 <b>O'qituvchi:</b> ${this.escapeHtml(student.teacherName)}` : null,
      student.teacherPhone ? `📱 <b>O'qituvchi tel:</b> ${this.escapeHtml(student.teacherPhone)}` : null,
      student.region ? `🗺 <b>Viloyat:</b> ${this.escapeHtml(student.region)}` : null,
      student.districtOrCity ? `🏙 <b>Tuman/Shahar:</b> ${this.escapeHtml(student.districtOrCity)}` : null,
    ]
      .filter(Boolean)
      .join('\n');
  }

  async notifyExpiringStudents(): Promise<{ sent: number; skipped: number }> {
    if (!this.telegramService.isConfigured()) {
      this.logger.warn('Telegram sozlanmagan — xabar yuborilmadi');
      return { sent: 0, skipped: 0 };
    }

    const students = await this.studentModel
      .find({
        createdByRole: 'direktor',
        illnessType: { $exists: true, $nin: ['', null] },
        $or: [
          { conclusionDate: { $exists: true, $nin: ['', null] } },
          { illnessEndDate: { $exists: true, $nin: ['', null] } },
        ],
      })
      .exec();

    let sent = 0;
    let skipped = 0;

    for (const student of students) {
      if (!isStudentPeriodExpiringSoon(student)) {
        skipped += 1;
        continue;
      }

      if (student.telegramExpiryNotifiedAt) {
        skipped += 1;
        continue;
      }

      const daysRemaining = getStudentPeriodDaysRemaining(student) ?? 0;
      const message = this.formatStudentMessage(student, daysRemaining);
      const ok = await this.telegramService.sendMessage(message);

      if (ok) {
        await this.studentModel.updateOne(
          { _id: student._id },
          { telegramExpiryNotifiedAt: new Date().toISOString() },
        );
        sent += 1;
        this.logger.log(`Telegram xabar yuborildi: ${student.fullName}`);
      } else {
        skipped += 1;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return { sent, skipped };
  }

  async checkStudentAfterSave(student: StudentDocument | Student): Promise<void> {
    if (student.createdByRole !== 'direktor') return;
    if (!student.illnessType || !student.conclusionDate) return;
    if (!isStudentPeriodExpiringSoon(student)) return;
    if (student.telegramExpiryNotifiedAt) return;

    const daysRemaining = getStudentPeriodDaysRemaining(student) ?? 0;
    const message = this.formatStudentMessage(student as StudentDocument, daysRemaining);
    const ok = await this.telegramService.sendMessage(message);

    if (ok && (student as any)._id) {
      await this.studentModel.updateOne(
        { _id: (student as any)._id },
        { telegramExpiryNotifiedAt: new Date().toISOString() },
      );
    }
  }
}
