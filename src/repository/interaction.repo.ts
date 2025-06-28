// src/repository/interaction.repo.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { DAO } from './dao';
import { InteractionEntity } from '../entities/interaction.entity';
import { Interaction } from '../domainObjects/interaction';
import { InteractionMapper } from '../mappers/interaction.mapper';

@Injectable()
export class InteractionRepo implements DAO<Interaction> {
  constructor(
    @InjectRepository(InteractionEntity)
    private readonly repo: Repository<InteractionEntity>,
  ) { }
  findOne(where: FindOptionsWhere<Interaction>, opts?: {order?: FindOptionsOrder<Interaction>; relations?: string[];}): Promise<Interaction | null> {
    throw new Error('Method not implemented.');
  }
  findMany(where: FindOptionsWhere<Interaction>,opts?: {order?: FindOptionsOrder<Interaction>; relations?: string[];}): Promise<Interaction[]> {
    throw new Error('Method not implemented.');
  }
  getAll(T: any): Promise<Interaction[]> {
    throw new Error('Method not implemented.');
  }

  /** 1) get: muss Promise<Interaction> liefern, also Exception statt null */
  async get(id: number): Promise<Interaction> {
    const entity = await this.repo.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException(`Interaction mit id=${id} nicht gefunden`);
    }
    return InteractionMapper.toDomain(entity);
  }

  /** 2) insert: unverändert */
  async insert(obj: Interaction): Promise<Interaction> {
    const entity = InteractionMapper.toEntity(obj);
    const saved = await this.repo.save(entity);
    return InteractionMapper.toDomain(saved);
  }

  /** 3) update: `save` überschreibt, liefert zurück */
  async update(obj: Interaction): Promise<Interaction> {
    if (obj.id == null) {
      throw new Error('Interaction.update: id muss gesetzt sein');
    }
    const entity = InteractionMapper.toEntity(obj);
    const updated = await this.repo.save(entity);
    return InteractionMapper.toDomain(updated);
  }

  /** 4) delete: löschen und das gelöschte Objekt zurückliefern */
  async delete(id: number): Promise<Interaction> {
    // erst lesen, damit wir es nachher zurückgeben können
    const toDelete = await this.repo.findOne({ where: { id } });
    if (!toDelete) {
      throw new NotFoundException(`Interaction mit id=${id} nicht gefunden`);
    }
    await this.repo.delete(id);  // hier ID als number übergeben
    return InteractionMapper.toDomain(toDelete);
  }

  // ——————————————————————————————
  // Zusätzliche helper-Queries
  // ——————————————————————————————

  /** Prüfen, ob user schon interagiert hat */
  async hasSeen(userId: number, eventId: number): Promise<boolean> {
    const count = await this.repo.count({
      where: {
        user: { id: userId },    // ← statt userId
        event: { id: eventId },    // ← statt eventId
      }
    });
    return count > 0;
  }
};
