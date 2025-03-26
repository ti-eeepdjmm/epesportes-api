import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SUPABASE_CLIENT } from './supabase-client.provider';
import { SupabaseClient, User, Session } from '@supabase/supabase-js';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = { id: '123', email: 'teste@example.com' } as User;
  const mockSession = { access_token: 'token123' } as Session;

  const mockAuth = {
    signUp: jest.fn().mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    }),
    signInWithPassword: jest.fn().mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    }),
    getUser: jest.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    }),
    signInWithOAuth: jest.fn().mockResolvedValue({
      data: { url: 'http://redirect.url' },
      error: null,
    }),
  } as unknown as SupabaseClient['auth'];

  const mockSupabaseClient: Partial<SupabaseClient> = {
    auth: mockAuth,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: SUPABASE_CLIENT,
          useValue: mockSupabaseClient,
        },
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

    expect(result.user!.email).toBe('teste@example.com');
    expect(result.session!.access_token).toBe('token123');
  });

  it('should login a user and return session', async () => {
    const dto = { email: 'teste@example.com', password: '123456' };
    const result = await service.login(dto);

    expect(result.user!.email).toBe('teste@example.com');
    expect(result.session!.access_token).toBe('token123');
  });

  it('should return user from token', async () => {
    const result = await service.getUser('valid-token');
    expect(result.email).toBe('teste@example.com');
  });

  it('should return Google OAuth URL', async () => {
    const result = await service.loginWithGoogle();
    expect(result.url).toBe('http://redirect.url');
  });
});
