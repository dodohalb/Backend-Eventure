// src/mappers/public-event.mapper.ts
import { PublicEvent } from 'src/domainObjects/publicEvent';
import { PublicEventEntity } from 'src/entities/public_event.entity';
import { AddressMapper } from './address.mapper';

export class PublicEventMapper {
  static toEntity(domain: PublicEvent): PublicEventEntity {
    const e = new PublicEventEntity();
    if (domain.id) e.id            = domain.id;
    e.name                          = domain.name;
    e.description                   = domain.description;
    e.date                          = domain.date;
    e.picture                       = domain.picture;
    if (domain.address) {
      e.address                     = AddressMapper.toEntity(domain.address);
    }
    return e;
  }

  static toDomain(entity: PublicEventEntity): PublicEvent {
    const d = new PublicEvent(
      AddressMapper.toDomain(entity.address),
      entity.picture,
      entity.name,
      entity.description,
      entity.date,
      'public',
    );
    d.id = entity.id;
    return d;
  }
}
