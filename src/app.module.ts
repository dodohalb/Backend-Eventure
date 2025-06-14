import { Module } from '@nestjs/common';
import { Gateway } from './app.gateway';
import { JwtModule } from '@nestjs/jwt';  

import { AppController } from './app.controller';

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
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TestController } from './test.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static',
    }),
    MulterModule.register({
      limits: { fileSize: 10 * 1024 * 1024 }   // 10 MB
    }),
    PassportModule,
    JwtModule.register({
      secret: "secret-key",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    })
  ],
  controllers: [AppController, TestController],
  providers: [
    Gateway,
    AuthService, EventService, UserService, ChatService, SwipeService, 
    AuthMySQL, ChatMySQL, EventMySQL, UserMySQL,
    JwtStrategy
  ]
})
export class AppModule {}
