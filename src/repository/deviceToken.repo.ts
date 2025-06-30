import { Injectable } from "@nestjs/common";
import { DAO } from "./dao";
import { DeviceTokenDto } from "src/auth/deviceTokenDto";
import { InjectRepository } from "@nestjs/typeorm";
import { DeviceTokenEntity } from "src/entities/deviceToken.entity";
import { FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";
import { DeviceTokenMapper } from "src/mappers/deviceToken.mapper";

@Injectable()
export class DeviceTokenRepo implements DAO<DeviceTokenDto> {
  constructor(
    @InjectRepository(DeviceTokenEntity)
    private readonly repo: Repository<DeviceTokenEntity>,
  ) {}

  async get(id: number): Promise<DeviceTokenDto> {
    const e = await this.repo.findOneBy({ id });
    if (!e) throw new Error("DeviceToken not found");
    return DeviceTokenMapper.toDto(e);
  }

  async getAll(): Promise<DeviceTokenDto[]> {
    const es = await this.repo.find();
    return es.map(DeviceTokenMapper.toDto);
  }

  async insert(d: DeviceTokenDto): Promise<DeviceTokenDto> {
    const e = DeviceTokenMapper.toEntity(d);
    const saved = await this.repo.save(e);
    return DeviceTokenMapper.toDto(saved);
  }

  async update(d: DeviceTokenDto): Promise<DeviceTokenDto> {
    if (d.id) await this.repo.update(d.id, d);
    const e = await this.repo.findOneBy({ id: d.id });
    if (!e) throw new Error("DeviceToken not found");
    return DeviceTokenMapper.toDto(e);
  }

  async delete(id: number): Promise<DeviceTokenDto> {
    const e = await this.repo.findOneBy({ id });
    if (!e) throw new Error("DeviceToken not found");
    await this.repo.delete(id);
    return DeviceTokenMapper.toDto(e);
  }

  async findOne(
    where: FindOptionsWhere<DeviceTokenEntity>,
    opts?: { order?: FindOptionsOrder<DeviceTokenEntity>; relations?: string[] }
  ): Promise<DeviceTokenDto | null> {
    const e = await this.repo.findOne({ where, ...opts });
    return e ? DeviceTokenMapper.toDto(e) : null;
  }

  async findMany(
    where: FindOptionsWhere<DeviceTokenEntity>,
    opts?: { order?: FindOptionsOrder<DeviceTokenEntity>; relations?: string[] }
  ): Promise<DeviceTokenDto[]> {
    const es = await this.repo.find({ where, ...opts });
    return es.map(DeviceTokenMapper.toDto);
  }
}