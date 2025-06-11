import { Module } from '@nestjs/common';
import { Gateway } from './app.gateway';
import { JwtModule } from '@nestjs/jwt';  

import { AuthService } from './services/auth.service';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';
import { ChatService } from './services/chat.service';
import { SwipeService } from './services/swipe.service';
import { AuthMySQL } from './repository/authMySQL';
import { ChatMySQL } from './repository/chatMySQL';
import { EventMySQL } from './repository/eventMySQL';
import { UserMySQL } from './repository/userMySQL';

@Module({
  imports: [],
  controllers: [Gateway],
  providers: [AuthService, EventService, UserService, ChatService, SwipeService, AuthMySQL, ChatMySQL, EventMySQL, UserMySQL],
})
export class AppModule {}
