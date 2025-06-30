import {
  Logger,
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';

import { EventService }   from '../services/event.service';
import { UserService }    from '../services/user.service';
import { MessageService }    from '../services/message.service';
import { SwipeService }   from '../services/swipe.service';
import { AuthService }    from '../services/auth.service';

import { JwtAuthGuard }   from '../auth/jwt-auth.guard';
import { ChatMessage }    from '../domainObjects/chatMessage';

import { Event }          from '../domainObjects/event';
import { User }           from '../domainObjects/user';
import { Filter }         from '../domainObjects/filter';

import { FileInterceptor } from '@nestjs/platform-express';
import type { Express }    from 'express';

import { LoginDto }        from '../auth/loginDto';
import { Gateway } from './app.gateway';
import { timestamp } from 'rxjs';
import { PushService } from 'src/services/push.Service';
import { DeviceTokenDto} from 'src/auth/deviceTokenDto';

@Controller()
export class AppController {

  private logger = new Logger(AppController.name);   // tag for Nest’s logger


  constructor(
    /* Inject all business-layer services */
    private readonly eventService: EventService,
    private readonly userService:  UserService,
    private readonly messageService:  MessageService,
    private readonly swipeService: SwipeService,
    private readonly authService:  AuthService,
    private readonly pushService: PushService,  // inject PushService for notifications

    private readonly gateway: Gateway,  // inject WebSocket gateway
  ) {}


  // ─────────────────────── Auth ───────────────────────

  /** Login with phone + password → returns JWT token */
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ msg: string; token: string; user: User }> {
    return this.authService.login(loginDto);
  }

  /** Register new user (credentials + profile) → returns JWT on success */
  @Post('register')
  async register(@Body('user') user: User,@Body('password') password: string,): Promise<{ msg: string; token: string; userID: number }> {
    return this.authService.register(new LoginDto(user.phoneNumber, password), user);
  }

  // ─────────────────────── User management ───────────────────────
  // All routes below are JWT-protected → JwtAuthGuard validates token
  // and injects req.user.

  /** Host declines a pending participant */
  @UseGuards(JwtAuthGuard)
  @Post('users/decline')
  async declineUser(@Body('eventId') eventId: number,@Body('userId')  userId:  number,): Promise<{ msg: string }> {
    return this.eventService.declineUser(eventId, userId);
  }

  /** Host authorises (confirms) a participant */
  @UseGuards(JwtAuthGuard)
  @Post('users/authorize')
  async authorizeUser(@Body('eventId') eventId: number, @Body('userId')  userId:  number,): Promise<{ msg: string }> {
    return this.eventService.authorizeUser(eventId, userId);
  }

  /** Logged-in user updates own profile */
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async updateProfile(@Body() user: User): Promise<{ msg: string }> {
    return this.userService.updateProfile(user);
  }

  /** User swipes / joins an event */
  @UseGuards(JwtAuthGuard)
  @Post('join-event')
  async joinEvent(@Body('eventId') eventId: number, @Body('userId')  userId:  number,): Promise<{ msg: string }> {
    return this.swipeService.joinEvent(eventId, userId);
  }

  // ─────────────────────── Event update / creation ───────────────────────

  /** Host updates an existing event */
  @UseGuards(JwtAuthGuard)
  @Post('update-events')
  @UseInterceptors(FileInterceptor('picture')) 
  async updateEvent(@UploadedFile() file: Express.Multer.File, @Body('event') eventString: string): Promise<{ msg: string }> {
    return this.eventService.updateEvent(file, eventString);
  }

  /** Host creates a new event – accepts multipart (picture + JSON string) */
  @UseGuards(JwtAuthGuard)
  @Post('create-event')
  @UseInterceptors(FileInterceptor('picture'))   // Multer: extract file-part
  async createEvent(@UploadedFile() file: Express.Multer.File, @Body('event') eventString: string): Promise<{ msg: string; event: Event }> {
    this.logger.log(`Creating event with data: ${eventString}`);
    return this.eventService.createEvent(file, eventString);
  }

  /** Get event list by filter – expects JSON body even on GET */
  @UseGuards(JwtAuthGuard)
  @Post('get-events')
  async getEvents(@Body('filter') filter: Filter, @Body('phoneNumber') phoneNumber: number): Promise<Event[]> {
    return this.swipeService.getEvents(filter, phoneNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unread-messages')
  async getUnreadMessages(@Body('lastSeen')timestamp: Date, @Body('userId') userId: number): Promise<ChatMessage[]>{
    return this.messageService.getUnreadMessages(timestamp, userId);
  }

  

  @UseGuards(JwtAuthGuard)
  @Post('broadcast')
  broadcast(@Body('text') text: string) {
    this.gateway.server.emit('system', { text });   // ◀︎ global push
    return { msg: 'broadcast sent' };
  }


  @UseGuards(JwtAuthGuard)
  @Post('get-new-members')
  async getNewEventMembers(@Body('eventId') eventId: number): Promise<User[]> {
    this.logger.log(`getNewEventMembers called for eventId: ${eventId}`);
    return this.eventService.getNewEventMembers(eventId);
  }
  @Post('push-token')
  @UseGuards(JwtAuthGuard)
  async saveToken(@Body() deviceTokenDto: DeviceTokenDto): Promise<void> {
  this.logger.log(`Saving push token for user ${deviceTokenDto}`);
  await this.pushService.upsertToken(deviceTokenDto);          
}



}