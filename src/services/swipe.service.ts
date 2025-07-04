import { Injectable, Logger, Inject } from '@nestjs/common';
import { DAO } from 'src/repository/dao';
import { Filter } from 'src/domainObjects/filter';
import { Event } from 'src/domainObjects/event';
import { EventRepo } from 'src/repository/event.repo';
import { PrivateEvent } from 'src/domainObjects/privateEvent';
import { PublicEvent } from 'src/domainObjects/publicEvent';

@Injectable()
export class SwipeService {
    

    private readonly logger = new Logger(SwipeService.name);

    constructor(@Inject(EventRepo) private readonly evetRepo: EventRepo) {}

    

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

   async getPublicEvent(filter: Filter, userId: number): Promise<Event[]> {
      this.logger.log(userId, "getPublicEvents called ");
        const event = await this.evetRepo.findUnviewedPublicForUser(userId,1)
        if(event.length===0) return event;
        await this.evetRepo.markEventsAsViewed(event, userId);
        this.logger.log("Sending event:", event[0].id, "to user:", userId);
        return event;
    
    }
    async getPrivateEvent(filter: Filter, userId: number): Promise<Event[]> {
        this.logger.log(userId, "getPrivateEvents called ");
        const event = await this.evetRepo.findUnviewedPrivateForUser(userId,1)
        if(event.length===0) return event;
        await this.evetRepo.markEventsAsViewed(event, userId)
        this.logger.log("Sending event:", event[0].id, "to user:", userId);
        return event;
     
    }
    
}
