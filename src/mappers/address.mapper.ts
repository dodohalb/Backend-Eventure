// src/mappers/address.mapper.ts
import { Address } from 'src/domainObjects/address';
import { AddressEntity } from 'src/entities/address.entity';

export class AddressMapper {
  static toEntity(domain: Address): AddressEntity {
    const e = new AddressEntity();
    if ((domain as any).id) e.id        = (domain as any).id;
    e.street                         = domain.street;
    e.number                         = domain.number;
    e.city                           = domain.city;
    e.postalCode                     = domain.postalCode;
    return e;
  }

  static toDomain(entity: AddressEntity): Address {
    const d = new Address(
      entity.street,
      entity.number,
      entity.postalCode,
      entity.city,
    );
    ;(d as any).id = entity.id;
    return d;
  }
}
