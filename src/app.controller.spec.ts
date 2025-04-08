import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getRoot', () => {
    it('should return welcome message', () => {
      expect(appController.getRoot()).toBe('🚀 Bem-vindo à API EPesportes!');
    });
  });

  describe('getHealth', () => {
    it('should return health object with status ok', () => {
      const health = appController.getHealth();
      expect(health).toHaveProperty('status', 'ok');
      expect(health).toHaveProperty('uptime');
      expect(health).toHaveProperty('timestamp');
    });
  });
});
