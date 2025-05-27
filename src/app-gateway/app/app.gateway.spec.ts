/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AppGateway } from './app.gateway';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  NewPostPayload,
  NotificationPayload,
  MatchUpdatePayload,
  PollUpdatePayload,
  GlobalNotificationPayload,
} from '../../common/types/socket-events.types';

describe('AppGateway', () => {
  let gateway: AppGateway;
  let serverEmitMock: jest.Mock;
  let serverToMock: jest.Mock;

  beforeEach(async () => {
    serverEmitMock = jest.fn();
    serverToMock = jest.fn().mockReturnValue({ emit: serverEmitMock });

    const module: TestingModule = await Test.createTestingModule({
      providers: [AppGateway],
    }).compile();

    gateway = module.get<AppGateway>(AppGateway);
    gateway.server = {
      emit: serverEmitMock,
      to: serverToMock,
    } as unknown as Server;

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  describe('afterInit', () => {
    it('should log server init message', () => {
      gateway.afterInit();
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        'Servidor WebSocket iniciado',
      );
    });
  });

  describe('handleConnection', () => {
    it('should log when a client connects', () => {
      const client = { id: 'socket123' } as Socket;
      gateway.handleConnection(client);
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        'Cliente conectado: socket123',
      );
    });
  });

  describe('handleDisconnect', () => {
    it('should log when a client disconnects', () => {
      const client = { id: 'socket999' } as Socket;
      gateway.handleDisconnect(client);
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        'Cliente desconectado: socket999',
      );
    });
  });

  describe('handleJoin', () => {
    it('should join room and log if socket.join exists', () => {
      const socket = {
        id: 'abc123',
        join: jest.fn().mockResolvedValue(undefined),
      } as unknown as Socket;

      gateway.handleJoin('7', socket);
      expect(socket.join).toHaveBeenCalledWith('user-7');
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        'Usuário 7 entrou na sala user-7',
      );
    });

    it('should log error if socket.join is not a function', () => {
      const socket = { id: 'zzz123', join: undefined } as unknown as Socket;
      gateway.handleJoin('10', socket);
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'O método join não está disponível no socket zzz123',
      );
    });
  });

  describe('emitNewPost', () => {
    it('should emit feed:new-post event', () => {
      const payload: NewPostPayload = {
        postId: 'post123',
        author: 2,
        timestamp: Date.now(),
      };

      gateway.emitNewPost(payload);
      expect(serverEmitMock).toHaveBeenCalledWith('feed:new-post', payload);
    });
  });

  describe('emitNotification', () => {
    it('should emit feed:new-notification event to specific user', () => {
      const payload: NotificationPayload = {
        type: 'comment',
        message: 'Alguém comentou!',
        link: '/link',
        sender: { id: 1, name: 'Alice', avatar: 'img.jpg' },
        timestamp: Date.now(),
      };

      gateway.emitNotification(5, payload);
      expect(serverToMock).toHaveBeenCalledWith('user-5');
      expect(serverEmitMock).toHaveBeenCalledWith('feed:new-comment', payload);
    });
  });

  describe('emitMatchUpdate', () => {
    it('should emit Match:update event', () => {
      const payload: MatchUpdatePayload = {
        matchId: 1,
        type: 'goal',
        title: 'Gol!',
        message: '1x0',
        teams: {
          team1: { name: 'A', logoUrl: 'a.png', score: 1 },
          team2: { name: 'B', logoUrl: 'b.png', score: 0 },
        },
        timestamp: Date.now(),
      };

      gateway.emitMatchUpdate(payload);
      expect(serverEmitMock).toHaveBeenCalledWith('Match:update', payload);
    });
  });

  describe('emitPollUpdate', () => {
    it('should emit poll:update event', () => {
      const payload: PollUpdatePayload = {
        pollId: '1234',
        title: 'Nova enquete',
        options: [],
        totalVotes: 0,
        expiration: new Date(),
        date: new Date(),
      };

      gateway.emitPollUpdate(payload);
      expect(serverEmitMock).toHaveBeenCalledWith('poll:update', payload);
    });
  });

  describe('emitGlobalNotification', () => {
    it('should emit global:notification event', () => {
      const payload: GlobalNotificationPayload = {
        type: 'event',
        title: 'Aviso geral',
        message: 'Mensagem para todos',
        link: '/polls/3',
        timestamp: Date.now(),
      };

      gateway.emitGlobalNotification(payload);
      expect(serverEmitMock).toHaveBeenCalledWith(
        'global:notification',
        payload,
      );
    });
  });
});
