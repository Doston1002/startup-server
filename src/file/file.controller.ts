import { BadRequestException, Controller, HttpCode, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('save')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('image', {
      // ✅ SECURITY FIX: File type validation - faqat rasmlar
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Faqat rasm fayllar ruxsat etilgan (jpg, jpeg, png, gif, webp)'),
            false
          );
        }
        cb(null, true);
      },
      // ✅ SECURITY FIX: File size limit - max 5MB
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    })
  )
  async saveFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    if (!file) {
      throw new BadRequestException('Fayl yuklanmadi');
    }
    return this.fileService.saveFile(file, folder);
  }

  @Post('save-pdf')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('pdf', {
      // ✅ SECURITY FIX: File type validation - faqat PDF
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(
            new BadRequestException('Faqat PDF fayllar ruxsat etilgan'),
            false
          );
        }
        cb(null, true);
      },
      // ✅ SECURITY FIX: File size limit - max 10MB for PDF
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    })
  )
  async savePdfFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    if (!file) {
      throw new BadRequestException('Fayl yuklanmadi');
    }
    return this.fileService.saveFile(file, folder);
  }
}
