/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AppGateway } from './app.gateway';
import { Server, Socket } from 'socket.io';
import {
  NewPostPayload,
  NotificationPayload,
  MatchUpdatePayload,
  PollUpdatePayload,
} from 'src/common/types/socket-events.types';

describe('AppGateway', () => {
  let gateway: AppGateway;
  let mockEmit: jest.Mock;
  let mockToEmit: jest.Mock;
  let mockTo: jest.Mock;
  let mockServer: Partial<Server>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppGateway],
    }).compile();

    gateway = module.get<AppGateway>(AppGateway);

    // Cria mocks tipados para os métodos utilizados do Socket.IO
    mockEmit = jest.fn();
    mockToEmit = jest.fn();
    mockTo = jest.fn().mockReturnValue({ emit: mockToEmit });
    mockServer = {
      emit: mockEmit,
      to: mockTo,
    };

    // Atribui o mock do servidor garantindo a tipagem correta
    gateway.server = mockServer as Server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('afterInit', () => {
    it('should log the initialization message', () => {
      const logSpy = jest.spyOn(gateway['logger'], 'log');
      gateway.afterInit();
      expect(logSpy).toHaveBeenCalledWith('Servidor WebSocket iniciado');
    });
  });

  describe('handleConnection', () => {
    it('should log the connection message', () => {
      const socket: Socket = {
        id: '123',
        join: jest.fn(),
      } as Partial<Socket> as Socket;
      const logSpy = jest.spyOn(gateway['logger'], 'log');
      gateway.handleConnection(socket);
      expect(logSpy).toHaveBeenCalledWith(`Cliente conectado: ${socket.id}`);
    });
  });

  describe('handleDisconnect', () => {
    it('should log the disconnect message', () => {
      const socket: Socket = {
        id: '456',
        join: jest.fn(),
      } as Partial<Socket> as Socket;
      const logSpy = jest.spyOn(gateway['logger'], 'log');
      gateway.handleDisconnect(socket);
      expect(logSpy).toHaveBeenCalledWith(`Cliente desconectado: ${socket.id}`);
    });
  });

  describe('handleJoin', () => {
    it('should join the room and log a message when join exists', () => {
      const socket: Socket = {
        id: '789',
        join: jest.fn(),
      } as Partial<Socket> as Socket;
      const userId: string = 'user123';
      const logSpy = jest.spyOn(gateway['logger'], 'log');
      gateway.handleJoin(userId, socket);
      expect(socket.join).toHaveBeenCalledWith(`user-${userId}`);
      expect(logSpy).toHaveBeenCalledWith(
        `Usuário ${userId} entrou na sala user-${userId}`,
      );
    });

    it('should log an error when join method is not available', () => {
      const socket: Socket = { id: '789' } as Partial<Socket> as Socket;
      const userId: string = 'user123';
      const errorSpy = jest.spyOn(gateway['logger'], 'error');
      gateway.handleJoin(userId, socket);
      expect(errorSpy).toHaveBeenCalledWith(
        `O método join não está disponível no socket ${socket.id}`,
      );
    });
  });

  describe('emitNewPost', () => {
    it('should emit the new post event', () => {
      const payload: NewPostPayload = {
        postId: '1',
        author: 'John Doe',
        timestamp: Date.now(),
      };
      gateway.emitNewPost(payload);
      expect(mockEmit).toHaveBeenCalledWith('feed:new-post', payload);
    });
  });

  describe('emitNotification', () => {
    it('should emit a notification event to a specific room', () => {
      const payload: NotificationPayload = {
        type: 'comment',
        message: 'User liked your post',
        link: '/post/1',
        timestamp: Date.now(),
      };
      const userId: string = 'user123';
      gateway.emitNotification(userId, payload);
      expect(mockTo).toHaveBeenCalledWith(`user-${userId}`);
      expect(mockToEmit).toHaveBeenCalledWith('user:notification', payload);
    });
  });

  describe('emitMatchUpdate', () => {
    it('should emit the game update event', () => {
      const payload: MatchUpdatePayload = {
        matchId: 'game123',
        score: '2-1',
        status: 'First Half',
        currentTime: '15:23',
      };
      gateway.emitMatchUpdate(payload);
      expect(mockEmit).toHaveBeenCalledWith('Match:update', payload);
    });
  });

  describe('emitPollUpdate', () => {
    it('should emit the poll update event', () => {
      const payload: PollUpdatePayload = {
        pollId: 'poll456',
        options: [
          { id: 'option1', text: 'Option 1', votes: 10 },
          { id: 'option2', text: 'Option 2', votes: 5 },
        ],
      };
      gateway.emitPollUpdate(payload);
      expect(mockEmit).toHaveBeenCalledWith('poll:update', payload);
    });
  });
});
