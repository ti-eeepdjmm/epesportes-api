import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SUPABASE_CLIENT } from './supabase-client.provider';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue({
      user: { email: 'teste@example.com' },
      session: { access_token: 'token123' },
    }),
    login: jest.fn().mockResolvedValue({
      user: { email: 'teste@example.com' },
      session: { access_token: 'token123' },
    }),
    getUser: jest.fn().mockResolvedValue({
      email: 'teste@example.com',
    }),
    loginWithGoogle: jest.fn().mockResolvedValue({
      url: 'http://redirect.url',
    }),
  };

  // Se o controller não usar diretamente o SupabaseClient, podemos definir um mock vazio para ele.
  const mockSupabaseClient = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: SUPABASE_CLIENT,
          useValue: mockSupabaseClient,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const registerDto = {
      full_name: 'User Test',
      email: 'teste@example.com',
      password: '123456',
    };
    const result = (await controller.register(registerDto)) as {
      session: { access_token: string };
    };
    expect(result).toHaveProperty('session');
    expect(result.session.access_token).toBe('token123');
  });

  it('should login a user', async () => {
    const loginDto = { email: 'teste@example.com', password: '123456' };
    const result = (await controller.login(loginDto)) as {
      session: { access_token: string };
    };
    expect(result).toHaveProperty('session');
    expect(result.session.access_token).toBe('token123');
  });

  it('should get user information', async () => {
    const authHeader = 'Bearer token123';
    const result = await controller.getUser(authHeader);
    expect(result).toHaveProperty('email', 'teste@example.com');
  });

  it('should return login URL for Google', async () => {
    const result = await controller.loginGoogle();
    expect(result).toHaveProperty('url', 'http://redirect.url');
  });
});
