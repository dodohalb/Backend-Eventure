import { Logger, Controller, Get, Post, Body,Patch,Session,UseGuards,SetMetadata, } from '@nestjs/common';
import { EventService } from './services/event.service';
import { UserService } from './services/user.service';
import { ChatService } from './services/chat.service';
import { SwipeService } from './services/swipe.service';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Event} from "./domainObjects/event";
import { PrivateEvent } from "./domainObjects/privateEvent";


@Controller()
export class Gateway {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly swipeService: SwipeService,
    private readonly authService: AuthService,
  ) {}

  private logger = new Logger(Gateway.name);

  @Post('login')
  async login(@Body() body: any, @Session() session: any): Promise<string> {
    /* TODO: implement */
    return undefined as any;
  }

  @Post('register')
  async register(@Body() body: any, @Session() session: any): Promise<string> {
    /* TODO: implement */
    return undefined as any;
  }
   //@UseGuards(JwtAuthGuard)
   @Post('message')
  async sendMessage(@Body() body: any, @Session() session: any): Promise<void> {
    /* TODO */
  }


 // @UseGuards(JwtAuthGuard)
  @Post('users/decline')
  async declineUser(@Body() body: any, @Session() session: any): Promise<void> {
    /* TODO */
  }

  //@UseGuards(JwtAuthGuard)
  @Post('users/authorize')
  async authorizeUser(@Body() body: any, @Session() session: any): Promise<void> {
    /* TODO */
  }


 // @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Body() body: any, @Session() session: any): Promise<void> {
    /* TODO */
  }


  //@UseGuards(JwtAuthGuard)
  @Post('events/join')
  async joinEvent(@Body() body: any, @Session() session: any): Promise<void> {
    /* TODO */
  }


 // @UseGuards(JwtAuthGuard)
  @Patch('events')
  async updateEvent(@Body() body: any, @Session() session: any): Promise<void> {
    /* TODO */
  }


 // @UseGuards(JwtAuthGuard)
  @Post('events/private')
  async createPrivateEvent(@Body() event: PrivateEvent): Promise<Event> {
    //console.log(event.getDescription)
    //this.logger.log("createPublicEvent called", event.name);
    //return event
    return this.eventService.createPrivateEvent(event);
  }

 // @UseGuards(JwtAuthGuard)
  @Post('events/public')
  async createPublicEvent(@Body() event: PrivateEvent): Promise<Event> {
    this.logger.log("createPublicEvent called", event.name);
    console.log("test");
   console.log("Ich hoffe hier kommt die Beschreibung:" ,event.getDescription);
    return event
    //return this.eventService.createEvent(event, session.user.id);
  }



  //@UseGuards(JwtAuthGuard)
  @Get('events')
  async getEvents(@Body() body: any, @Session() session: any): Promise<any[]> {
    /* TODO */
    return undefined as any;
  }


  @Get('ping')
  ping() {
    return { status: 'ok' };
  }

  
}