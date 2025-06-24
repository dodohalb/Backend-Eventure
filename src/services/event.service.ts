import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrivateEvent } from 'src/domainObjects/privateEvent';
import { PublicEvent } from 'src/domainObjects/publicEvent';
import { Event } from 'src/domainObjects/event';
import { DAO } from 'src/repository/dao';
import { EventMySQL } from 'src/repository/eventMySQL';

@Injectable()
export class EventService {
    /* DAO abstraction used for persistence ─ here bound to MySQL */
    //private dao: DAO<Event> = new EventMySQL();

    /* Logger to trace service-level operations                   */
    private logger = new Logger(EventService.name);

    constructor(@Inject(EventMySQL) private readonly dao: DAO<PublicEvent | PrivateEvent>) { }

    /* Update an existing event (TODO: implement DB logic) */
    async updateEvent(file: Express.Multer.File, eventString: string): Promise<{ msg: string }> {
        this.logger.log("updateEvent called for event:", eventString);
        const event = JSON.parse(eventString) as Event;
        if (file) {
            event.picture = file.buffer;
        }
        await this.dao.update(event as any);
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
        const result = await this.dao.insert(event as any);
        if (!result) {
            throw new Error('Event not inserted');
        }

        /* 4) Log and return success response */
        this.logger.log("createEvent called:", event.name);
        return { msg: "Event created successfully", event: result };
    }

    async getEvent(id: number): Promise<Event> {
        this.logger.log('getEvent called for id:', id);
        return await this.dao.get(id);
    }

    async deleteEvent(id: number): Promise<{ msg: string }> {
        await this.dao.delete(id);
        this.logger.log('deleteEvent called for id:', id);
        return { msg: 'Event deleted successfully' };
    }


}