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



  // bleiben unimplementiert:
  findOne(where: any, opts?: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findMany(where: any, opts?: any): Promise<Anfrager[]> {
    throw new Error('Method not implemented.');
  }



   async getAllAnfragenByCreator(creatorId: number): Promise<Anfrager[]> {
    this.logger.log(`getAllAnfragenByCreator called for creatorId=${creatorId}`);
    return this.repo
      .createQueryBuilder('a')
      .innerJoin('a.event', 'e')
      .innerJoinAndSelect('a.user', 'u')
      .where('e.creatorId = :creatorId', { creatorId })
      .getMany();
  }

  

  async delete(obj: Anfrager): Promise<void> {
  const { userId, eventId } = obj;
  this.logger.log(`delete called with userId=${userId}, eventId=${eventId}`);

  const res = await this.repo.delete({ userId, eventId });
  this.logger.log(`→ actual rows deleted: ${res.affected}`);

  if (res.affected === 0) {
    throw new NotFoundException(
      `No Anfrager found for userId=${userId} & eventId=${eventId}`,
    );
  }
}
}