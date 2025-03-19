import { Test, TestingModule } from '@nestjs/testing';
import { UserPreferencesService } from './user_preferences.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserPreference } from './entities/user_preference.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { mockUserPreferences, mockUserPreference } from '../../test/mocks';

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;
  let userPreferenceRepository: Repository<UserPreference>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn().mockResolvedValue(mockUserPreferences),
      findOne: jest.fn().mockResolvedValue(mockUserPreference),
      save: jest.fn().mockImplementation(dto => Promise.resolve({ id: 1, ...dto })),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserPreferencesService,
        { provide: getRepositoryToken(UserPreference), useValue: mockRepository },
        { provide: getRepositoryToken(User), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UserPreferencesService>(UserPreferencesService);
    userPreferenceRepository = module.get<Repository<UserPreference>>(getRepositoryToken(UserPreference));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all user preferences', async () => {
    expect(await service.findAll()).toEqual(mockUserPreferences);
  });
});
