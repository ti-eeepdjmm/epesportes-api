/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SUPABASE_CLIENT } from './supabase-client.provider';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue({
      user: { email: 'teste@example.com' },
      session: { access_token: 'token123', refresh_token: 'refresh123' },
    }),
    login: jest.fn().mockResolvedValue({
      user: { email: 'teste@example.com' },
      session: { access_token: 'token123', refresh_token: 'refresh123' },
    }),
    loginWithGoogle: jest
      .fn()
      .mockResolvedValue({ url: 'http://redirect.url' }),
    recoverPassword: jest
      .fn()
      .mockResolvedValue({ message: 'Recovery email sent' }),
    updatePassword: jest
      .fn()
      .mockResolvedValue({ message: 'Password updated' }),
    logout: jest.fn().mockResolvedValue({ message: 'Logout successful' }),
  };

  const mockSupabaseClient = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SUPABASE_CLIENT, useValue: mockSupabaseClient },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const dto = {
      full_name: 'User Test',
      email: 'teste@example.com',
      password: '123456',
    };
    const result = await controller.register(dto);
    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    expect((result as any).session.access_token).toBe('token123');
  });

  it('should login a user and set headers', async () => {
    const dto = { email: 'teste@example.com', password: '123456' };
    const headers: Record<string, string> = {};
    const mockRes: any = {
      setHeader: (key: string, value: string) => {
        headers[key] = value;
      },
    };

    const result = await controller.login(dto, mockRes);

    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    expect(headers['Authorization']).toBe('Bearer token123');
    expect(headers['x-refresh-token']).toBe('refresh123');
    expect(result.user!.email).toBe('teste@example.com');
  });

  it('should return login URL for Google', async () => {
    const result = await controller.loginGoogle();
    expect(mockAuthService.loginWithGoogle).toHaveBeenCalled();
    expect(result).toEqual({ url: 'http://redirect.url' });
  });

  it('should get profile when user is set', () => {
    const mockReq: any = { user: { email: 'teste@example.com' } };
    expect(controller.getProfile(mockReq)).toEqual({
      email: 'teste@example.com',
    });
  });

  it('should throw on getProfile when no user', () => {
    const mockReq: any = {};
    expect(() => controller.getProfile(mockReq)).toThrow(UnauthorizedException);
  });

  it('should recover password', async () => {
    const dto = { email: 'teste@example.com' };
    const result = await controller.recoverPassword(dto);
    expect(mockAuthService.recoverPassword).toHaveBeenCalledWith(dto.email);
    expect(result).toEqual({ message: 'Recovery email sent' });
  });

  it('should update password', async () => {
    const dto = {
      token: 'dummy-token',
      currentPassword: '123456',
      newPassword: '654321',
    };
    const mockReq: any = { user: { email: 'teste@example.com' } };
    const result = await controller.updatePassword(mockReq, dto);
    expect(mockAuthService.updatePassword).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ message: 'Password updated' });
  });

  it('should logout', async () => {
    const result = await controller.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Logout successful' });
  });
});
