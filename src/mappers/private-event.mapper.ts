// src/mappers/private-event.mapper.ts
import { PrivateEvent } from 'src/domainObjects/privateEvent';
import { PrivateEventEntity } from 'src/entities/private_event.entity';
import { UserMapper } from './user.mapper';
import { ChatMessageMapper } from './chat-message.mapper';
import { AddressMapper } from './address.mapper';

export class PrivateEventMapper {
  static toEntity(domain: PrivateEvent): PrivateEventEntity {
    const e = new PrivateEventEntity();
    // ID weglassen – DB setzt sie selbst oder TypeORM verwendet sie beim Update, wenn vorhanden
    e.name          = domain.name;
    e.description   = domain.description;
    e.date          = domain.date;
    e.type          = domain.type;
    e.picture       = domain.picture;
    e.maxMembers    = domain.maxMembers;
    e.visibility    = domain.visibility;
    e.authorization = domain.authorization;
     if (domain.address) { //e.address darf nicht null sein, deswegen bleibt es `undefined`, wenn kein Wert vorhanden ist (eig nicht ganz sauber)
            e.address = AddressMapper.toEntity(domain.address);
        }
    e.users = domain.users.map(u => UserMapper.toEntity(u));
    e.chat  = domain.chat.map(m => ChatMessageMapper.toEntity(m));
    return e;
  }

  static toDomain(entity: PrivateEventEntity): PrivateEvent {
    // Domain-Konstruktor initialisiert users=[], chat=[]
    const dom = new PrivateEvent(
      // Parameterreihenfolge: address, picture, name, description, date, type
      AddressMapper.toDomain(entity.address),
      entity.picture,
      entity.name,
      entity.description,
      entity.date,
      entity.type,
    );

    dom.maxMembers    = entity.maxMembers;
    dom.visibility    = entity.visibility;
    dom.authorization = entity.authorization;

    // User- und Chat-Listen über die Domain-Methoden befüllen
    entity.users.forEach(u => dom.addUser(UserMapper.toDomain(u)));
    entity.chat.forEach(m => dom.addChatMessage(ChatMessageMapper.toDomain(m)));

    return dom;
  }
}
