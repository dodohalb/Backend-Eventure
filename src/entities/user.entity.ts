import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AddressEntity } from './address.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  biographie: string;

  @Column()
  age: number;

  @Column({ type: 'varchar', unique: true })    // ← hier UNIQUE hinzu
  phoneNumber: string;

  @ManyToOne(() => AddressEntity, { cascade: true, eager: true })
  @JoinColumn()
  address: AddressEntity;
}