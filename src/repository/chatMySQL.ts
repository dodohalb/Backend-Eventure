import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DAO } from './dao';
import { ChatMessageEntity } from '../entities/chat_message.entity';
import { ChatMessage } from '../domainObjects/chatMessage';
import { ChatMessageMapper } from '../mappers/chat-message.mapper';

@Injectable()
export class ChatMySQL implements DAO<ChatMessage> {
  private readonly logger = new Logger(ChatMySQL.name);

  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly repo: Repository<ChatMessageEntity>,
  ) {}

  async get(id: number): Promise<ChatMessage> {
    const e = await this.repo.findOneBy({ id });
    if (!e) throw new Error(`ChatMessage ${id} not found`);
    return ChatMessageMapper.toDomain(e);
  }

  async insert(msg: ChatMessage): Promise<ChatMessage> {
    const e = ChatMessageMapper.toEntity(msg);
    const saved = await this.repo.save(e);
    this.logger.log(`Inserted ChatMessage ${saved.id}`);
    return ChatMessageMapper.toDomain(saved);
  }

  async update(msg: ChatMessage): Promise<ChatMessage> {
    const e = ChatMessageMapper.toEntity(msg);
    const saved = await this.repo.save(e);
    this.logger.log(`Updated ChatMessage ${saved.id}`);
    return ChatMessageMapper.toDomain(saved);
  }

  async delete(id: number): Promise<ChatMessage> {
    const e = await this.repo.findOneBy({ id });
    if (!e) throw new Error(`ChatMessage ${id} not found`);
    await this.repo.remove(e);
    this.logger.log(`Deleted ChatMessage ${id}`);
    return ChatMessageMapper.toDomain(e);
  }
}
