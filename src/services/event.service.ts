import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { PrivateEvent } from 'src/domainObjects/privateEvent';
import { PublicEvent } from 'src/domainObjects/publicEvent';
import { Event } from 'src/domainObjects/event';
import { DAO } from 'src/repository/dao';
import { EventRepo } from 'src/repository/event.repo';
import { UserRepo } from 'src/repository/user.repo';
import { User } from 'src/domainObjects/user';
import { plainToInstance } from 'class-transformer';
import { MessageService } from './message.service';

@Injectable()
export class EventService {
 
  

    /* DAO abstraction used for persistence ─ here bound to MySQL */
    //private dao: DAO<Event> = new EventMySQL();

    /* Logger to trace service-level operations                   */
    private logger = new Logger(EventService.name);

    constructor(
        @Inject(EventRepo) private readonly eventRepo: EventRepo,
        @Inject(UserRepo) private readonly userRepo: UserRepo,
        @Inject(MessageService) private readonly messageService: MessageService
    ) { }

    /* Update an existing event (TODO: implement DB logic) */
    async updateEvent(file: Express.Multer.File, eventString: string): Promise<{ msg: string }> {
        this.logger.log("updateEvent called for event:", eventString);
        const event = JSON.parse(eventString) as Event;
        if (file) {
            event.picture = file.buffer;
        }
        await this.eventRepo.update(event as any);
        return { msg: 'Event updated successfully' };
    }

    /* ------------------------------------------------------------------
     *  Create a new event
     *  file        : optional image uploaded via Multer
     *  eventString : JSON string with all other event properties
     *  Returns     : confirmation + the entity saved by the DAO
     * ------------------------------------------------------------------ */
    async createEvent(file: Express.Multer.File, eventString: string, creatorId: number): Promise<Event> {
        /* 1) Convert incoming JSON string to Event instance */
        const raw = JSON.parse(eventString)
        const event = plainToInstance(PrivateEvent, raw);

        if(file) event.picture = file.buffer;
    
        // 2) Ersteller holen
        event.creatorId = creatorId; // Set the creatorId from the request


        // 3) Domain-Objekt bauen (inkl. creator)
        

        // 4) Persistieren
        const result = await this.eventRepo.insert(event);
        result.picture=null;
        
        return result ;
    }

    async getEvent(id: number): Promise<Event> {
        this.logger.log('getEvent called for id:', id);
        return await this.eventRepo.get(id);
    }

    async deleteEvent(id: number): Promise<{ msg: string }> {
        await this.eventRepo.delete(id);
        this.logger.log('deleteEvent called for id:', id);
        return { msg: 'Event deleted successfully' };
    }


    async authorizeUser(eventId: number, userId: number): Promise<{ msg: string }> {
        this.logger.log(`authorizeUser called with eventId=${eventId}, userId=${userId}`);

        // 1) Lade das PrivateEvent
        const event = await this.eventRepo.get(eventId) as PrivateEvent;
        if (!event) throw new NotFoundException(`Event ${eventId} nicht gefunden`);

        // 2) Lade den User
        const user = await this.userRepo.get(userId);
        if (!user) throw new NotFoundException(`User ${userId} nicht gefunden`);

        // 3) Füge ihn der Liste der bestätigten Teilnehmer hinzu
        event.addUser(user);

        // 4) Persistiere Update
        const updatedEvent = await this.eventRepo.update(event);


        // 5) Benachrichtige alle User des Events
      
        if (updatedEvent.creatorId) {
            await this.messageService.notiffyUser(updatedEvent.getUsers(), updatedEvent.creatorId, 'eventUpdate', updatedEvent);
            return { msg: `User ${userId} wurde autorisiert` };
        }
        throw new NotFoundException(`Creator of event ${eventId} not found`);
    }

    async declineUser(eventId: number, userId: number): Promise<{ msg: string }> {
        this.logger.log(`declineUser called with eventId=${eventId}, userId=${userId}`);

        // 1) Lade das PrivateEvent
        const event = await this.eventRepo.get(eventId) as PrivateEvent;
        if (!event) throw new NotFoundException(`Event ${eventId} nicht gefunden`);

        // 2) Lade den User
        const user = await this.userRepo.get(userId);
        if (!user) {
            throw new NotFoundException(`User ${userId} nicht gefunden`);
        }

        // 3) Entferne den User über das ganze Domain-Objekt
        event.removeUser(user);

        // 4) Persistiere das Update
        await this.eventRepo.update(event);

        return { msg: `User ${userId} wurde abgelehnt` };
    }

    async getNewEventMembers(eventId: number): Promise<User[]> {
        this.logger.log(`getNewEventMembers called for eventId: ${eventId}`);
        const event = await this.eventRepo.get(eventId);
        if (!event) throw new NotFoundException(`Event ${eventId} nicht gefunden`);
        return event.getUsers();
    }


    async joinEvent(eventId: number, userId: number):Promise<void> {
            this.logger.log("joinEvent called with eventId:", eventId, "and userId:", userId);
            const event = await this.eventRepo.get(eventId);
            if(event instanceof PrivateEvent) {
                if(event.authorization && event.creatorId){
                    const admin = await this.userRepo.get(event.creatorId);
                    this.messageService.notiffyUser(admin, userId, 'userWantToJoin', event);
                }
                const user = await this.userRepo.get(userId);
                if (event.getUsers().some(u => u.id === user.id)) {
                    this.logger.error("User already in Event");
                    return;
                }
                event.addUser(user);
                const updatedEvent = await this.eventRepo.update(event);
                this.messageService.notiffyUser(updatedEvent.getUsers(), userId, 'eventUpdate', updatedEvent);
                
            }
            
    }


      async getEventPicture(eventId: number): Promise<{ data: Buffer; mime: string }> {
        this.logger.log("Send Client Picture from EventID",eventId);
        const picture = await this.eventRepo.getPic(eventId); // Raw-Entity (ohne Mapping)


            return {
                data: picture,             // Buffer (Bytea in Postgres)
                mime: 'image/png',
            };
        }

/*
        async getAllEventsFromUser(userId: number) {
            const events = await this.eventRepo.findMany()
        }
*/


}