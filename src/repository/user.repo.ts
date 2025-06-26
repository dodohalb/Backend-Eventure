// src/repository/userMySQL.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/domainObjects/user';
import { UserEntity } from 'src/entities/user.entity';
import { UserMapper } from 'src/mappers/user.mapper';
import { DAO } from './dao';

@Injectable()
export class UserRepo implements DAO<User> {
  private readonly logger = new Logger(UserRepo.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async get(id: number): Promise<User> {
    const e = await this.repo.findOneBy({ id });
    if (!e) throw new Error(`User ${id} not found`);
    return UserMapper.toDomain(e);
  }

  async insert(u: User): Promise<User> {
    const e = UserMapper.toEntity(u);
    const saved = await this.repo.save(e);
    this.logger.log(`Inserted User ${saved.id}`);
    return UserMapper.toDomain(saved);
  }

  async update(u: User): Promise<User> {
    const e = UserMapper.toEntity(u);
    const saved = await this.repo.save(e);
    this.logger.log(`Updated User ${saved.id}`);
    return UserMapper.toDomain(saved);
  }

  async delete(id: number): Promise<User> {
    const e = await this.repo.findOneBy({ id });
    if (!e) throw new Error(`User ${id} not found`);
    await this.repo.remove(e);
    this.logger.log(`Deleted User ${id}`);
    return UserMapper.toDomain(e);
  }
}
