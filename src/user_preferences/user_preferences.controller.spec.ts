/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserPreferencesController } from './user_preferences.controller';
import { UserPreferencesService } from './user_preferences.service';
import { mockUserPreferences, mockUserPreference } from '../../test/mocks';

describe('UserPreferencesController', () => {
  let controller: UserPreferencesController;
  let service: UserPreferencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPreferencesController],
      providers: [
        {
          provide: UserPreferencesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn().mockResolvedValue(mockUserPreferences),
            findOne: jest.fn().mockResolvedValue(mockUserPreference),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserPreferencesController>(
      UserPreferencesController,
    );
    service = module.get<UserPreferencesService>(UserPreferencesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all user preferences', async () => {
    expect(await controller.findAll()).toEqual(mockUserPreferences);
    expect(service.findAll).toHaveBeenCalled();
  });
});
