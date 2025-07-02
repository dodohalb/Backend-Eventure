import { Injectable, Logger, Inject } from '@nestjs/common';
import { DAO } from 'src/repository/dao';
import { Filter } from 'src/domainObjects/filter';
import { Event } from 'src/domainObjects/event';
import { EventRepo } from 'src/repository/event.repo';

@Injectable()
export class SwipeService {

    private readonly logger = new Logger(SwipeService.name);

    constructor(@Inject(EventRepo) private readonly evetRepo: EventRepo) {}

    async joinEvent(eventId: number, userId: number):Promise<{ msg: string }> {
        this.logger.log("joinEvent called with eventId:", eventId, "and userId:", userId);
        throw new Error('Method not implemented.');
    }

    async getEvents(filter: Filter, userId: number): Promise<Event[]> {
        this.logger.log(userId, "getEvents called with filter:", filter);
        
        const privateEvents: Event[] = await this.evetRepo.findUnviewedPrivateForUser(userId, 5 );

        const publicEvents: Event[] = await this.evetRepo.findUnviewedPublicForUser(userId,5);

        const events = privateEvents.concat(publicEvents);

        await this.evetRepo.markEventsAsViewed(events, userId);

        
        for (const event of events) {
            this.logger.log("Sending event:", event.id, "to user:", userId);
        }


        return events
    }
    
}
