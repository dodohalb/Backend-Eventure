import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { DAO } from './dao';
import { ChatMessageEntity } from '../entities/chat_message.entity';
import { ChatMessage } from '../domainObjects/chatMessage';
import { ChatMessageMapper } from '../mappers/chat-message.mapper';

@Injectable()
export class ChatRepo implements DAO<ChatMessage, ChatMessageEntity> {
  private readonly logger = new Logger(ChatRepo.name);

  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly repo: Repository<ChatMessageEntity>,
  ) { }
  findOne(where: FindOptionsWhere<ChatMessageEntity>,opts?: {order?: FindOptionsOrder<ChatMessageEntity>; relations?: string[];}): Promise<ChatMessage | null> {
    throw new Error('Method not implemented.');
  }
  async findMany(where: FindOptionsWhere<ChatMessageEntity>,opts?: {order?: FindOptionsOrder<ChatMessageEntity>; relations?: string[];}): Promise<ChatMessage[]> {
    this.logger.log(`Searching ChatMessages with criteria: ${JSON.stringify(where)}`);
    const entities = await this.repo.find({where});
    if (entities.length > 0){
      const messages = entities.map(ChatMessageMapper.toDomain); 
      return messages;
    }
    this.logger.warn(`No ChatMessages found for criteria: ${JSON.stringify(where)}`);
    return [];

  }

  getAll(): Promise<ChatMessage[]> {
    throw new Error('Method not implemented.');
  }

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

  async getMessagesAfter(eventId: number, after: Date): Promise<ChatMessage[]> {
    this.logger.log(
      `Lade neue Nachrichten für Event ${eventId} nach ${after.toISOString()}`,
    );

    const entities = await this.repo.find({
      where: {
        event: { id: eventId },     // auf geschachtelte Event‐ID filtern
        timestamp: MoreThan(after),  // nach dem Datum
      },
      order: { timestamp: 'ASC' },   // chronologisch sortiert
      relations: ['user', 'event'],  // damit Mapper User und Event hat
    });

    return entities.map(e => ChatMessageMapper.toDomain(e));
  }

}
