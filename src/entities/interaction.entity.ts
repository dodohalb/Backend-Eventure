// src/entities/interaction.entity.ts
import {
    Entity, PrimaryColumn, Column,
    ManyToOne, CreateDateColumn, Unique, PrimaryGeneratedColumn
} from 'typeorm';
import { UserEntity } from './user.entity';
import { EventEntity } from './event.entity';

export enum InteractionStatus {
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE',
    JOIN = 'JOIN',           // nur für private Events
    CREATE_PRIVATE = 'CREATE_PRIVATE', // nur für public Events
}

@Entity()
@Unique(['user', 'event'])
export class InteractionEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, { eager: true })
    user: UserEntity;

    @ManyToOne(() => EventEntity)
    event: EventEntity;

    @Column({ type: 'enum', enum: InteractionStatus })
    status: InteractionStatus;

    @Column({ type: 'timestamp' })
    timestamp: Date;
}
