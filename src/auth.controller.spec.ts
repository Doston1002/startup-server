import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { AuthController } from './auth.controller';
import { DirektorDocument } from './direktor.schema';

describe('AuthController', () => {
  const originalAdminEmail = process.env.ADMIN_EMAIL;
  const originalAdminPassword = process.env.ADMIN_PASSWORD;

  afterEach(() => {
    if (originalAdminEmail === undefined) {
      delete process.env.ADMIN_EMAIL;
    } else {
      process.env.ADMIN_EMAIL = originalAdminEmail;
    }

    if (originalAdminPassword === undefined) {
      delete process.env.ADMIN_PASSWORD;
    } else {
      process.env.ADMIN_PASSWORD = originalAdminPassword;
    }
  });

  it('returns a signed SIM token for the configured admin', async () => {
    process.env.ADMIN_EMAIL = 'admin@example.test';
    process.env.ADMIN_PASSWORD = 'test-admin-password';
    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('signed-token'),
    } as unknown as JwtService;
    const direktorModel = { findOne: jest.fn() } as unknown as Model<DirektorDocument>;
    const controller = new AuthController(direktorModel, jwtService);

    await expect(
      controller.login({ email: 'admin@example.test', password: 'test-admin-password' }),
    ).resolves.toEqual({
      email: 'admin@example.test',
      role: 'admin',
      accessToken: 'signed-token',
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      {
        sub: 'admin@example.test',
        email: 'admin@example.test',
        role: 'admin',
        scope: 'sim',
      },
      { expiresIn: '1h' },
    );
    expect(direktorModel.findOne).not.toHaveBeenCalled();
  });

  it('does not accept an admin login when admin credentials are not configured', async () => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
    const jwtService = {
      signAsync: jest.fn(),
    } as unknown as JwtService;
    const direktorModel = {
      findOne: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      }),
    } as unknown as Model<DirektorDocument>;
    const controller = new AuthController(direktorModel, jwtService);

    await expect(
      controller.login({ email: 'admin@example.test', password: 'test-admin-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });
});
