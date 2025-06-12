import { Logger } from "@nestjs/common";
import { DAO } from "./dao";
import { User } from "src/domainObjects/user";

export class UserMySQL implements DAO<User> {
    private logger = new Logger(UserMySQL.name);
    constructor() {
        
    }
    get(id: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
    insert(obj: any): Promise<User> {
        throw new Error("Method not implemented.");
    }
    update(obj: any): Promise<User> {
        throw new Error("Method not implemented.");
    }
    delete(id: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
}