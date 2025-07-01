import { Column, ManyToOne, PrimaryGeneratedColumn, Entity, TableInheritance, JoinColumn, OneToOne } from 'typeorm';
import { AddressEntity } from './address.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'event_entity' })
@TableInheritance({ column: { name: 'type', type: 'varchar', }, pattern: 'STI', })

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

  @OneToOne(() => AddressEntity, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'addressId' })
  address: AddressEntity;
    
  @Column() 
  creatorId: number;


}