import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DAO } from './dao';
import { PublicEvent } from '../domainObjects/publicEvent';
import { PrivateEvent } from '../domainObjects/privateEvent';
import { PublicEventEntity } from '../entities/public_event.entity';
import { PrivateEventEntity } from '../entities/private_event.entity';
import { PublicEventMapper } from '../mappers/public-event.mapper';
import { PrivateEventMapper } from '../mappers/private-event.mapper';

@Injectable()
export class EventRepo implements DAO<PublicEvent | PrivateEvent> {
  private readonly logger = new Logger(EventRepo.name);

  constructor(
    @InjectRepository(PublicEventEntity)
    private readonly publicRepo: Repository<PublicEventEntity>,
    @InjectRepository(PrivateEventEntity)
    private readonly privateRepo: Repository<PrivateEventEntity>,
  ) {}

  /** Liefert PublicEvent oder PrivateEvent je nach gefundenem Entity */
  async get(id: number): Promise<PublicEvent | PrivateEvent> {
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
  async insert(obj: PublicEvent | PrivateEvent): Promise<PublicEvent | PrivateEvent> {
    if (obj instanceof PublicEvent) {
      const e = PublicEventMapper.toEntity(obj);
      const saved = await this.publicRepo.save(e);
      this.logger.log(`Inserted PublicEvent ${saved.id}`);
      return PublicEventMapper.toDomain(saved);
    } else {
      const e = PrivateEventMapper.toEntity(obj);
      const saved = await this.privateRepo.save(e);
      this.logger.log(`Inserted PrivateEvent ${saved.id}`);
      return PrivateEventMapper.toDomain(saved);
    }
  }

  /** Überschreibt ein existierendes Event */
  async update(obj: PublicEvent | PrivateEvent): Promise<PublicEvent | PrivateEvent> {
    if (obj instanceof PublicEvent) {
      const e = PublicEventMapper.toEntity(obj);
      const saved = await this.publicRepo.save(e);
      this.logger.log(`Updated PublicEvent ${saved.id}`);
      return PublicEventMapper.toDomain(saved);
    } else {
      const e = PrivateEventMapper.toEntity(obj);
      const saved = await this.privateRepo.save(e);
      this.logger.log(`Updated PrivateEvent ${saved.id}`);
      return PrivateEventMapper.toDomain(saved);
    }
  }

  /** Löscht ein Event anhand der ID */
  async delete(id: number): Promise<PublicEvent | PrivateEvent> {
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
