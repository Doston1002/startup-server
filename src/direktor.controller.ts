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
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcryptjs';
import { Direktor, DirektorDocument } from './direktor.schema';
import { SimAdminGuard, SimAuthGuard } from './sim-auth.guard';

@Controller('direktors')
@UseGuards(SimAuthGuard, SimAdminGuard)
export class DirektorController {
  constructor(
    @InjectModel(Direktor.name) private direktorModel: Model<DirektorDocument>,
  ) {}

  @Get()
  async findAll() {
    try {
      const directors = await this.direktorModel.find().select('-password').exec();
      return directors.map(direktor => this.withoutPassword(direktor));
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
      return this.withoutPassword(direktor);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error('GET /direktors/:id error:', err);
      throw new HttpException('Direktorni yuklashda xatolik', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() createDirektorDto: Partial<Direktor>) {
    try {
      if (typeof createDirektorDto.password !== 'string' || !createDirektorDto.password) {
        throw new BadRequestException('Direktor paroli majburiy');
      }
      const payload = {
        email: createDirektorDto.email,
        password: await hash(createDirektorDto.password, 12),
        role: 'direktor' as const,
        fullName: createDirektorDto.fullName,
        schoolName: createDirektorDto.schoolName,
        phone: createDirektorDto.phone,
        region: createDirektorDto.region,
        districtOrCity: createDirektorDto.districtOrCity,
        createdAt: new Date().toISOString(),
      };

      const created = new this.direktorModel(payload);
      return this.withoutPassword(await created.save());
    } catch (err: any) {
      if (err instanceof HttpException) throw err;
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
      const update = {
        ...(updateDirektorDto.email !== undefined && { email: updateDirektorDto.email }),
        ...(updateDirektorDto.fullName !== undefined && { fullName: updateDirektorDto.fullName }),
        ...(updateDirektorDto.schoolName !== undefined && { schoolName: updateDirektorDto.schoolName }),
        ...(updateDirektorDto.phone !== undefined && { phone: updateDirektorDto.phone }),
        ...(updateDirektorDto.region !== undefined && { region: updateDirektorDto.region }),
        ...(updateDirektorDto.districtOrCity !== undefined && {
          districtOrCity: updateDirektorDto.districtOrCity,
        }),
        ...(updateDirektorDto.password && {
          password: await hash(updateDirektorDto.password, 12),
        }),
      };
      const updated = await this.direktorModel
        .findByIdAndUpdate(id, update, { new: true, runValidators: true })
        .select('-password')
        .exec();
      if (!updated) {
        throw new HttpException('Direktor topilmadi', HttpStatus.NOT_FOUND);
      }
      return this.withoutPassword(updated);
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
      return this.withoutPassword(deleted);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error('DELETE /direktors/:id error:', err);
      throw new HttpException("Direktorni o'chirishda xatolik", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private withoutPassword(direktor: DirektorDocument) {
    const plain = direktor.toObject();
    delete plain.password;
    return plain;
  }
}
