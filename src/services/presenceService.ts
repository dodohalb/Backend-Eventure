import { Injectable } from "@nestjs/common";
import { Socket } from 'socket.io';

@Injectable()
export class PresenceService {
  private readonly socketsByUser = new Map<number, Set<Socket>>();

  add(client: Socket, userId: number) {
    client.join(userId.toString());  // optional: join room by userId
    const set = this.socketsByUser.get(userId) ?? new Set<Socket>();
    set.add(client);
    this.socketsByUser.set(userId, set);
  }

  remove(client: Socket, userId: number) {
    const set = this.socketsByUser.get(userId);
    if (!set) return;
    set.delete(client);
    if (set.size === 0) this.socketsByUser.delete(userId);
  }

  /** true, wenn mind. eine Verbindung offen */
  isOnline(userId: number): boolean {
    return this.socketsByUser.has(userId);
  }

  /** alle Sockets eines Users (read-only) */
  sockets(userId: number): readonly Socket[] {
    return [...(this.socketsByUser.get(userId) ?? [])];
  }
}