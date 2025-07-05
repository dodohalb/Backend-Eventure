import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Column,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { EventEntity } from './event.entity';

@Entity({ name: 'Anfrager' })
export class Anfrager {
  // Composite-PK aus userId + eventId
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  eventId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => EventEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: EventEntity;

}