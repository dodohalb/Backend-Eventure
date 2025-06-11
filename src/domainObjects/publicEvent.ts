import { Event } from "./event";

export class PublicEvent extends Event {
    constructor(parameters) {
       super(
            parameters.adress,
            parameters.picture,
            parameters.name,
            parameters.description,
            parameters.date,
            parameters.typ
        );  
    }
}