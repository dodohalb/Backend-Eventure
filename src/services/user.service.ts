import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/domainObjects/user';

@Injectable()
export class UserService {
    private logger = new Logger(UserService.name);

    updateProfile(user: User): Promise<{msg: string}> {
        this.logger.log("updateProfile called for user:", user.name);
        //throw new Error('Method not implemented.');
        return Promise.resolve({msg: "Profile updated successfully"});
    }
    authorizeUser(eventId: number, userId: number): Promise<{msg: string}> {
        this.logger.log("authorizeUser called with eventId:", eventId, "and userId:", userId);
        throw new Error('Method not implemented.');
    }
    declineUser(eventId: number, userId: number): Promise<{msg: string}> {
        this.logger.log("declineUser called with eventId:", eventId, "and userId:", userId);
        throw new Error('Method not implemented.');
    }


}
