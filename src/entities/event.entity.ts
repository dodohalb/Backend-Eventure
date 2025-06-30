import { Column, ManyToOne, PrimaryGeneratedColumn, Entity, TableInheritance, JoinColumn } from 'typeorm';
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

  // wir entfernen hier die eigene @Column()-Deklaration von `type`, weil TableInheritance schon die Discriminator-Spalte anlegt:
  // @Column()
  // type: string;

  @Column({ type: 'bytea', nullable: true }) // falls PostgreSQL
  picture: Buffer | null;

  @ManyToOne(() => AddressEntity, { cascade: true, eager: true, nullable: true })
  address: AddressEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'creator_id' })
  creator: UserEntity;

}