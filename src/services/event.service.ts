import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { PrivateEvent } from 'src/domainObjects/privateEvent';
import { PublicEvent } from 'src/domainObjects/publicEvent';
import { Event } from 'src/domainObjects/event';
import { DAO } from 'src/repository/dao';
import { EventRepo } from 'src/repository/event.repo';
import { UserRepo } from 'src/repository/user.repo';
import { User } from 'src/domainObjects/user';

@Injectable()
export class EventService {
   
    /* DAO abstraction used for persistence ─ here bound to MySQL */
    //private dao: DAO<Event> = new EventMySQL();

    /* Logger to trace service-level operations                   */
    private logger = new Logger(EventService.name);

    constructor(
        @Inject(EventRepo) private readonly eventRepo: DAO<Event>,
        @Inject(UserRepo) private readonly userRepo: UserRepo,
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
    async createEvent(file: Express.Multer.File, eventString: string): Promise<{ msg: string; event: Event }> {
        /* 1) Convert incoming JSON string to Event instance */
        const event = JSON.parse(eventString) as Event;

        /* 2) If an image is present, store its raw buffer in the entity */
        if (file) {
            this.logger.log("Received file:", file.originalname);
            event.picture = file.buffer;
        }

        /* 3) Persist entity through DAO layer */
        const result = await this.eventRepo.insert(event as any);
        if (!result) {
            throw new Error('Event not inserted');
        }

        /* 4) Log and return success response */
        this.logger.log("createEvent called:", event.name);
        return { msg: "Event created successfully", event: result };
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
        await this.eventRepo.update(event);

        return { msg: `User ${userId} wurde autorisiert` };
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
        const event =  await this.eventRepo.get(eventId);
        if (!event) throw new NotFoundException(`Event ${eventId} nicht gefunden`); 
        return event.getUsers();
    }
    


}