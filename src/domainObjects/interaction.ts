import { InteractionStatus } from "src/entities/interaction.entity";

export class Interaction {
  id?: number;         // ← optional
  userId: number;
  eventId: number;
  status: InteractionStatus;
  timestamp: Date;
  // …

  constructor( userId: number, eventId: number, status: InteractionStatus, timestamp: Date ) {
    this.userId    = userId;
    this.eventId   = eventId;
    this.status    = status;
    this.timestamp = timestamp;
  }
}
