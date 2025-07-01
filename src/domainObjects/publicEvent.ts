import { Address } from "./address";
import { Event } from "./event";
import { User } from "./user";

export class PublicEvent extends Event {
    
    constructor(
                adress: Address,
                picture: Buffer | null,
                name: string,
                description: string,
                date: Date,
                type: string,
              
            ) {
                super(adress, picture, name, description, date, type);
            }

            getUsers() :User[] {
                return [];
            }
}