import { Controller, HttpCode, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';


@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('save-pdf')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('pdf'))
  async savePdfFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    return this.fileService.saveFile(file, folder);
  }
}