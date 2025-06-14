import { Injectable, Logger } from '@nestjs/common';
import { promises } from 'dns';
import { ChatMessage } from 'src/domainObjects/chatMessage';

@Injectable()
export class ChatService {
    sendMessage(chatMessage: ChatMessage, eventId: number): Promise<ChatMessage> {
      throw new Error('Method not implemented.');
    }
    private logger = new Logger(ChatService.name);
}
