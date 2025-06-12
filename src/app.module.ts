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
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    MulterModule.register({
      limits: { fileSize: 10 * 1024 * 1024 }   // 10 MB
    }),
    PassportModule,
    JwtModule.register({
      secret: "secret-key",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    })
  ],
  controllers: [Gateway],
  providers: [
    AuthService, EventService, UserService, ChatService, SwipeService, 
    AuthMySQL, ChatMySQL, EventMySQL, UserMySQL,
    JwtStrategy
  ]
})
export class AppModule {}
