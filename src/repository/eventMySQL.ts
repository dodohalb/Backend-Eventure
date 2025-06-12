import { Logger } from "@nestjs/common";
import { DAO } from "./dao";

export class EventMySQL implements DAO<any> {
    private logger = new Logger(EventMySQL.name);
    constructor() {
        
    }
    get(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    insert(obj: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    update(obj: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
}