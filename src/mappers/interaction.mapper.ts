// src/mappers/interaction.mapper.ts
import { Interaction } from 'src/domainObjects/interaction';
import { InteractionEntity } from 'src/entities/interaction.entity';

export class InteractionMapper {
    static toEntity(domain: Interaction): InteractionEntity {
        const e = new InteractionEntity();
        if (domain.id) e.id = domain.id;        // ← beachten
        e.user = { id: domain.userId } as any;
        e.event = { id: domain.eventId } as any;
        e.status = domain.status;
        e.timestamp = domain.timestamp;
        return e;

    }

    static toDomain(ent: InteractionEntity): Interaction {
        const d = new Interaction(
            ent.user.id,
            ent.event.id,
            ent.status,
            ent.timestamp,
        );
        d.id = ent.id;       // ← ID zurückgeben
        return d;
    }
}
