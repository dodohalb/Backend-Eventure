// mappers/user.mapper.ts
import { User } from 'src/domainObjects/user';
import { UserEntity } from 'src/entities/user.entity';
import { AddressMapper } from './address.mapper';

export class UserMapper {
  static toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.name = user.name;
    entity.age = user.age;
    entity.biographie = user.biographie;
    entity.phoneNumber = user.phoneNumber;
    entity.address = AddressMapper.toEntity(user.address);
    return entity;
  }

  static toDomain(entity: UserEntity): User {
    return {
      name: entity.name,
      age: entity.age,
      biographie: entity.biographie,
      phoneNumber: entity.phoneNumber,
      address: AddressMapper.toDomain(entity.address),
    };
  }
}
