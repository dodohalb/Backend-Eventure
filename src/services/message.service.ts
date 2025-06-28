import { Injectable, Logger, Inject } from '@nestjs/common';
import { DAO } from 'src/repository/dao';
import { ChatMessage } from 'src/domainObjects/chatMessage';
import { ChatRepo } from 'src/repository/chat.repo';
import { Server, Socket } from 'socket.io';
import { Event } from 'src/domainObjects/event';
import { EventRepo } from 'src/repository/event.repo';
import { PresenceService } from './presenceService';
import { PushService } from './push.Service';
import { forwardRef } from '@nestjs/common';
import { Gateway } from '../routing/app.gateway';  
import { MoreThan } from 'typeorm';
import { after } from 'node:test';
import { ChatMessageEntity } from 'src/entities/chat_message.entity';


@Injectable()
export class MessageService {

  private readonly logger = new Logger(MessageService.name);


  constructor(
      @Inject(EventRepo) private readonly eventRepo: DAO<Event>,
      @Inject(ChatRepo) private readonly chatRepo: DAO<ChatMessage,ChatMessageEntity >,

      private readonly presenceService: PresenceService,
      private readonly pushService: PushService,
      @Inject(forwardRef(() => Gateway))
    private readonly gateway: Gateway,

    ) { }


  async handleNewChatMessage(chatMessage: ChatMessage): Promise<void> {
    // 1) Speichern
    const saved = await this.chatRepo.insert(chatMessage); 

    // 2) Empfängerliste Laden
    const receivers = (await this.eventRepo.get(chatMessage.eventId))?.getUsers().map(user => user.phoneNumber)??[];

    // 3) trennen in online | offline
    const online  : string[] = [];
    const offline : string[] = [];

    for (const receiver of receivers) {
      (this.presenceService.isOnline(receiver) ? online : offline).push(receiver);
    }

    // 4) live senden
    for (const phone of online) {
      this.gateway.server.to(phone).emit('newMessage', saved);
    }

    //todo: benachrichte Offline recievers für GET unread Messages
    // 5) offline pushen
    if (offline.length) {
      await this.pushService.notifyOffline(offline);
    }

    this.logger.log(
      `msg ${saved.messageId} → online ${online.length}, offline ${offline.length}`,
    );    
  }
  
  
  async getUnreadMessages(timestamp: Date, userId: number): Promise<ChatMessage[]> {
    // 1) get all Events from User
    const events = await this.eventRepo.getAll(userId);
    if (!events) {
      this.logger.warn(`No events found for user ${userId}`);
      return [];
    }
    // 2) get all Messages from Events after timestamp
    var allMessages: ChatMessage[] = [];
    for (const event of events) {
      const messages = await this.chatRepo.findMany(
        { event: { id: event.id }, timestamp: MoreThan(timestamp) }, 
        { order: { timestamp: 'ASC' }, relations: ['user', 'event'] }, 
      );
      allMessages = allMessages.concat(messages);
    }

    return allMessages;
  }


 
}
