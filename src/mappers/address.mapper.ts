import { Address } from 'src/domainObjects/address';
import { AddressEntity } from 'src/entities/address.entity';

export class AddressMapper {
  static toEntity(addr: Address): AddressEntity {
    const entity = new AddressEntity();
    entity.street = addr.street;
    entity.number = addr.number;
    entity.city = addr.city;
    entity.postalCode = addr.postalCode;
    return entity;
  }

  static toDomain(entity: AddressEntity): Address {
    return {
      street: entity.street,
      number: entity.number,
      city: entity.city,
      postalCode: entity.postalCode,
    };
  }
}
