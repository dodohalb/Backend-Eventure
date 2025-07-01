// src/mappers/chat-message.mapper.ts
import { ChatMessage } from 'src/domainObjects/chatMessage';
import { ChatMessageEntity } from 'src/entities/chat_message.entity';
import { UserMapper } from './user.mapper';
import { PrivateEventEntity } from 'src/entities/private_event.entity';

export class ChatMessageMapper {
  static toEntity(domain: ChatMessage): ChatMessageEntity {
    const e = new ChatMessageEntity();
    if (domain.messageId) e.id = domain.messageId;
    e.user = UserMapper.toEntity(domain.user);
    e.content = domain.content;
    e.timestamp = domain.timestamp;
    e.eventId = domain.eventId;
    return e;
  }

  static toDomain(entity: ChatMessageEntity): ChatMessage {
    const d = new ChatMessage();
    d.messageId = entity.id;
    d.user = UserMapper.toDomain(entity.user);
    d.content = entity.content;
    d.timestamp = entity.timestamp;
    d.eventId = entity.eventId;
    return d;
  }
}
