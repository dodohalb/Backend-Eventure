import { Adress } from "./adress";
import { Event } from "./event";

export class PublicEvent extends Event {
    constructor(
                adress: Adress,
                picture: Buffer | null,
                name: string,
                description: string,
                date: Date,
                type: string,
            ) {
                super(adress, picture, name, description, date, type);
            }
}