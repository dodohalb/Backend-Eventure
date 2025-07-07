import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { ViewedEvent } from 'src/entities/viewedEvents.entity';


@Injectable()
export class EventRepo implements DAO<Event> {
   
    
  private readonly logger = new Logger(EventRepo.name);

  constructor(
    @InjectRepository(PublicEventEntity)
    private readonly publicRepo: Repository<PublicEventEntity>,
    @InjectRepository(PrivateEventEntity)
    private readonly privateRepo: Repository<PrivateEventEntity>,
    @InjectRepository(ViewedEvent)
    private readonly viewedRepo: Repository<ViewedEvent>,
    
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
    const pe = await this.publicRepo.findOne({ where: { id }, });
    if (pe) {
      this.logger.log(`Loaded PublicEvent ${id}`);
      return PublicEventMapper.toDomain(pe);
    }
    const priv = await this.privateRepo.findOne({ where: { id }, relations: ['address', 'users', 'users.address'], });
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

    async findUnviewedPrivateForUser(userId: number, limit: number, date?: Date,): Promise<PrivateEvent[]> {
      // 1) Erstelle eine QueryBuilder-Instanz für die privateRepo
      const qry = this.privateRepo.createQueryBuilder('e');
        // 2) Füge einen LEFT JOIN auf user_event_views hinzu, damit du um zu Filtern welche gesehen wurden
        qry.leftJoin(
          ViewedEvent,          // die Entityklasse für die View-Tabelle
          'v',                  // Alias für ViewedEvent
          'v.eventId = e.id AND v.userId = :userId',
          { userId }            // Parameter für :userId
        );
        // 3) Füge eine WHERE-Klausel hinzu, um nur die Events zu bekommen, die nicht in der View-Tabelle sind
        qry.where('v.eventId IS NULL')
                // 3.1) UND: Ausschluss aller eigenen Events
            .andWhere('e.creatorId != :userId', { userId });

        // 4) Optional Filter nach Datum, falls angegeben
        if (date) { qry.andWhere('e.date = :date', { date }); };

        // 5) Limit setzen
        qry.limit(limit); 

        // 6) Füge einen LEFT JOIN auf die Adresse hinzu, um die Adresse des Events zu bekommen
        qry.leftJoinAndSelect('e.address', 'address');

       // 7) Füge einen LEFT JOIN auf die User hinzu, um die User des Events zu bekommen
        qry.leftJoinAndSelect('e.users', 'users');

        // 8) Füge einen LEFT JOIN auf die Adressen der User hinzu, um die Adressen der User zu bekommen
        qry.leftJoinAndSelect('users.address', 'userAddress');

        // 9) query ausführen und Events abrufen
        const events: PrivateEventEntity[] = await qry.getMany();
        // 10) Domain-Objekte daraus machen
      return events.map(e => PrivateEventMapper.toDomain(e));
  
    }




     async findUnviewedPublicForUser(userId: number, limit: number, date?: Date,): Promise<PublicEvent[]> {
      // 1) Erstelle eine QueryBuilder-Instanz für die privateRepo
      const qry = this.publicRepo.createQueryBuilder('e');
        // 2) Füge einen LEFT JOIN auf user_event_views hinzu, damit du um zu Filtern welche gesehen wurden
        qry.leftJoin(
          ViewedEvent,          // die Entityklasse für die View-Tabelle
          'v',                  // Alias für ViewedEvent
          'v.eventId = e.id AND v.userId = :userId',
          { userId }            // Parameter für :userId
        );
        // 3) Füge eine WHERE-Klausel hinzu, um nur die Events zu bekommen, die nicht in der View-Tabelle sind
        qry.where('v.eventId IS NULL')
            // 3.1) UND: Ausschluss aller eigenen Events
        .andWhere('e.creatorId != :userId', { userId });

        // 4) Optional Filter nach Datum, falls angegeben
        if (date) { qry.andWhere('e.date = :date', { date }); }

        // 5) Limit setzen
        qry.limit(limit); 

        // 6) Füge einen LEFT JOIN auf die Adresse hinzu, um die Adresse des Events zu bekommen
        qry.leftJoinAndSelect('e.address', 'address')

        // 7) Füge einen LEFT JOIN auf die User hinzu, um die User des Events zu bekommen
        qry.leftJoinAndSelect('e.users', 'users');

        // 8) Füge einen LEFT JOIN auf die Adressen der User hinzu, um die Adressen der User zu bekommen
        qry.leftJoinAndSelect('users.address', 'userAddress');

        // 9) query ausführen und Events abrufen
        const events: PublicEventEntity[] = await qry.getMany();
        // 10) Domain-Objekte daraus machen
      return events.map(e => PublicEventMapper.toDomain(e));
  
    }


    markEventsAsViewed(events: Event[], userId: number) {
        this.viewedRepo.save(
            events.map(event => {
                const viewedEvent = new ViewedEvent();
                viewedEvent.userId = userId;
                if (event.id)viewedEvent.eventId = event.id;
                return viewedEvent;
            }));
    }



  async getPic(eventId: number): Promise<Buffer> {
      const pub = await this.publicRepo.findOne({
        where: { id: eventId },
        select: ['id','picture'],
      });

    if (pub?.picture) {
      this.logger.log(`Picture for PublicEvent ${eventId} loaded`);
      return pub.picture;
    }

    const priv = await this.privateRepo.findOne({
      where: { id: eventId },
      select: ['id','picture'],
    });

    if (priv?.picture) {
      this.logger.log(`Picture for PrivateEvent ${eventId} loaded`);
      return priv.picture;
    }
    this.logger.warn(`No picture found for Event ${eventId}`);
      throw new NotFoundException(`Kein Bild für Event ${eventId} gefunden`);
    }



//   async findPrivateEventsByUser(userId: number): Promise<PrivateEvent[]> {
//   this.logger.log(`Lade PrivateEvents für User ${userId}`);

//   // Suche in der privateRepo–Join‐Tabelle nach Events mit genau diesem User
//   const entities = await this.privateRepo.find({
//     where: { users: { id: userId } },
//     relations: ['users', 'users.address', 'address'],
//   });

//   // Mapping auf dein Domain‐Model
//   return entities.map(e => PrivateEventMapper.toDomain(e));
// }
async findPrivateEventsByUser(userId: number): Promise<PrivateEvent[]> {
  this.logger.log(`Lade PrivateEvents für User ${userId}`);

  const qb = this.privateRepo
    .createQueryBuilder('e')
    // 1) Nur über diesen JOIN filtern, ohne zu selektieren
    .innerJoin('e.users', 'filterUser', 'filterUser.id = :userId', { userId })
    // 2) Jetzt alle users komplett holen
    .leftJoinAndSelect('e.users', 'users')
    .leftJoinAndSelect('users.address', 'userAddress')
    // 3) Und natürlich auch die Event-Adresse
    .leftJoinAndSelect('e.address', 'address');

  const entities = await qb.getMany();
  this.logger.log(`  → QueryBuilder returned ${entities.length} events`);

  return entities.map(e => PrivateEventMapper.toDomain(e));
}


async addUserToPrivateEvent(eventId: number, userId: number): Promise<void> {
    await this.privateRepo
      .createQueryBuilder()
      .relation(PrivateEventEntity, 'users')
      .of(eventId)    // Event mit dieser ID
      .add(userId);   // User mit dieser ID
  }

}
