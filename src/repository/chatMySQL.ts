import { Logger } from "@nestjs/common";
import { DAO } from "./dao";

export class ChatMySQL implements DAO<any> {
    constructor(parameters) {
        
    }
    private logger = new Logger(ChatMySQL.name);
    // 
    get(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    insert(obj: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    update(obj: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
}