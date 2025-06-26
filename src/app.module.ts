import { Module } from '@nestjs/common';
import { Gateway } from './routing/app.gateway';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './routing/app.controller';
import { TestController } from './routing/test.controller';

import { UserEntity } from './entities/user.entity';
import { AddressEntity } from './entities/address.entity';
import { ChatMessageEntity } from './entities/chat_message.entity';
import { EventEntity } from './entities/event.entity';
import { PrivateEventEntity } from './entities/private_event.entity';
import { PublicEventEntity } from './entities/public_event.entity';
import { FilterEntity } from './entities/filter.entity';
import { LoginEntity } from './entities/login.entity';

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

import { DATABASE_URL, JWT_EXPIRES_IN } from './config/constants';

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }), //lädt .env-Variablen, wird das benötigt?

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: DATABASE_URL,
      entities: [
        UserEntity,
        AddressEntity,
        ChatMessageEntity,
        EventEntity,
        PrivateEventEntity,
        PublicEventEntity,
        FilterEntity,
        LoginEntity,
      ],
      synchronize: true, //in Produktionsbetrieb auf false setzen
      autoLoadEntities: true,
    }),

  TypeOrmModule.forFeature([
    UserEntity,
    AddressEntity,
    ChatMessageEntity,
    PrivateEventEntity,
    PublicEventEntity,
    FilterEntity,
    LoginEntity,
  ]),

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
    signOptions: { expiresIn: JWT_EXPIRES_IN || '1d' },
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
export class AppModule { }
