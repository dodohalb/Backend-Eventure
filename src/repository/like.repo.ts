import { LikeDTO } from "src/entities/likeDto";
import { DAO } from "./dao";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class LikeRepo {
private readonly logger = new Logger(LikeRepo.name);

 constructor(
    @InjectRepository(LikeDTO) private readonly repo: Repository<LikeDTO>,
  ) { }


  async get(eventId: number): Promise<LikeDTO> {
    this.logger.log(`get called with eventId=${eventId}`);
    const like = await this.repo.findOne({
      where: { eventId },
      relations: ['user', 'event'],
    });
    if (!like) {
      throw new NotFoundException(`Like for eventId=${eventId} not found`);
    }
    return like;
  }
  getAll(userId: number): Promise<LikeDTO[]> {
        this.logger.log(`getAll called with userId: ${userId}`);
        return this.repo.find({ where: { userId } });
  }
  insert(obj: LikeDTO): Promise<LikeDTO> {
      this.logger.log(`insert called with: ${JSON.stringify(obj)}`);
      return this.repo.save(obj);
  }
  update(obj: LikeDTO): Promise<LikeDTO> {
      this.logger.log(`update called with: ${JSON.stringify(obj)}`);
      return this.repo.save(obj);
  }
  async delete(obj: LikeDTO): Promise<LikeDTO> {
    const { userId, eventId } = obj;
    this.logger.log(`delete called with userId=${userId}, eventId=${eventId}`);

    // 1) bestehenden Like laden
    const existing = await this.repo.findOne({
      where: { userId, eventId },
    });
    if (!existing) {
      throw new Error(`Like for userId=${userId} and eventId=${eventId} not found`);
    }

    // 2) löschen
    await this.repo.remove(existing);
    this.logger.log(`Deleted Like userId=${userId}, eventId=${eventId}`);

    // 3) gelöschtes Entity zurückgeben
    return existing;
  }
  findOne(where: LikeDTO, opts?: { order?: any; relations?: string[]; } | undefined): Promise<any> {
      throw new Error("Method not implemented.");
  }
  findMany(where: LikeDTO, opts?: { order?: any; relations?: string[]; } | undefined): Promise<LikeDTO[]> {
      throw new Error("Method not implemented.");
  }



}