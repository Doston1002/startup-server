import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SimAdminGuard, SimAuthGuard, SimAuthRequest } from './sim-auth.guard';

describe('SimAuthGuard', () => {
  type TestRequest = {
    headers: { authorization?: string };
    simUser?: SimAuthRequest['simUser'];
  };

  const createContext = (request: TestRequest) =>
    ({
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext);

  it('rejects requests without a bearer token', async () => {
    const jwtService = { verifyAsync: jest.fn() } as unknown as JwtService;
    const guard = new SimAuthGuard(jwtService);

    await expect(guard.canActivate(createContext({ headers: {} }))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('rejects tokens outside the SIM authentication scope', async () => {
    const jwtService = {
      verifyAsync: jest.fn().mockResolvedValue({
        email: 'director@example.com',
        role: 'direktor',
        scope: 'other',
      }),
    } as unknown as JwtService;
    const guard = new SimAuthGuard(jwtService);
    const request: TestRequest = { headers: { authorization: 'Bearer valid-token' } };

    await expect(guard.canActivate(createContext(request))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('sets the principal from a valid SIM token', async () => {
    const jwtService = {
      verifyAsync: jest.fn().mockResolvedValue({
        email: 'director@example.com',
        role: 'direktor',
        scope: 'sim',
      }),
    } as unknown as JwtService;
    const guard = new SimAuthGuard(jwtService);
    const request: TestRequest = { headers: { authorization: 'Bearer valid-token' } };

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);
    expect(request.simUser).toEqual({ email: 'director@example.com', role: 'direktor' });
  });

  it('does not authorize director tokens for admin-only operations', () => {
    const guard = new SimAdminGuard();
    const request: TestRequest = {
      headers: {},
      simUser: { email: 'director@example.com', role: 'direktor' },
    };
    const context = createContext(request);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
