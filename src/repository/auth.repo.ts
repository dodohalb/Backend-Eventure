// src/repository/authMySQL.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginEntity } from '../entities/login.entity';

@Injectable()
export class AuthRepo {
  private readonly logger = new Logger(AuthRepo.name);

  constructor(
    @InjectRepository(LoginEntity)
    private readonly repo: Repository<LoginEntity>,
  ) { }

  /** Legt für einen neuen User Credentials an */
  async createLogin(phone: string, hash: string): Promise<void> {
    const login = this.repo.create({ phoneNumber: phone, passwordHash: hash });
    await this.repo.save(login);
    this.logger.log(`Login created for phone ${phone}`);
  }

  /** Liest den Hash zu einer Telefonnummer oder null */
  async getHashByPhone(phone: string): Promise<string | null> {
    const row = await this.repo.findOne({ where: { phoneNumber: phone } });
    return row?.passwordHash ?? null;
  }
}
