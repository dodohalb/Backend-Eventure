import { Event } from "./event";
import { ChatMessage } from "./chatMessage";
import { User } from "./user";
import { Address } from "./address";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class PrivateEvent extends Event {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => User)
    users: User[];
     
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChatMessage)
    chat: ChatMessage[];


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
    getChat(): ChatMessage[] {
        return this.chat;
    }
     addUser(user: User): void {
        this.users.push(user);
    }
    removeUser(user: User): void {
       // this.users = this.users.filter(u => u.getId() !== user.getId());
    }
    addChatMessage(chatMessage: ChatMessage): void {
        this.chat.push(chatMessage);
    }
    removeChatMessage(chatMessage: ChatMessage): void {
     //   this.chat = this.chat.filter(c => c.getId() !== chatMessage.getId());
    }
}