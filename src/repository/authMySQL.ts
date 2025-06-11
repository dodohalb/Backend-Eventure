import { Injectable, Logger } from '@nestjs/common';
import { DAO } from './dao';

@Injectable()
export class AuthMySQL implements DAO<any> {
    private logger = new Logger(AuthMySQL.name);

    get(id: number): Promise<any> {
        throw new Error('Method not implemented.');
    }
    insert(obj: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
    update(obj: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
    
}