import { Injectable, Logger } from '@nestjs/common';
import { PrivateEvent } from 'src/domainObjects/privateEvent';
import { Event } from 'src/domainObjects/event';
import { DAO } from 'src/repository/dao';
import { EventMySQL } from 'src/repository/eventMySQL';

@Injectable()
export class EventService {
    private dao:DAO<Event> = new EventMySQL();

    private logger = new Logger(EventService.name);


    async createPrivateEvent(event: PrivateEvent): Promise<Event> {
        await this.dao.insert(event);
        const result = await this.dao.get(event.getId());
        if (!result) {
            throw new Error('Event not found after insertion');
        }
        return result;
    }
   
}
