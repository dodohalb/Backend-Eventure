import { Injectable, Logger, Inject } from '@nestjs/common';
import { DAO } from 'src/repository/dao';
import { Filter } from 'src/domainObjects/filter';
import { Event } from 'src/domainObjects/event';
import { EventMySQL } from 'src/repository/event.repo';

@Injectable()
export class SwipeService {

    private readonly logger = new Logger(SwipeService.name);

    constructor(@Inject(EventMySQL) private readonly dao: DAO<Event>) {}

    async joinEvent(eventId: number, userId: number):Promise<{ msg: string }> {
        this.logger.log("joinEvent called with eventId:", eventId, "and userId:", userId);
        throw new Error('Method not implemented.');
    }

    async getEvents(filter: Filter, phoneNumber: number): Promise<Event[]> {
        this.logger.log(phoneNumber, "getEvents called with filter:", filter);
        throw new Error('Method not implemented.');
    }
    
}
