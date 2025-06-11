import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChatService {
    private logger = new Logger(ChatService.name);
}
