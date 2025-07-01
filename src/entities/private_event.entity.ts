import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable, ChildEntity
} from 'typeorm';
import { EventEntity } from './event.entity';
import { UserEntity } from './user.entity';
import { ChatMessageEntity } from './chat_message.entity';

@ChildEntity('private') 
export class PrivateEventEntity extends EventEntity {
  
  
  @ManyToMany(() => UserEntity, {
    cascade: false,    // Du entscheidest, ob User mitgespeichert werden
    eager: true,       // lädt die User automatisch mit
  })
  @JoinTable({
    name: 'private_event_users',            // Name der Join-Tabelle
    joinColumn: {
      name: 'eventId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: UserEntity[];
  
  


  @Column() maxMembers: number;
  @Column() visibility: boolean;
  @Column() authorization: boolean;
}