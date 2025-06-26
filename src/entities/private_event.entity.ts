import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { EventEntity } from './event.entity';
import { UserEntity } from './user.entity';
import { ChatMessageEntity } from './chat_message.entity';

@Entity()
export class PrivateEventEntity extends EventEntity {
  @ManyToMany(() => UserEntity, { cascade: true, eager: true })
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => ChatMessageEntity, (chat) => chat.user, { cascade: true })
  chat: ChatMessageEntity[];

  @Column() maxMembers: number;
  @Column() visibility: boolean;
  @Column() authorization: boolean;
}