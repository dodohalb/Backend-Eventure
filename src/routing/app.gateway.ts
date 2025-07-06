import { Logger } from '@nestjs/common';

import { EventService }   from '../services/event.service';
import { UserService }    from '../services/user.service';
import { MessageService }    from '../services/message.service';
import { SwipeService }   from '../services/swipe.service';
import { AuthService }    from '../services/auth.service';

import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from '../domainObjects/chatMessage';
import { PresenceService } from 'src/services/presenceService';

@WebSocketGateway({
      namespace: '/ws',        
      transports: ['websocket']
})
export class Gateway implements OnGatewayConnection {

  
  private logger = new Logger(Gateway.name);   // tag for Nest’s logger

  @WebSocketServer()
  server: Server; 

  constructor(
    /* Inject all business-layer services */
    private readonly eventService: EventService,
    private readonly userService:  UserService,
    private readonly messageService:  MessageService,
    private readonly swipeService: SwipeService,
    private readonly authService:  AuthService,
    private readonly presenceService:  PresenceService,
  ) {}

  // ─────────────────────── WebSocket ───────────────────────
  async handleConnection(client: Socket) {      // wird automatisch aufgerufen

  // 1) Authentifizieren
    this.logger.log(`✚ client ${client.id} connected`);
    const userId = await this.authService.authenticate(client);

    if (!userId) {          // unauthenticated
      client.disconnect(true);
      return;
    }

  // 2) Daten am Socket hinterlegen 
    client.data.userId = userId;
    
  // 3) Neuen Empfänger registrieren
    this.presenceService.add(client, userId); // add client to presence service
   
  
  // 4) Aufräumen bei Disconnect
    client.on('disconnect', () => { this.presenceService.remove(client, userId); });
      

    this.logger.log(`✚ client ${client.id} mapped to user ${userId}`);
  }

  // ────────────────── Chat-Nachricht vom Client ──────────────────
    @SubscribeMessage('chatMessage')
    async sendMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody("chatMessage") chatMessage: ChatMessage, 
    ) {
        const recievers = await this.messageService.handleNewChatMessage(chatMessage);
        return { ok: true };
    }
    
    

  @SubscribeMessage('ping') 
  handlePing(@MessageBody() data: any) {
    this.logger.log(`Received ping from client: ${data}`);
    return 'pong';                    // Socket.io schickt als ACK zurück
  }

}