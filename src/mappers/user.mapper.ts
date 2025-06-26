// mappers/user.mapper.ts
import { User } from 'src/domainObjects/user';
import { UserEntity } from 'src/entities/user.entity';
import { AddressMapper } from './address.mapper';

export class UserMapper {
  static toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    if (user.id) entity.id = user.id;
    entity.name = user.name;
    entity.age = user.age;
    entity.biographie = user.biographie;
    entity.phoneNumber = user.phoneNumber;
    entity.address = AddressMapper.toEntity(user.address);
    return entity;
  }

  static toDomain(entity: UserEntity): User {
    const d = new User(
      entity.name,
      entity.biographie,
      entity.age,
      entity.phoneNumber,
      AddressMapper.toDomain(entity.address),
    );
    d.id = entity.id;
    return d;
  };
};