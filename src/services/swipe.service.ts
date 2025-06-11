import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SwipeService {
    private logger = new Logger(SwipeService.name);
}
