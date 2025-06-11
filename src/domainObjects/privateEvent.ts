import { Event } from "./event";
import { ChatMassage } from "./chatMessage";
import { User } from "./user";
import { Adress } from "./adress";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class PrivateEvent extends Event {
    @ValidateNested()              // <– 1-Objekt-Tiefe
    @Type(() => User)
    users: User[];

    @ValidateNested()              // <– 1-Objekt-Tiefe
    @Type(() => ChatMassage)
    chat: ChatMassage[];


    constructor(
            adress: Adress,
            picture: Buffer | null,
            name: string,
            description: string,
            date: Date,
            type: string,
        ) {
            super(adress, picture, name, description, date, type);
        this.users = [];
        this.chat = [];
        }
     getUsers(): User[] {
        return this.users;
    }
    getChat(): ChatMassage[] {
        return this.chat;
    }
     addUser(user: User): void {
        this.users.push(user);
    }
    removeUser(user: User): void {
       // this.users = this.users.filter(u => u.getId() !== user.getId());
    }
    addChatMessage(chatMessage: ChatMassage): void {
        this.chat.push(chatMessage);
    }
    removeChatMessage(chatMessage: ChatMassage): void {
     //   this.chat = this.chat.filter(c => c.getId() !== chatMessage.getId());
    }
}