import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { PrivateEventEntity } from './private_event.entity';

@Entity()
export class ChatMessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { eager: true })
  user: UserEntity;

  @Column()
  eventId: number;

  @Column()
  content: string;

  @CreateDateColumn()
  timestamp: Date;
}