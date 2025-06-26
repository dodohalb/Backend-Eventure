// src/mappers/filter.mapper.ts
import { Filter } from 'src/domainObjects/filter';
import { FilterEntity } from 'src/entities/filter.entity';

export class FilterMapper {
  static toEntity(domain: Filter): FilterEntity {
    const e = new FilterEntity();
    // domain.id? → wenn Du willst, kannst Du hier ein e.id = domain.id; ergänzen
    e.type     = domain.type;
    e.contacts = domain.contacts;
    e.date     = domain.date;
    e.city     = domain.city;
    return e;
  }

  static toDomain(entity: FilterEntity): Filter {
    const d = new Filter(
      entity.type,
      entity.contacts,
      entity.date,
      entity.city,
    );
    ;(d as any).id = entity.id;
    return d;
  }
}
