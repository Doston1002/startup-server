import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcryptjs';
import { Direktor, DirektorDocument } from './direktor.schema';
import { SimAdminGuard, SimAuthGuard } from './auth/guards/sim-auth.guard';

@Controller('direktors')
@UseGuards(SimAuthGuard, SimAdminGuard)
export class DirektorController {
  constructor(
    @InjectModel(Direktor.name) private direktorModel: Model<DirektorDocument>,
  ) {}

  @Get()
  async findAll() {
    try {
      const direktors = await this.direktorModel.find().exec();
      return direktors.map(direktor => this.toPublicDirektor(direktor));
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
      return this.toPublicDirektor(direktor);
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

      if (payload.password) {
        payload.password = await hash(payload.password, 12);
      }

      const created = new this.direktorModel(payload);
      return this.toPublicDirektor(await created.save());
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
      const payload = { ...updateDirektorDto, role: 'direktor' as const };
      if (payload.password) {
        payload.password = await hash(payload.password, 12);
      }

      const updated = await this.direktorModel
        .findByIdAndUpdate(id, payload, { new: true, runValidators: true })
        .exec();
      if (!updated) {
        throw new HttpException('Direktor topilmadi', HttpStatus.NOT_FOUND);
      }
      return this.toPublicDirektor(updated);
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
      return this.toPublicDirektor(deleted);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error('DELETE /direktors/:id error:', err);
      throw new HttpException("Direktorni o'chirishda xatolik", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private toPublicDirektor(direktor: DirektorDocument) {
    return {
      id: String(direktor._id),
      email: direktor.email,
      role: direktor.role,
      fullName: direktor.fullName,
      schoolName: direktor.schoolName,
      phone: direktor.phone,
      region: direktor.region,
      districtOrCity: direktor.districtOrCity,
      createdAt: direktor.createdAt,
    };
  }
}