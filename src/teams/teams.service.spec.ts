/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { NotFoundException } from '@nestjs/common';

describe('TeamsService', () => {
  let service: TeamsService;
  let teamRepository: Repository<Team>;

  // Objeto global para ser usado nos testes
  const team = {
    id: 1,
    name: 'Team A',
    logo: 'logo.png',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(Team),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a team', async () => {
      const createTeamDto = { name: 'Team A', logo: 'logo.png' };

      jest.spyOn(teamRepository, 'create').mockReturnValue(team as Team);
      jest.spyOn(teamRepository, 'save').mockResolvedValue(team as Team);

      const result = await service.create(createTeamDto);

      expect(result).toBe(team);
      expect(teamRepository.create).toHaveBeenCalledWith(createTeamDto);
      expect(teamRepository.save).toHaveBeenCalledWith(team);
    });
  });

  describe('findAll', () => {
    it('should return an array of teams', async () => {
      const teams = [team, team];

      jest.spyOn(teamRepository, 'find').mockResolvedValue(teams as Team[]);

      const result = await service.findAll();

      expect(result).toBe(teams);
      expect(teamRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a team by ID', async () => {
      jest.spyOn(teamRepository, 'findOneBy').mockResolvedValue(team as Team);

      const result = await service.findOne(team.id);

      expect(result).toBe(team);
      expect(teamRepository.findOneBy).toHaveBeenCalledWith({ id: team.id });
    });

    it('should return null if team is not found', async () => {
      jest.spyOn(teamRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.findOne(team.id);

      expect(result).toBeNull();
      expect(teamRepository.findOneBy).toHaveBeenCalledWith({ id: team.id });
    });
  });

  describe('update', () => {
    it('should update a team', async () => {
      const updateTeamDto = { name: 'Updated Team A' };

      jest.spyOn(teamRepository, 'findOneBy').mockResolvedValue(team as Team);
      jest.spyOn(teamRepository, 'save').mockResolvedValue({
        ...team,
        ...updateTeamDto,
      } as Team);

      const result = await service.update(team.id, updateTeamDto);

      expect(result).toEqual({ ...team, ...updateTeamDto });
      expect(teamRepository.findOneBy).toHaveBeenCalledWith({ id: team.id });
      expect(teamRepository.save).toHaveBeenCalledWith({
        ...team,
        ...updateTeamDto,
      });
    });

    it('should throw NotFoundException if team is not found', async () => {
      const updateTeamDto = { name: 'Updated Team A' };

      jest.spyOn(teamRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(team.id, updateTeamDto)).rejects.toThrow(
        new NotFoundException(`Team with ID ${team.id} not found`),
      );
    });
  });

  describe('remove', () => {
    it('should remove a team', async () => {
      jest
        .spyOn(teamRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await service.remove(team.id);

      expect(teamRepository.delete).toHaveBeenCalledWith(team.id);
    });

    it('should handle case where team is not found during removal', async () => {
      jest
        .spyOn(teamRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await service.remove(team.id);

      expect(teamRepository.delete).toHaveBeenCalledWith(team.id);
    });
  });
});
