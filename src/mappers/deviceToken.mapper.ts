// src/mappers/device-token.mapper.ts

import { DeviceTokenDto } from "src/auth/deviceTokenDto";
import { DeviceTokenEntity } from "src/entities/deviceToken.entity";

export class DeviceTokenMapper {
  static toDto(e: DeviceTokenEntity): DeviceTokenDto {
    return {
      id:        e.id,
      userId:    e.userId,
      token:     e.token,
      platform:  e.platform as 'ios' | 'android',
    };
  }

  static toEntity(d: DeviceTokenDto): DeviceTokenEntity {
    const e = new DeviceTokenEntity();
    if (d.id)        e.id        = d.id;
    if (d.userId)    e.userId    = d.userId;
    e.token          = d.token;
    e.platform       = d.platform;
    return e;
  }
}