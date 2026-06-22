import { Controller, Get } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Model } from 'mongoose';
import { AppService } from './app.service';
import { Direktor, DirektorDocument } from './direktor.schema';
import { Student, StudentDocument } from './student.schema';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Direktor.name) private readonly direktorModel: Model<DirektorDocument>,
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /** SIM MongoDB ulanishini tekshirish (production debug) */
  @Get('health/sim')
  async simHealth() {
    try {
      const [direktorCount, studentCount] = await Promise.all([
        this.direktorModel.countDocuments().exec(),
        this.studentModel.countDocuments().exec(),
      ]);

      return {
        ok: true,
        mongoReadyState: this.connection.readyState,
        direktorCount,
        studentCount,
      };
    } catch (err: any) {
      return {
        ok: false,
        mongoReadyState: this.connection.readyState,
        error: err?.message || String(err),
      };
    }
  }
}
