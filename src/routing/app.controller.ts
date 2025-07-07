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
  Param,
  ParseIntPipe,
  Res,
  StreamableFile,
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
import { Response } from 'express';

import { LoginDto }        from '../auth/loginDto';
import { Gateway } from './app.gateway';
import { timestamp } from 'rxjs';
import { PushService } from 'src/services/push.Service';
import { DeviceTokenDto} from 'src/auth/deviceTokenDto';
import { UserId } from 'src/config/decorator';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

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
  async register(@Body('user') user: User,@Body('password') password: string,): Promise< {token: string}> {
    const token = await this.authService.register(new LoginDto(user.phoneNumber, password), user);
    return { "token": token };
  }

  // ─────────────────────── User management ───────────────────────
  // All routes below are JWT-protected → JwtAuthGuard validates token
  // and injects req.user.


  
  /** Host declines a pending participant 
  @UseGuards(JwtAuthGuard)
  @Post('users/decline')
  async declineUser(@Body('eventId') eventId: number,@Body('userId')  userId:  number,): Promise<{ msg: string }> {
    return this.eventService.declineUser(eventId, userId);
  }*/

  /** Host authorises (confirms) a participant */
  @UseGuards(JwtAuthGuard)
  @Post('users/authorize')
  async authorizeUser(@Body('eventId') eventId: number, @Body('userId')  userId:  number,){
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
  async joinEvent(@UserId() userId: number, @Body('eventId') eventId: number): Promise<void> {
    this.eventService.joinEvent(eventId, userId);
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
  async createEvent(@UserId() userId: number, @UploadedFile() file: Express.Multer.File, @Body('event') eventString: string): Promise<Event > {
    this.logger.log(`Creating event with data: ${eventString}`);
    return this.eventService.createEvent(file, eventString, userId);
  }

  

  @UseGuards(JwtAuthGuard)
  @Post('unread-messages')
  async getUnreadMessages(@Body('lastSeen')timestamp: Date, @UserId() userId: number): Promise<ChatMessage[]>{
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


 @Get(':id/picture')
  async getPicture(
    @Param('id', ParseIntPipe) id: number): Promise<StreamableFile> {
    

    const { data, mime } = await this.eventService.getEventPicture(id);
   


    return new StreamableFile(data, {
      type: mime,                          // setzt Content-Type
    });
  }

   @Get('/user')
   @UseGuards(JwtAuthGuard)
  async getUser(@UserId() id: number): Promise<User> {
    this.logger.log(`getUser called for userId: ${id}`);
    return this.userService.getUserById(id);
  }

  @Get('default-picture')                          // ->  http://host:3000/default-picture
  async getDefaultPicture(@Res({ passthrough: true }) res: Response): Promise<StreamableFile> {

    // 1️⃣  Absoluten Pfad ermitteln – immer korrekt, egal von wo gestartet
    const filePath = join(__dirname, '..', '..', 'public', 'images', 'image.png');

    // 2️⃣  Existenz prüfen (sonst 404)
    if (!existsSync(filePath)) {
      this.logger.warn(`Default picture not found at ${filePath}`);
      res.status(404);
      return new StreamableFile(Buffer.alloc(0));
    }

    this.logger.log('Serving default picture');

    // 3️⃣  Content-Type setzen
    res.setHeader('Content-Type', 'image/png');

    // 4️⃣  Dateistream zurückgeben
    return new StreamableFile(createReadStream(filePath));
  }
  

    

    
    



// getInteressierte Events

// getZugesagte events

// get anfragen




/** Get event list by filter – expects JSON body even on GET */
  @UseGuards(JwtAuthGuard)
  @Post('getPrivateEvent')
  async getPrivateEvents(@UserId() userId: number, @Body('filter') filter: Filter): Promise<Event> {
    const eventArr=  await this.swipeService.getPrivateEvent(filter, userId );
    if (eventArr[0]) eventArr[0].picture=null;
    return eventArr[0];
  }

  @UseGuards(JwtAuthGuard)
  @Post('getPublicEvent')
  async getPublicEvents(@UserId() userId: number, @Body('filter') filter: Filter): Promise<Event> {
    const eventArr =  await this.swipeService.getPublicEvent(filter, userId );
    return eventArr[0];
  }

 

  






  @UseGuards(JwtAuthGuard)
  @Post('likeEvent')
  async likeEvent(@UserId() userId: number, @Body('eventId') eventId: number): Promise<void> {
    this.eventService.likeEvent(eventId, userId);
  }



@UseGuards(JwtAuthGuard)
@Post("deleteAnfrage")
async deleteAnfrage(@Body('eventId') eventId: number, @Body('userId') userId: number): Promise<void> {
  this.logger.log(`deleteAnfrage called for userId: ${userId}, eventId: ${eventId}`);
  await this.eventService.deleteAnfrage(eventId, userId);
}







  @UseGuards(JwtAuthGuard)
  @Get('all-joined-events')
  async getJoinedEvents(@UserId() userId: number) {
    this.logger.log(`Request for all joined events from user: ${userId}`);
    return this.eventService.getAllEventsFromUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all-liked-events')
  async getLikedEvents(@UserId() userId: number) {
    this.logger.log(`Request for all liked events from user: ${userId}`);
    return this.eventService.getAllLikedEvents(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all-anfragen')
  async getAllAnfragen(@UserId() userId: number) {
    this.logger.log(`Request for all anfragen from user: ${userId}`);
    return this.eventService.getAllAnfragen(userId);
  }


  @UseGuards(JwtAuthGuard)
  @Post('removelikedEvent')
  async removeLikedEvent(@UserId() userId: number, @Body('eventId') eventId: number) {
    this.logger.log(`removeLikedEvent called for userId: ${userId}, eventId: ${eventId}`);
    await this.eventService.removeLikedEvent(eventId, userId);
  }

}