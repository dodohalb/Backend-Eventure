import { Injectable, Logger } from '@nestjs/common';
import { Filter } from 'src/domainObjects/filter';
import { Event } from 'src/domainObjects/event';

@Injectable()
export class SwipeService {

    private logger = new Logger(SwipeService.name);

    joinEvent(eventId: number, userId: number):Promise<{ msg: string }> {
        this.logger.log("joinEvent called with eventId:", eventId, "and userId:", userId);
        throw new Error('Method not implemented.');
    }

    getEvents(filter: Filter, phoneNumber: number): Promise<Event[]> {
        this.logger.log(phoneNumber, "getEvents called with filter:", filter);
        throw new Error('Method not implemented.');
    }
    
}
