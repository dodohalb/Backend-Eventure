import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AddressEntity } from './address.entity';

export abstract class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  type: string;

  @Column({ type: 'bytea', nullable: true }) // falls PostgreSQL
  picture: Buffer | null;

  @ManyToOne(() => AddressEntity, { cascade: true, eager: true, nullable: true })
  address: AddressEntity;
}