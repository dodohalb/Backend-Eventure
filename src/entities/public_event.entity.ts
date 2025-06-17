import { Entity } from 'typeorm';
import { EventEntity } from './event.entity';

@Entity()
export class PublicEventEntity extends EventEntity {
  // Keine zusätzlichen Felder
}