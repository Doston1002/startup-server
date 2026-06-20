import { Controller, Get, Post, Body, Param, Delete, Put, Query, BadRequestException, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './student.schema';
import { Direktor, DirektorDocument } from './direktor.schema';

@Controller('students')
export class StudentController {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Direktor.name) private direktorModel: Model<DirektorDocument>,
  ) {}

  // Admin barcha o'quvchilarni ko'radi, direktor faqat o'zini
  @Get()
  async findAll(
    @Query('createdBy') createdBy?: string,
    @Query('role') role?: string,
    @Query('region') region?: string,
    @Query('districtOrCity') districtOrCity?: string,
    @Query('schoolName') schoolName?: string,
  ) {
    const filter: any = {};

    if (role === 'admin') {
      // admin can optionally filter by region/district/school
    } else if (role === 'direktor' && createdBy) {
      // find direktor and scope by their school so direktor sees all students
      // belonging to their school (including those created by admin)
      const direktor = await this.direktorModel.findOne({ email: createdBy }).exec();
      if (!direktor) return [];
      filter.schoolName = direktor.schoolName;
    } else {
      return [];
    }

    if (region) filter.region = region;
    if (districtOrCity) filter.districtOrCity = districtOrCity;
    if (schoolName) filter.schoolName = schoolName;

    return this.studentModel.find(filter).exec();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentModel.findById(id).exec();
  }

  @Post()
  async create(@Body() createStudentDto: Partial<Student>) {
    if (!createStudentDto.createdBy) {
      throw new BadRequestException('createdBy majburiy');
    }

    // Determine role of the creator: admin (from env) or direktor (from DB)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'polatovdoston1002@gmail.com';

    let role: 'admin' | 'direktor' | 'unknown' = 'unknown';
    if (createStudentDto.createdBy === ADMIN_EMAIL) {
      role = 'admin';
    } else {
      const direktor = await this.direktorModel.findOne({ email: createStudentDto.createdBy }).exec();
      if (direktor) {
        role = 'direktor';
        // If the direktor created the student but did not send school/region/district,
        // populate those fields from the direktor record so validation passes.
        if (!createStudentDto.schoolName) createStudentDto.schoolName = direktor.schoolName;
        if (!createStudentDto.region) createStudentDto.region = direktor.region;
        if (!createStudentDto.districtOrCity) createStudentDto.districtOrCity = direktor.districtOrCity;
      }
    }

    if (role === 'unknown') {
      throw new BadRequestException('Yaroqsiz createdBy: foydalanuvchi topilmadi');
    }

    createStudentDto.createdByRole = role;
    if (!createStudentDto.createdAt) createStudentDto.createdAt = new Date().toISOString();

    const created = new this.studentModel(createStudentDto);
    return created.save();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads', 'student-info');
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
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    // debug: log incoming multipart fields and file info
    console.log('[upload] body keys:', Object.keys(body));
    console.log('[upload] body sample:', { illnessType: body.illnessType, conclusionDate: body.conclusionDate });
    console.log('[upload] file:', file ? { originalname: file.originalname, filename: file.filename, mimetype: file.mimetype, size: file.size } : null);
    if (!body.createdBy) {
      throw new BadRequestException('createdBy majburiy');
    }

    // Determine role same as create
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'polatovdoston1002@gmail.com';

    let role: 'admin' | 'direktor' | 'unknown' = 'unknown';
    if (body.createdBy === ADMIN_EMAIL) {
      role = 'admin';
    } else {
      const direktor = await this.direktorModel.findOne({ email: body.createdBy }).exec();
      if (direktor) {
        role = 'direktor';
        if (!body.schoolName) body.schoolName = direktor.schoolName;
        if (!body.region) body.region = direktor.region;
        if (!body.districtOrCity) body.districtOrCity = direktor.districtOrCity;
      }
    }

    if (role === 'unknown') {
      throw new BadRequestException('Yaroqsiz createdBy: foydalanuvchi topilmadi');
    }

    // if admin created but did not provide schoolName, return helpful error
    if (role === 'admin' && !body.schoolName) {
      throw new BadRequestException('Admin foydalanuvchi uchun `schoolName` majburiy');
    }

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
      createdBy: body.createdBy,
      createdByRole: role,
      createdAt: new Date().toISOString(),
    };

    if (file) {
      // expose public URL via ServeStaticModule serveRoot '/uploads'
      const publicUrl = `/uploads/student-info/${file.filename}`;
      createStudentDto.uploadedFiles = [{
        originalname: file.originalname,
        filename: file.filename,
        url: publicUrl,
        mimetype: file.mimetype,
        size: file.size,
      }];
    }

    const created = new this.studentModel(createStudentDto);
    return created.save();
  }

  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const safeName = path.basename(filename);
      const filePath = path.join(process.cwd(), 'uploads', 'student-info', safeName);
      // set CORS and disposition
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
      return res.sendFile(filePath);
    } catch (err) {
      return res.status(404).json({ message: 'File not found' });
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: Partial<Student>) {
    return this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true }).exec();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentModel.findByIdAndDelete(id).exec();
  }
}
