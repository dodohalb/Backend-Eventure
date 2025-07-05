
import { Gateway } from './routing/app.gateway';
import { JwtModule } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { forwardRef, Module } from '@nestjs/common'; 
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
import { InteractionEntity } from './entities/interaction.entity';


import { AuthService } from './services/auth.service';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';
import { MessageService } from './services/message.service';
import { SwipeService } from './services/swipe.service';

import { AuthRepo } from './repository/auth.repo';
import { ChatRepo } from './repository/chat.repo';
import { EventRepo } from './repository/event.repo';
import { UserRepo } from './repository/user.repo';

import { MulterModule } from '@nestjs/platform-express';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { DATABASE_URL, JWT_EXPIRES_IN } from './config/constants';
import { PresenceService } from './services/presenceService';
import { PushService } from './services/push.Service';
import { FirebaseProvider } from './routing/firebase.provider';
import { DeviceTokenRepo } from './repository/deviceToken.repo';
import { DeviceTokenEntity } from './entities/deviceToken.entity';
import { ViewedEvent } from './entities/viewedEvents.entity';
import { LikeDTO } from './entities/likeDto';
import { LikeRepo } from './repository/like.repo';
import { AnfragerRepo } from './repository/anfrager.repo';
import { Anfrager } from './entities/anfrager';


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
        InteractionEntity,
        ViewedEvent,
        DeviceTokenEntity,
        LikeDTO,
        Anfrager
      ],
      synchronize: true, //in Produktionsbetrieb auf false setzen
      autoLoadEntities: true,
    }),

  TypeOrmModule.forFeature([
    ViewedEvent,
    UserEntity,
    AddressEntity,
    ChatMessageEntity,
    PrivateEventEntity,
    PublicEventEntity,
    FilterEntity,
    LoginEntity,
    InteractionEntity,
    DeviceTokenEntity,
    LikeDTO,
    Anfrager
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
    FirebaseProvider,
    AuthService, EventService, UserService, MessageService, SwipeService, PresenceService, PushService,
    AuthRepo, ChatRepo, EventRepo, UserRepo, DeviceTokenRepo,
    JwtStrategy, LikeRepo, AnfragerRepo
  ]
})
export class AppModule { }
