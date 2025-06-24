import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DAO } from './dao';
import { UserEntity } from '../entities/user.entity';
import { User } from '../domainObjects/user';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class AuthMySQL implements DAO<User> {
  private readonly logger = new Logger(AuthMySQL.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  /** Lese einen User (für Auth-Zwecke) */
  async get(id: number): Promise<User> {
    const e = await this.repo.findOneBy({ id });
    if (!e) throw new Error(`User ${id} not found`);
    return UserMapper.toDomain(e);
  }

  async insert(u: User): Promise<User> {
    const e = UserMapper.toEntity(u);
    const saved = await this.repo.save(e);
    this.logger.log(`Auth: Inserted User ${saved.id}`);
    return UserMapper.toDomain(saved);
  }

  async update(u: User): Promise<User> {
    const e = UserMapper.toEntity(u);
    const saved = await this.repo.save(e);
    this.logger.log(`Auth: Updated User ${saved.id}`);
    return UserMapper.toDomain(saved);
  }

  async delete(id: number): Promise<User> {
    const e = await this.repo.findOneBy({ id });
    if (!e) throw new Error(`User ${id} not found`);
    await this.repo.remove(e);
    this.logger.log(`Auth: Deleted User ${id}`);
    return UserMapper.toDomain(e);
  }
}
