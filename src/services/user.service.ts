import { Injectable, Logger, Inject } from '@nestjs/common';
import { User } from 'src/domainObjects/user';
import { DAO } from 'src/repository/dao';
import { UserRepo } from 'src/repository/user.repo';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    //private dao: DAO<User> = new UserMySQL(); 

    constructor(@Inject(UserRepo) private readonly dao: DAO<User>) {}

    async updateProfile(user: User): Promise<{msg: string}> {
        this.logger.log("updateProfile called for user:", user.name);
        const newProfile = await this.dao.update(user);
        if (!newProfile) {
            this.logger.error("Failed to update profile for user:", user.name);
        }
        return Promise.resolve({msg: "Profile updated successfully"});
    }
    
    /*  Methoden nach event.service verschoben
    
    async authorizeUser(eventId: number, userId: number): Promise<{msg: string}> {
        this.logger.log("authorizeUser called with eventId:", eventId, "and userId:", userId);
        throw new Error('Method not implemented.');
    }
    async declineUser(eventId: number, userId: number): Promise<{msg: string}> {
        this.logger.log("declineUser called with eventId:", eventId, "and userId:", userId);
        throw new Error('Method not implemented.');
    }*/
}
