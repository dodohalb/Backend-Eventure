// src/mappers/private-event.mapper.ts
import { PrivateEvent } from 'src/domainObjects/privateEvent';
import { PrivateEventEntity } from 'src/entities/private_event.entity';
import { UserMapper } from './user.mapper';

import { AddressMapper } from './address.mapper';
import { UserEntity } from 'src/entities/user.entity';

export class PrivateEventMapper {
  static toEntity(domain: PrivateEvent): PrivateEventEntity {
    const e = new PrivateEventEntity();
    if (domain.id)    e.id            = domain.id;
    e.name                          = domain.name;
    e.description                   = domain.description;
    e.date                          = domain.date;
    e.picture                       = domain.picture;
    e.maxMembers                    = domain.maxMembers;
    e.visibility                    = domain.visibility;
    e.authorization                 = domain.authorization;
   if (domain.creatorId) e.creatorId= domain.creatorId;
    
    e.address                     = AddressMapper.toEntity(domain.address);
    
    e.type                          = domain.type;
    e.users = domain.users.map(u => {
        const ue = new UserEntity(); 
        ue.id = u.id!;     // zwingend existierende ID
        return ue;
    });

    return e;
  }

  static toDomain(entity: PrivateEventEntity): PrivateEvent {
    const d = new PrivateEvent(
      AddressMapper.toDomain(entity.address),
      null,
      entity.name,
      entity.description,
      entity.date,
      entity.type,
    );

    d.creatorId   = entity.creatorId;
    d.id            = entity.id;
    d.maxMembers    = entity.maxMembers;
    d.visibility    = entity.visibility;
    d.authorization = entity.authorization;
    entity.users.forEach(u => d.addUser(UserMapper.toDomain(u)));
    return d;
  }
}
