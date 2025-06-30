// src/mappers/private-event.mapper.ts
import { PrivateEvent } from 'src/domainObjects/privateEvent';
import { PrivateEventEntity } from 'src/entities/private_event.entity';
import { UserMapper } from './user.mapper';
import { ChatMessageMapper } from './chat-message.mapper';
import { AddressMapper } from './address.mapper';

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
    if (domain.address) {
      e.address                     = AddressMapper.toEntity(domain.address);
    }
    e.users = domain.users.map(u => UserMapper.toEntity(u));
    e.chat  = domain.chat.map(m => ChatMessageMapper.toEntity(m));
    e.creator = UserMapper.toEntity(domain.getCreator());  // neu
    return e;
  }

  static toDomain(entity: PrivateEventEntity): PrivateEvent {
    const d = new PrivateEvent(
      AddressMapper.toDomain(entity.address),
      entity.picture,
      entity.name,
      entity.description,
      entity.date,
      'private',
      UserMapper.toDomain(entity.creator),
    );
    d.id            = entity.id;
    d.maxMembers    = entity.maxMembers;
    d.visibility    = entity.visibility;
    d.authorization = entity.authorization;
    entity.users.forEach(u => d.addUser(UserMapper.toDomain(u)));
    entity.chat.forEach(m => d.addChatMessage(ChatMessageMapper.toDomain(m)));
    return d;
  }
}
