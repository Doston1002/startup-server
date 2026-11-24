import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { Request, Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './student.schema';
import { StudentExpiryService } from './student-expiry/student-expiry.service';
import { TelegramService } from './telegram/telegram.service';
import { SimAdminGuard, SimAuthGuard, SimPrincipal } from './sim-auth.guard';

@Controller('students')
@UseGuards(SimAuthGuard)
export class StudentController {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    private readonly studentExpiryService: StudentExpiryService,
    private readonly telegramService: TelegramService,
  ) {}

  @Get()
  async findAll(
    @Req() req: Request & { user: SimPrincipal },
    @Query('region') region?: string,
    @Query('districtOrCity') districtOrCity?: string,
    @Query('schoolName') schoolName?: string,
  ) {
    const filter: Record<string, string> = {};
    if (region) filter.region = region;
    if (districtOrCity) filter.districtOrCity = districtOrCity;
    if (req.user.role === 'admin') {
      if (schoolName) filter.schoolName = schoolName;
    } else {
      filter.schoolName = req.user.schoolName;
    }

    try {
      return await this.studentModel.find(filter).exec();
    } catch (err) {
      console.error('GET /students error:', err);
      throw new BadRequestException("O'quvchilarni yuklashda xatolik");
    }
  }

  @Get('telegram/status')
  @UseGuards(SimAdminGuard)
  async telegramStatus() {
    const destinations = this.telegramService.getDestinations();
    const channels = await this.telegramService.discoverChannels();

    return {
      configured: this.telegramService.isConfigured(),
      channelConfigured: this.telegramService.isChannelConfigured(),
      channelLink: process.env.TELEGRAM_CHANNEL_LINK || '',
      destinations,
      discoveredChannels: channels,
      setup:
        channels.length > 0
          ? `Topilgan kanal ID ni .env ga yozing: TELEGRAM_CHANNEL_ID=${channels[0].id}`
          : 'Botni kanalga admin qiling, kanalga xabar yozing, keyin /api/students/telegram/discover-channels ni chaqiring',
    };
  }

  @Get('telegram/discover-channels')
  @UseGuards(SimAdminGuard)
  async discoverTelegramChannels() {
    const channels = await this.telegramService.discoverChannels();
    return {
      channels,
      hint:
        channels.length > 0
          ? `.env faylida TELEGRAM_CHANNEL_ID=${channels[0].id} qilib serverni qayta ishga tushiring`
          : 'Botni kanalga admin qiling va kanalga biror xabar yozing, so\'ng qayta urinib ko\'ring',
    };
  }

  @Post('telegram/test')
  @UseGuards(SimAdminGuard)
  async testTelegram() {
    const ok = await this.telegramService.sendMessage(
      '✅ <b>Test xabar</b>\n\nUyda ta\'lim tizimi Telegram kanaliga muvaffaqiyatli ulandi.',
    );
    return { success: ok, destinations: this.telegramService.getDestinations() };
  }

  @Post('telegram/notify-expiring')
  @UseGuards(SimAdminGuard)
  async notifyExpiringStudents() {
    const result = await this.studentExpiryService.notifyExpiringStudents();
    return {
      message: 'Tekshiruv yakunlandi',
      ...result,
    };
  }

  @Get('telegram/updates')
  @UseGuards(SimAdminGuard)
  async telegramUpdates() {
    return this.telegramService.getRecentUpdates();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request & { user: SimPrincipal }) {
    return this.findAuthorizedStudent(id, req.user);
  }

  @Post()
  async create(
    @Body() createStudentDto: Partial<Student>,
    @Req() req: Request & { user: SimPrincipal },
  ) {
    if (req.user.role === 'direktor') createStudentDto.schoolName = req.user.schoolName;
    createStudentDto.createdBy = req.user.email;
    createStudentDto.createdByRole = req.user.role;
    createStudentDto.createdAt = new Date().toISOString();

    const created = new this.studentModel(createStudentDto);
    const saved = await created.save();
    void this.studentExpiryService.checkStudentAfterSave(saved);
    return saved;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'private-uploads', 'student-info');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
            filename: (req, file, cb) => {
              const safe = file.originalname.replace(/[^a-zA-Z0-9.\-\_]/g, '_');
              const now = new Date();
              const pad = (n: number) => n.toString().padStart(2, '0');
              const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
              const unique = Math.round(Math.random() * 1e9);
              const filename = `${ts}-${unique}-${safe}`;
              cb(null, filename);
      },
    }),
  }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: Request & { user: SimPrincipal },
  ) {
    if (req.user.role === 'admin' && !body.schoolName) {
      throw new BadRequestException('Admin foydalanuvchi uchun `schoolName` majburiy');
    }
    if (req.user.role === 'direktor') body.schoolName = req.user.schoolName;

    const createStudentDto: any = {
      fullName: body.fullName,
      birthDate: body.birthDate,
      class: body.class,
      schoolName: body.schoolName,
      region: body.region,
      districtOrCity: body.districtOrCity,
      phone: body.phone,
      address: body.address,
      academicYear: body.academicYear,
      notes: body.notes,
      accommodations: body.accommodations,
      educationType: body.educationType,
      teacherName: body.teacherName,
      teacherPhone: body.teacherPhone,
      illnessType: body.illnessType,
      conclusionDate: body.conclusionDate,
      illnessEndDate: body.illnessEndDate,
      illnessEndDateMax: body.illnessEndDateMax,
      createdBy: req.user.email,
      createdByRole: req.user.role,
      createdAt: new Date().toISOString(),
    };

    if (file) {
      const publicUrl = `/api/students/download/${file.filename}`;
      createStudentDto.uploadedFiles = [{
        originalname: file.originalname,
        filename: file.filename,
        url: publicUrl,
        mimetype: file.mimetype,
        size: file.size,
      }];
    }

    const created = new this.studentModel(createStudentDto);
    const saved = await created.save();
    void this.studentExpiryService.checkStudentAfterSave(saved);
    return saved;
  }

  @Get('download/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Req() req: Request & { user: SimPrincipal },
    @Res() res: Response,
  ) {
    const safeName = path.basename(filename);
    const student = await this.studentModel.findOne({ 'uploadedFiles.filename': safeName }).exec();
    if (!student) throw new NotFoundException('Fayl topilmadi');
    this.assertStudentAccess(student, req.user);
    const privateFilePath = path.join(process.cwd(), 'private-uploads', 'student-info', safeName);
    const legacyFilePath = path.join(process.cwd(), 'uploads', 'student-info', safeName);
    const filePath = fs.existsSync(privateFilePath) ? privateFilePath : legacyFilePath;
    res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
    return res.sendFile(filePath);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: Partial<Student>,
    @Req() req: Request & { user: SimPrincipal },
  ) {
    const existing = await this.findAuthorizedStudent(id, req.user);
    const { createdBy, createdAt, createdByRole, ...safeUpdate } = updateStudentDto as any;
    if (req.user.role === 'direktor') safeUpdate.schoolName = existing.schoolName;

    if (
      safeUpdate.conclusionDate !== undefined ||
      safeUpdate.illnessType !== undefined ||
      safeUpdate.illnessEndDate !== undefined ||
      safeUpdate.illnessEndDateMax !== undefined
    ) {
      safeUpdate.telegramExpiryNotifiedAt = null;
    }

    const saved = await this.studentModel.findByIdAndUpdate(id, safeUpdate, { new: true }).exec();
    if (saved) void this.studentExpiryService.checkStudentAfterSave(saved);
    return saved;
  }

  @Put(':id/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'private-uploads', 'student-info');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const safe = file.originalname.replace(/[^a-zA-Z0-9.\-\_]/g, '_');
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
        const unique = Math.round(Math.random() * 1e9);
        cb(null, `${ts}-${unique}-${safe}`);
      },
    }),
  }))
  async updateWithUpload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: Request & { user: SimPrincipal },
  ) {
    const existing = await this.findAuthorizedStudent(id, req.user);

    const update: any = {
      fullName: body.fullName,
      birthDate: body.birthDate,
      class: body.class,
      phone: body.phone,
      address: body.address,
      academicYear: body.academicYear,
      notes: body.notes,
      accommodations: body.accommodations,
      educationType: body.educationType,
      teacherName: body.teacherName,
      teacherPhone: body.teacherPhone,
      illnessType: body.illnessType,
      conclusionDate: body.conclusionDate,
      illnessEndDate: body.illnessEndDate,
      illnessEndDateMax: body.illnessEndDateMax,
      region: body.region,
      districtOrCity: body.districtOrCity,
      telegramExpiryNotifiedAt: null,
    };

    if (file) {
      const publicUrl = `/api/students/download/${file.filename}`;
      update.uploadedFiles = [
        ...(existing.uploadedFiles || []),
        {
          originalname: file.originalname,
          filename: file.filename,
          url: publicUrl,
          mimetype: file.mimetype,
          size: file.size,
        },
      ];
    }

    const saved = await this.studentModel.findByIdAndUpdate(id, update, { new: true }).exec();
    if (saved) void this.studentExpiryService.checkStudentAfterSave(saved);
    return saved;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request & { user: SimPrincipal }) {
    await this.findAuthorizedStudent(id, req.user);
    return this.studentModel.findByIdAndDelete(id).exec();
  }

  private async findAuthorizedStudent(id: string, user: SimPrincipal) {
    const student = await this.studentModel.findById(id).exec();
    if (!student) throw new NotFoundException('O‘quvchi topilmadi');
    this.assertStudentAccess(student, user);
    return student;
  }

  private assertStudentAccess(student: StudentDocument, user: SimPrincipal) {
    if (user.role === 'direktor' && student.schoolName !== user.schoolName) {
      throw new ForbiddenException('Ushbu o‘quvchi ma’lumotlariga ruxsat yo‘q');
    }
  }
}
