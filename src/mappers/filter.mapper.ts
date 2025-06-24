// src/mappers/filter.mapper.ts
import { Filter } from 'src/domainObjects/filter';
import { FilterEntity } from 'src/entities/filter.entity';

export class FilterMapper {
  static toEntity(domain: Filter): FilterEntity {
    const e = new FilterEntity();
    // kein e.id = ..., da DomainObject kein id hat
    e.type = domain.type;
    e.contacts = domain.contacts;
    e.date = domain.date;
    e.city = domain.city;
    return e;
  }

  static toDomain(entity: FilterEntity): Filter {
    return new Filter(
      entity.type,
      entity.contacts,
      entity.date,
      entity.city
    );
    // id bleibt in der Domain verborgen
  }
}
