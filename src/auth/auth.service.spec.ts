/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SUPABASE_CLIENT } from './supabase-client.provider';
import { SupabaseClient, User, Session } from '@supabase/supabase-js';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = { id: '123', email: 'teste@example.com' } as User;
  const mockSession = {
    access_token: 'token123',
    refresh_token: 'refresh123',
  } as Session;

  const mockAuthClient = {
    signUp: jest.fn().mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    }),
    signInWithPassword: jest.fn().mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    }),
    getUser: jest
      .fn()
      .mockResolvedValue({ data: { user: mockUser }, error: null }),
    signInWithOAuth: jest
      .fn()
      .mockResolvedValue({ data: { url: 'http://redirect.url' }, error: null }),
    resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
    updateUser: jest.fn().mockResolvedValue({ error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
  } as unknown as SupabaseClient['auth'];

  const mockSupabaseClient: Partial<SupabaseClient> = {
    auth: mockAuthClient,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: SUPABASE_CLIENT, useValue: mockSupabaseClient },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user and return user and session', async () => {
    const dto = {
      full_name: 'User Tester',
      email: 'teste@example.com',
      password: '123456',
    };
    const result = await service.register(dto);

    expect(mockAuthClient.signUp).toHaveBeenCalledWith({
      email: dto.email,
      password: dto.password,
      options: { data: { full_name: dto.full_name } },
    });
    expect(result.user!.email).toBe('teste@example.com');
    expect(result.session!.access_token).toBe('token123');
  });

  it('should login a user and return user and session', async () => {
    const dto = { email: 'teste@example.com', password: '123456' };
    const result = await service.login(dto);

    expect(mockAuthClient.signInWithPassword).toHaveBeenCalledWith(dto);
    expect(result.user!.email).toBe('teste@example.com');
    expect(result.session!.access_token).toBe('token123');
  });

  it('should return user from token', async () => {
    const token = 'valid-token';
    const result = await service.getUser(token);

    expect(mockAuthClient.getUser).toHaveBeenCalledWith(token);
    expect(result.email).toBe('teste@example.com');
  });

  it('should return Google OAuth URL', async () => {
    const result = await service.loginWithGoogle();

    expect(mockAuthClient.signInWithOAuth).toHaveBeenCalled();
    expect(result.url).toBe('http://redirect.url');
  });

  it('should request password recovery and return message', async () => {
    const email = 'teste@example.com';
    const result = await service.recoverPassword(email);

    expect(mockAuthClient.resetPasswordForEmail).toHaveBeenCalledWith(email, {
      redirectTo: undefined,
    });
    expect(result).toEqual({
      message: 'Password recovery email sent successfully',
    });
  });

  it('should update password and return message', async () => {
    const dto = { token: 'token123', newPassword: '654321' };
    const result = await service.updatePassword(dto);

    expect(mockAuthClient.updateUser).toHaveBeenCalledWith({
      password: dto.newPassword,
    });
    expect(result).toEqual({ message: 'Password updated successfully' });
  });

  it('should logout and return message', async () => {
    const result = await service.logout();

    expect(mockAuthClient.signOut).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Logout successful' });
  });
});
