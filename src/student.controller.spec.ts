import { SimAuthGuard, SimAuthRequest } from './auth/guards/sim-auth.guard';
import { StudentController } from './student.controller';
import { StudentDocument } from './student.schema';
import { DirektorDocument } from './direktor.schema';
import { StudentExpiryService } from './student-expiry/student-expiry.service';
import { TelegramService } from './telegram/telegram.service';
import { Model } from 'mongoose';

describe('StudentController', () => {
  it('requires SIM authentication and keeps director reads within their school', async () => {
    const studentModel = {
      find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    };
    const direktorModel = {
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ schoolName: 'Verified school' }),
      }),
    };
    const controller = new StudentController(
      studentModel as unknown as Model<StudentDocument>,
      direktorModel as unknown as Model<DirektorDocument>,
      {} as unknown as StudentExpiryService,
      {} as unknown as TelegramService,
    );
    const request = {
      simUser: { email: 'director@example.com', role: 'direktor' as const },
    } as unknown as SimAuthRequest;

    const guards = Reflect.getMetadata('__guards__', StudentController.prototype.findAll);
    expect(guards).toContain(SimAuthGuard);

    await controller.findAll(request, 'Toshkent', undefined, 'Attacker school');

    expect(direktorModel.findOne).toHaveBeenCalledWith({ email: 'director@example.com' });
    expect(studentModel.find).toHaveBeenCalledWith({
      schoolName: 'Verified school',
      region: 'Toshkent',
    });
  });
});
