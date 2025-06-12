import { Event } from "./event";
import { ChatMassage } from "./chatMessage";
import { User } from "./user";
import { Address } from "./address";

export class PrivateEvent extends Event {
    users: User[];
    chat: ChatMassage[];


    constructor(
            adress: Address,
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