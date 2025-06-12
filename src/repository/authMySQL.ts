import { Injectable, Logger } from '@nestjs/common';
import { DAO } from './dao';
import { LoginDto } from 'src/auth/loginDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthMySQL implements DAO<LoginDto> {
    private logger = new Logger(AuthMySQL.name);

    async get(id: number): Promise<LoginDto> {
        
        // Simulating a database call to get a user by phone number
        const password = await bcrypt.hash("secret", 12);
        const phoneNumber = 491512345678;
        const dto: LoginDto =new LoginDto(phoneNumber, password);
        return dto;
    }
    insert(obj: any): Promise<LoginDto> {
        throw new Error('Method not implemented.');
    }
    update(obj: any): Promise<LoginDto> {
        throw new Error('Method not implemented.');
    }
    delete(id: number): Promise<LoginDto> {
        throw new Error('Method not implemented.');
    }
    
}