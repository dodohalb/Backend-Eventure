import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DAO } from './dao';
import { Anfrager } from 'src/entities/anfrager';


@Injectable()
export class AnfragerRepo  {
  private readonly logger = new Logger(AnfragerRepo.name);

  constructor(
    @InjectRepository(Anfrager)
    private readonly repo: Repository<Anfrager>,
  ) {}

  /**
   * Liefert eine einzelne Anfrage anhand der eventId.
   */
  async get(eventId: number): Promise<Anfrager> {
    this.logger.log(`get called with eventId=${eventId}`);
    const a = await this.repo.findOne({
      where: { eventId },
      relations: ['user', 'event'],
    });
    if (!a) {
      throw new NotFoundException(`Anfrager for eventId=${eventId} not found`);
    }
    return a;
  }

  /**
   * Liefert alle Anfrager eines bestimmten Events.
   */
  async getAll(eventId: number): Promise<Anfrager[]> {
    this.logger.log(`getAll called with eventId=${eventId}`);
    return this.repo.find({
      where: { eventId },
      relations: ['event'],
    });
  }

  /**
   * Fügt eine neue Anfrage hinzu.
   */
  async insert(obj: Anfrager): Promise<Anfrager> {
    this.logger.log(`insert called with: userId=${obj.userId}, eventId=${obj.eventId}`);
    return this.repo.save(obj);
  }

  /**
   * Aktualisiert eine bestehende Anfrage.
   */
  async update(obj: Anfrager): Promise<Anfrager> {
    this.logger.log(`update called with: userId=${obj.userId}, eventId=${obj.eventId}`);
    return this.repo.save(obj);
  }

  /**
   * Löscht eine Anfrage anhand von userId + eventId.
   */
  async delete(obj: Anfrager): Promise<Anfrager> {
    const { userId, eventId } = obj;
    this.logger.log(`delete called with userId=${userId}, eventId=${eventId}`);

    const existing = await this.repo.findOne({
      where: { userId, eventId },
    });
    if (!existing) {
      throw new NotFoundException(
        `Anfrager for userId=${userId} and eventId=${eventId} not found`,
      );
    }

    await this.repo.remove(existing);
    this.logger.log(`Deleted Anfrager userId=${userId}, eventId=${eventId}`);
    return existing;
  }

  // bleiben unimplementiert:
  findOne(where: any, opts?: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findMany(where: any, opts?: any): Promise<Anfrager[]> {
    throw new Error('Method not implemented.');
  }
}