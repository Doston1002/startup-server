import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Direktor, DirektorDocument } from './direktor.schema';

@Controller('direktors')
export class DirektorController {
  constructor(
    @InjectModel(Direktor.name) private direktorModel: Model<DirektorDocument>,
  ) {}

  @Get()
  async findAll(@Query('role') role?: string) {
    if (role !== 'admin') {
      throw new HttpException(
        'Faqat admin barcha direktorlarni ko‘ra oladi',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      return await this.direktorModel.find().exec();
    } catch (err) {
      console.error('GET /direktors error:', err);
      throw new HttpException('Direktorlarni yuklashda xatolik', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const direktor = await this.direktorModel.findById(id).exec();
      if (!direktor) {
        throw new HttpException('Direktor topilmadi', HttpStatus.NOT_FOUND);
      }
      return direktor;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error('GET /direktors/:id error:', err);
      throw new HttpException('Direktorni yuklashda xatolik', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() createDirektorDto: Partial<Direktor>) {
    try {
      const payload = {
        ...createDirektorDto,
        role: 'direktor' as const,
        createdAt: createDirektorDto.createdAt || new Date().toISOString(),
      };

      const created = new this.direktorModel(payload);
      return await created.save();
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new HttpException('Bu email allaqachon ro‘yxatdan o‘tgan', HttpStatus.CONFLICT);
      }
      console.error('POST /direktors error:', err);
      throw new HttpException(
        err?.message || 'Direktor yaratishda xatolik',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDirektorDto: Partial<Direktor>) {
    try {
      const updated = await this.direktorModel
        .findByIdAndUpdate(id, updateDirektorDto, { new: true })
        .exec();
      if (!updated) {
        throw new HttpException('Direktor topilmadi', HttpStatus.NOT_FOUND);
      }
      return updated;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error('PUT /direktors/:id error:', err);
      throw new HttpException('Direktorni yangilashda xatolik', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.direktorModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new HttpException('Direktor topilmadi', HttpStatus.NOT_FOUND);
      }
      return deleted;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error('DELETE /direktors/:id error:', err);
      throw new HttpException("Direktorni o'chirishda xatolik", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
