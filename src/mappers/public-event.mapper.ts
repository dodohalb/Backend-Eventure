// src/mappers/public-event.mapper.ts
import { PublicEvent } from 'src/domainObjects/publicEvent';
import { PublicEventEntity } from 'src/entities/public_event.entity';
import { AddressMapper } from './address.mapper';

export class PublicEventMapper {
    static toEntity(domain: PublicEvent): PublicEventEntity {
        const e = new PublicEventEntity();
      
        e.name = domain.name;
        e.description = domain.description;
        e.date = domain.date;
        e.type = domain.type;
        e.picture = domain.picture;
        if (domain.address) { //e.address darf nicht null sein, deswegen bleibt es `undefined`, wenn kein Wert vorhanden ist (eig nicht ganz sauber)
            e.address = AddressMapper.toEntity(domain.address);
        }
        return e;
    }

    static toDomain(entity: PublicEventEntity): PublicEvent {
        const dom = new PublicEvent(
            AddressMapper.toDomain(entity.address),
            entity.picture,
            entity.name,
            entity.description,
            entity.date,
            entity.type
        );
        (dom as any).id = entity.id;               // id nachtragen
        return dom;
    }
}
