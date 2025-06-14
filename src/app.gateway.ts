import { Logger } from '@nestjs/common';

import { EventService }   from './services/event.service';
import { UserService }    from './services/user.service';
import { ChatService }    from './services/chat.service';
import { SwipeService }   from './services/swipe.service';
import { AuthService }    from './services/auth.service';

import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from './domainObjects/chatMessage';

@WebSocketGateway({
      namespace: '/ws',        
      transports: ['websocket']
})
export class Gateway implements OnGatewayConnection {

  private socketsByUser = new Map<number, Set<Socket>>();
  private logger = new Logger(Gateway.name);   // tag for Nest’s logger

  @WebSocketServer()
  server: Server; 

  constructor(
    /* Inject all business-layer services */
    private readonly eventService: EventService,
    private readonly userService:  UserService,
    private readonly chatService:  ChatService,
    private readonly swipeService: SwipeService,
    private readonly authService:  AuthService,
  ) {}

  // ─────────────────────── WebSocket ───────────────────────
  async handleConnection(client: Socket) {      // wird automatisch aufgerufen
    const phoneNumber  = await this.authService.authenticate(client);
    if (!phoneNumber) {// unauthenticated
      client.disconnect(); // disconnect if no phone number found
      return;
    } 
    
    client.join(String(phoneNumber)); // join room by phone number
   
    /* vorhandenes Set holen oder neu anlegen */
    const set = this.socketsByUser.get(phoneNumber) ?? new Set<Socket>();
    set.add(client);
    this.socketsByUser.set(phoneNumber, set);

    /* beim Disconnect sauber entfernen */
  client.on('disconnect', () => {
    set.delete(client);
    if (set.size === 0) this.socketsByUser.delete(phoneNumber);
  });

  this.logger.log(`✚ client ${client.id} mapped to user ${phoneNumber}`);
  }

  /** Placeholder for chat message endpoint (to be implemented) */
    @SubscribeMessage('chatMessage')
    async sendMessage(@MessageBody("chatMessage") chatMessage: ChatMessage, @MessageBody("eventId") eventId: number ) {
      const result = await this.chatService.sendMessage(chatMessage,eventId);
      if(!result){

      }
      // TODO: Implement message sending logic
    }

  @SubscribeMessage('ping') 
  handlePing(@MessageBody() data: any) {
    return 'pong';                    // Socket.io schickt als ACK zurück
  }

}