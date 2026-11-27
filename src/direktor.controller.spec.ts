import { SimAdminGuard, SimAuthGuard } from './auth/guards/sim-auth.guard';
import { DirektorController } from './direktor.controller';
import { DirektorDocument } from './direktor.schema';
import { Model } from 'mongoose';

describe('DirektorController', () => {
  it('requires authenticated admin access and omits passwords from list responses', async () => {
    const direktorModel = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          {
            _id: 'director-id',
            email: 'director@example.com',
            password: 'stored-hash',
            role: 'direktor',
            fullName: 'Director Name',
            schoolName: 'School',
            phone: '123',
            region: 'Region',
            districtOrCity: 'District',
            createdAt: '2026-01-01',
          },
        ]),
      }),
    };
    const controller = new DirektorController(
      direktorModel as unknown as Model<DirektorDocument>,
    );

    expect(Reflect.getMetadata('__guards__', DirektorController)).toEqual([
      SimAuthGuard,
      SimAdminGuard,
    ]);

    const result = await controller.findAll();
    expect(result).toEqual([
      {
        id: 'director-id',
        email: 'director@example.com',
        role: 'direktor',
        fullName: 'Director Name',
        schoolName: 'School',
        phone: '123',
        region: 'Region',
        districtOrCity: 'District',
        createdAt: '2026-01-01',
      },
    ]);
    expect(result[0]).not.toHaveProperty('password');
  });
});
