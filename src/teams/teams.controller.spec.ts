/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
// Importa as ferramentas de teste do NestJS para criar um módulo de teste.

import { TeamsController } from './teams.controller';
// Importa o controlador que será testado.

import { TeamsService } from './teams.service';
// Importa o serviço que será mockado para os testes.

import { CreateTeamDto } from './dto/create-team.dto';
// Importa o DTO usado para criar um time.

import { UpdateTeamDto } from './dto/update-team.dto';
// Importa o DTO usado para atualizar um time.

describe('TeamsController', () => {
  // Define o bloco de testes para o controlador TeamsController.

  let controller: TeamsController;
  // Declara a variável para armazenar a instância do controlador.

  let service: TeamsService;
  // Declara a variável para armazenar a instância mockada do serviço.

  beforeEach(async () => {
    // Executa antes de cada teste para configurar o módulo de teste.

    const module: TestingModule = await Test.createTestingModule({
      // Cria um módulo de teste para o controlador e o serviço.

      controllers: [TeamsController],
      // Registra o controlador que será testado.

      providers: [
        {
          provide: TeamsService,
          // Substitui o serviço real por um mock.

          useValue: {
            create: jest.fn(),
            // Mocka o método `create` do serviço.

            findAll: jest.fn(),
            // Mocka o método `findAll` do serviço.

            findOne: jest.fn(),
            // Mocka o método `findOne` do serviço.

            update: jest.fn(),
            // Mocka o método `update` do serviço.

            remove: jest.fn(),
            // Mocka o método `remove` do serviço.
          },
        },
      ],
    }).compile();
    // Compila o módulo de teste.

    controller = module.get<TeamsController>(TeamsController);
    // Obtém a instância do controlador a partir do módulo de teste.

    service = module.get<TeamsService>(TeamsService);
    // Obtém a instância mockada do serviço a partir do módulo de teste.
  });

  it('should be defined', () => {
    // Testa se o controlador foi definido corretamente.
    expect(controller).toBeDefined();
    // Verifica se a instância do controlador não é `undefined`.
  });

  describe('create', () => {
    // Bloco de testes para o método `create`.

    it('should create a team', async () => {
      // Testa se o método `create` cria um time corretamente.

      const createTeamDto: CreateTeamDto = { name: 'Team A', logo: 'logo.png' };
      // Define os dados de entrada para criar um time.

      const result = { id: 1, ...createTeamDto, createdAt: new Date() };
      // Define o resultado esperado, incluindo o campo `createdAt`.

      jest.spyOn(service, 'create').mockResolvedValue(result);
      // Mocka o método `create` do serviço para retornar o resultado esperado.

      expect(await controller.create(createTeamDto)).toBe(result);
      // Verifica se o método `create` do controlador retorna o resultado esperado.

      expect(service.create).toHaveBeenCalledWith(createTeamDto);
      // Verifica se o método `create` do serviço foi chamado com os dados corretos.
    });
  });

  describe('findAll', () => {
    // Bloco de testes para o método `findAll`.

    it('should return an array of teams', async () => {
      // Testa se o método `findAll` retorna uma lista de times.

      const result = [
        { id: 1, name: 'Team A', logo: 'logo.png', createdAt: new Date() },
      ];
      // Define o resultado esperado.

      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      // Mocka o método `findAll` do serviço para retornar o resultado esperado.

      expect(await controller.findAll()).toBe(result);
      // Verifica se o método `findAll` do controlador retorna o resultado esperado.

      expect(service.findAll).toHaveBeenCalled();
      // Verifica se o método `findAll` do serviço foi chamado.
    });
  });

  describe('findOne', () => {
    // Bloco de testes para o método `findOne`.

    it('should return a single team', async () => {
      // Testa se o método `findOne` retorna um time específico.

      const result = {
        id: 1,
        name: 'Team A',
        logo: 'logo.png',
        createdAt: new Date(),
      };
      // Define o resultado esperado.

      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      // Mocka o método `findOne` do serviço para retornar o resultado esperado.

      expect(await controller.findOne('1')).toBe(result);
      // Verifica se o método `findOne` do controlador retorna o resultado esperado.

      expect(service.findOne).toHaveBeenCalledWith(1);
      // Verifica se o método `findOne` do serviço foi chamado com o ID correto.
    });
  });

  describe('update', () => {
    // Bloco de testes para o método `update`.

    it('should update a team', async () => {
      // Testa se o método `update` atualiza um time corretamente.

      const updateTeamDto: UpdateTeamDto = { name: 'Updated Team A' };
      // Define os dados de entrada para atualizar um time.

      const result = {
        id: 1,
        name: 'Team A',
        logo: 'logo.png',
        createdAt: new Date(),
      };
      // Define o resultado esperado.

      jest.spyOn(service, 'update').mockResolvedValue(result);
      // Mocka o método `update` do serviço para retornar o resultado esperado.

      expect(await controller.update('1', updateTeamDto)).toBe(result);
      // Verifica se o método `update` do controlador retorna o resultado esperado.

      expect(service.update).toHaveBeenCalledWith(1, updateTeamDto);
      // Verifica se o método `update` do serviço foi chamado com os dados corretos.
    });
  });

  describe('remove', () => {
    // Bloco de testes para o método `remove`.

    it('should remove a team', async () => {
      // Testa se o método `remove` remove um time corretamente.

      const result = undefined;
      // Define o resultado esperado (nenhum retorno).

      jest.spyOn(service, 'remove').mockResolvedValue(result);
      // Mocka o método `remove` do serviço para retornar o resultado esperado.

      expect(await controller.remove('1')).toBe(result);
      // Verifica se o método `remove` do controlador retorna o resultado esperado.

      expect(service.remove).toHaveBeenCalledWith(1);
      // Verifica se o método `remove` do serviço foi chamado com o ID correto.
    });
  });
});
