import { Injectable, Logger, Inject } from '@nestjs/common';
import { DAO } from 'src/repository/dao';
import { promises } from 'dns';
import { ChatMessage } from 'src/domainObjects/chatMessage';
import { ChatRepo } from 'src/repository/chat.repo';

@Injectable()
export class ChatService {

  private readonly logger = new Logger(ChatService.name);

  constructor(@Inject(ChatRepo) private readonly dao: DAO<ChatMessage>) { }

  async sendMessage(chatMessage: ChatMessage, eventId: number): Promise<ChatMessage> {
    this.logger.log(`sendMessage called for event ${eventId}`);
    // TODO: falls nötig, eventId auf chatMessage referenziell setzen
    return await this.dao.insert(chatMessage);
  }
}
