// src/mappers/chat-message.mapper.ts
import { ChatMessage } from 'src/domainObjects/chatMessage';
import { ChatMessageEntity } from 'src/entities/chat_message.entity';
import { UserMapper } from './user.mapper';

export class ChatMessageMapper {
  static toEntity(chat: ChatMessage): ChatMessageEntity {
    const entity = new ChatMessageEntity();
    // ID weglassen – DB setzt die messageId selbst
    entity.content   = chat.content;
    entity.timestamp = chat.timestamp;
    entity.user      = UserMapper.toEntity(chat.user);
    return entity;
  }

  static toDomain(entity: ChatMessageEntity): ChatMessage {
    const chat = new ChatMessage();
    // ID zuweisen, weil ChatMessage.messageId gefordert ist
    chat.messageId = entity.id;
    chat.user      = UserMapper.toDomain(entity.user);
    chat.content   = entity.content;
    chat.timestamp = entity.timestamp;
    return chat;
  }
}
