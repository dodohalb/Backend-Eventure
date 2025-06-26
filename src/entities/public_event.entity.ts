import { Entity } from 'typeorm';
import { EventEntity } from './event.entity';
import { ChildEntity } from 'typeorm';

@ChildEntity('public')
export class PublicEventEntity extends EventEntity {
  // Keine zusätzlichen Felder
}