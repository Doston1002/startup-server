jest.mock('@nestjs/jwt', () => ({
  JwtService: class JwtService {},
}));

import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Direktor, DirektorDocument } from './direktor.schema';
import { SimAdminGuard, SimAuthGuard } from './sim-auth.guard';

describe('SimAuthGuard', () => {
  const director = {
    email: 'director@example.com',
    role: 'direktor',
    schoolName: 'School 12',
    region: 'Region',
    districtOrCity: 'District',
  };
  const request: any = {
    headers: { authorization: 'Bearer signed-token' },
    query: { role: 'admin' },
  };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as ExecutionContext;

  beforeEach(() => {
    request.user = undefined;
  });

  it('rejects requests without a bearer token', async () => {
    request.headers = {};
    const guard = new SimAuthGuard(
      {} as JwtService,
      {} as Model<DirektorDocument>,
    );

    await expect(guard.canActivate(context)).rejects.toThrow('Tizimga qayta kiring');
  });

  it('derives director authority from the verified identity, not query parameters', async () => {
    request.headers = { authorization: 'Bearer signed-token' };
    const jwtService = {
      verifyAsync: jest.fn().mockResolvedValue({
        sub: 'director-id',
        email: director.email,
        role: 'direktor',
        scope: 'sim',
      }),
    };
    const direktorModel = {
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(director),
      }),
    };
    const guard = new SimAuthGuard(
      jwtService as unknown as JwtService,
      direktorModel as unknown as Model<DirektorDocument>,
    );

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual(director);
    expect(request.user.role).toBe('direktor');
  });

  it('does not grant directors administrator-only access', () => {
    request.user = { email: director.email, role: 'direktor' };
    expect(() => new SimAdminGuard().canActivate(context)).toThrow(
      'Faqat admin ushbu amalni bajarishi mumkin',
    );
  });
});
