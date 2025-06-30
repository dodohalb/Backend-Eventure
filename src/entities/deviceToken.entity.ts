import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('device_token')
@Unique(['token'])
export class DeviceTokenEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() userId: number;               
  @Column() token: string;               
  @Column() platform: 'ios' | 'android';  
}