import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  NewPostPayload,
  NotificationPayload,
  MatchUpdatePayload,
  PollUpdatePayload,
} from 'src/common/types/socket-events.types';

@WebSocketGateway({
  cors: {
    origin: '*', // Permite requisições de qualquer origem (ajuste para produção)
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AppGateway.name);

  @WebSocketServer()
  server!: Server; // Asseguramos ao TypeScript que esse valor não será nulo

  // Evento disparado ao inicializar o WebSocket
  afterInit(): void {
    this.logger.log('Servidor WebSocket iniciado');
  }

  // Evento disparado quando um cliente se conecta
  handleConnection(client: Socket): void {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  // Evento disparado quando um cliente se desconecta
  handleDisconnect(client: Socket): void {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  // Cliente entra em uma sala identificada pelo ID do usuário (para notificações privadas)
  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() userId: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    // Verifica se o método join existe antes de chamá-lo para evitar chamadas inseguras
    if (typeof socket.join === 'function') {
      void socket.join(`user-${userId}`);
      this.logger.log(`Usuário ${userId} entrou na sala user-${userId}`);
    } else {
      this.logger.error(
        `O método join não está disponível no socket ${socket.id}`,
      );
    }
  }

  // Emite uma notificação de nova postagem para todos os clientes conectados
  emitNewPost(payload: NewPostPayload): void {
    this.server.emit('feed:new-post', payload);
  }

  // Emite uma notificação privada para um usuário específico
  emitNotification(userId: string, payload: NotificationPayload): void {
    this.server.to(`user-${userId}`).emit('user:notification', payload);
  }

  // Emite atualização de jogo em tempo real para todos os usuários
  emitMatchUpdate(payload: MatchUpdatePayload): void {
    this.server.emit('Match:update', payload);
  }

  // Emite atualização de enquete para todos os usuários
  emitPollUpdate(payload: PollUpdatePayload): void {
    this.server.emit('poll:update', payload);
  }
}
