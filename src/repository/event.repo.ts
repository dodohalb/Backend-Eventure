import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { DAO } from './dao';
import { Event } from '../domainObjects/event';
import { PublicEvent } from '../domainObjects/publicEvent';
import { PrivateEvent } from '../domainObjects/privateEvent';
import { PublicEventEntity } from '../entities/public_event.entity';
import { PrivateEventEntity } from '../entities/private_event.entity';
import { PublicEventMapper } from '../mappers/public-event.mapper';
import { PrivateEventMapper } from '../mappers/private-event.mapper';

@Injectable()
export class EventRepo implements DAO<Event> {
  private readonly logger = new Logger(EventRepo.name);

  constructor(
    @InjectRepository(PublicEventEntity)
    private readonly publicRepo: Repository<PublicEventEntity>,
    @InjectRepository(PrivateEventEntity)
    private readonly privateRepo: Repository<PrivateEventEntity>,
  ) {}
  findOne(where: FindOptionsWhere<Event>, opts?: {order?: FindOptionsOrder<Event>; relations?: string[];}): Promise<Event | null> {
    throw new Error('Method not implemented.');
  }
  findMany(where: FindOptionsWhere<Event>,opts?: {order?: FindOptionsOrder<Event>; relations?: string[];}): Promise<Event[]> {
    throw new Error('Method not implemented.');
  }

  async getAll(userId: number): Promise<Event[]> {
    this.logger.log(`Loading all events for user ${userId}`);
    const data = await this.privateRepo.find({ where: { users: { id: userId } } });
    if (data.length > 0) {
      const events = data.map((e) => PrivateEventMapper.toDomain(e));
      return events;
    }
    this.logger.log(`No private events found for user ${userId}`);
    return  [];
  }

  /** Liefert PublicEvent oder PrivateEvent je nach gefundenem Entity */
  async get(id: number): Promise<Event> {
    const pe = await this.publicRepo.findOne({ where: { id } });
    if (pe) {
      this.logger.log(`Loaded PublicEvent ${id}`);
      return PublicEventMapper.toDomain(pe);
    }
    const priv = await this.privateRepo.findOne({ where: { id } });
    if (priv) {
      this.logger.log(`Loaded PrivateEvent ${id}`);
      return PrivateEventMapper.toDomain(priv);
    }
    throw new Error(`Event ${id} not found`);
  }

  /** Erzeugt ein neues Event, je nach Instanztyp */
  async insert(obj: Event): Promise<Event> {
    if (obj instanceof PublicEvent) {
      
      const e = PublicEventMapper.toEntity(obj);
      
      const saved = await this.publicRepo.save(e);
      this.logger.log(`Inserted PublicEvent ${saved.id}`);
      const full = await this.privateRepo.findOne({
          where: { id: saved.id },
          relations: ['address', 'users', 'users.address'],
        });
      return PublicEventMapper.toDomain(full!);
    } else {
      this.logger.error(`Jetzt gehts in den mapper`);
      const e = PrivateEventMapper.toEntity(obj as PrivateEvent);
      this.logger.error(`Jetzt gehts in den speicher`);
      const saved = await this.privateRepo.save(e);
      this.logger.log(`Inserted PrivateEvent ${saved.id}`);
      const full = await this.privateRepo.findOne({
          where: { id: saved.id },
          relations: ['address', 'users', 'users.address'],
        });
      return PrivateEventMapper.toDomain(full!);
    }
  }

  /** Überschreibt ein existierendes Event */
  async update(obj: Event): Promise<Event> {
    if (obj instanceof PublicEvent) {
      
      const e = PublicEventMapper.toEntity(obj);
      
      const saved = await this.publicRepo.save(e);
      this.logger.log(`Inserted PublicEvent ${saved.id}`);
      const full = await this.privateRepo.findOne({
          where: { id: saved.id },
          relations: ['address', 'users', 'users.address'],
        });
      return PublicEventMapper.toDomain(full!);
    } else {
      this.logger.error(`Jetzt gehts in den mapper`);
      const e = PrivateEventMapper.toEntity(obj as PrivateEvent);
      this.logger.error(`Jetzt gehts in den speicher`);
      const saved = await this.privateRepo.save(e);
      this.logger.log(`Inserted PrivateEvent ${saved.id}`);
      const full = await this.privateRepo.findOne({
          where: { id: saved.id },
          relations: ['address', 'users', 'users.address'],
        });
      return PrivateEventMapper.toDomain(full!);
    }
  }
  

  /** Löscht ein Event anhand der ID */
  async delete(id: number): Promise<Event> {
    try {
      const pe = await this.publicRepo.findOneBy({ id });
      if (pe) {
        await this.publicRepo.remove(pe);
        this.logger.log(`Deleted PublicEvent ${id}`);
        return PublicEventMapper.toDomain(pe);
      }
      const priv = await this.privateRepo.findOneBy({ id });
      if (priv) {
        await this.privateRepo.remove(priv);
        this.logger.log(`Deleted PrivateEvent ${id}`);
        return PrivateEventMapper.toDomain(priv);
      }
      throw new Error();
    } catch {
      throw new Error(`Event ${id} could not be deleted or not found.`);
    }
  }
}
