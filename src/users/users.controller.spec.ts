/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Objeto global para ser usado nos testes
  const team = {
    id: 1,
    name: 'Team A',
    logo: 'logo.png',
    createdAt: new Date(),
  };

  const user: User = {
    id: 1,
    name: 'User A',
    authUserId: 'auth-uuid-1234',
    email: 'user@email.com',
    profilePhoto: 'http://example.com/photo.jpg',
    favoriteTeam: team,
    isAthlete: true,
    username: 'user.a',
    birthDate: new Date('2000-01-01'), // Certifique-se de que seja um objeto Date
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'User A',
        authUserId: 'auth-uuid-1234',
        email: 'user@email.com',
        profilePhoto: 'http://example.com/photo.jpg',
        favoriteTeamId: 1,
        isAthlete: true,
        birthDate: new Date('2000-01-01'), // Certifique-se de que seja um objeto Date
      };

      jest.spyOn(service, 'create').mockResolvedValue(user);

      const result = await controller.create(createUserDto);

      expect(result).toBe(user);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [user, user];

      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toBe(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user if found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      const result = await controller.findOne('1');

      expect(result).toEqual(user);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException(`User with ID 1 not found`));

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User A',
        birthDate: new Date('1995-05-15'), // Certifique-se de que seja um objeto Date
      };

      const updatedUser = { ...user, ...updateUserDto }; // Cria um objeto atualizado

      jest.spyOn(service, 'update').mockResolvedValue(updatedUser); // Mocka o retorno do serviço

      const result = await controller.update('1', updateUserDto); // Chama o método do controlador

      expect(result).toEqual(updatedUser); // Verifica se o resultado é o esperado
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto); // Verifica se o serviço foi chamado com os argumentos corretos
    });

    it('should throw an error if the user is not found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User A',
        birthDate: new Date('1995-05-15'),
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('User not found')); // Mocka um erro

      await expect(controller.update('1', updateUserDto)).rejects.toThrow(
        'User not found',
      ); // Verifica se o erro é lançado
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto); // Verifica se o serviço foi chamado
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
