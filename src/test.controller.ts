import {
  Controller,
  Post,
  Get,
  Headers,
  Body,
  UploadedFile,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('test')
export class TestController {
  private readonly STUB_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.stub-token';

  private validateStubToken(authHeader: string) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed Authorization header');
    }
    const token = authHeader.slice(7);
    if (token !== this.STUB_TOKEN) {
      throw new UnauthorizedException('Invalid test token');
    }
  }

  /** POST /test/login */
  @Post('login')
  login(@Body() dto: { phoneNumber: number; password: string }) {
    return {
      msg: 'logged in',
      token: this.STUB_TOKEN,
    };
  }

  /** POST /test/register */
  @Post('register')
  register(
    @Body('user')
    user: {
      name: string;
      biographie: string;
      age: number;
      phoneNumber: number;
      address: { street: string; number: string; postalCode: number; city: string };
    },
    @Body('password') password: string,
  ) {
    return {
      msg: 'user registered',
      token: this.STUB_TOKEN,
    };
  }

  /** POST /test/users/decline */
  @Post('users/decline')
  declineUser(
    @Headers('authorization') authHeader: string,
    @Body() body: { eventId: number; userId: number },
  ) {
    this.validateStubToken(authHeader);
    return { msg: `user ${body.userId} declined from event ${body.eventId}` };
  }

  /** POST /test/users/authorize */
  @Post('users/authorize')
  authorizeUser(
    @Headers('authorization') authHeader: string,
    @Body() body: { eventId: number; userId: number },
  ) {
    this.validateStubToken(authHeader);
    return { msg: `user ${body.userId} authorized for event ${body.eventId}` };
  }

  /** POST /test/profile */
  @Post('profile')
  updateProfile(
    @Headers('authorization') authHeader: string,
    @Body() user: any,
  ) {
    this.validateStubToken(authHeader);
    return { msg: `profile updated for ${user.name}` };
  }

  /** POST /test/join-event */
  @Post('join-event')
  joinEvent(
    @Headers('authorization') authHeader: string,
    @Body() body: { eventId: number; userId: number },
  ) {
    this.validateStubToken(authHeader);
    return { msg: `user ${body.userId} joined event ${body.eventId}` };
  }

  /** POST /test/update-events */
  @Post('update-events')
  @UseInterceptors(FileInterceptor('picture'))
  updateEvent(
    @Headers('authorization') authHeader: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('event') eventString: string,
  ) {
    this.validateStubToken(authHeader);
    const e = JSON.parse(eventString);
    return {
      msg: `event ${e.name} updated`,
      event: {
        ...e,
        id: 99,
        picture: file ? `<${file.originalname} received>` : null,
      },
    };
  }

  /** POST /test/create-event */
  @Post('create-event')
  @UseInterceptors(FileInterceptor('picture'))
  createEvent(
    @Headers('authorization') authHeader: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('event') eventString: string,
  ) {
    this.validateStubToken(authHeader);
    const e = JSON.parse(eventString);
    return {
      msg: 'event created',
      event: {
        id: 123,
        address: e.address,
        picture: file ? `<${file.originalname} received>` : null,
        name: e.name,
        description: e.description,
        date: e.date,
        type: e.type,
        users: e.users ?? [],
        chat: e.chat ?? [],
        maxMembers: e.maxMembers ?? 10,
        visibility: e.visibility ?? true,
        authorization: e.authorization ?? false,
      },
    };
  }

  /** POST /test/get-events */
  @Post('get-events')
  getEvents(
    @Headers('authorization') authHeader: string,
    @Body('filter') filter: { type: string; contacts: number[]; date: string; city: string },
    @Body('phoneNumber') phoneNumber: number,
  ) {
    this.validateStubToken(authHeader);
    const imgUrl = 'http://localhost:3000/static/images/suistanable%20scru%20squad.png';
    return [
      {
        id: 1,
        address: { street: 'Parkweg 5', number: '5', postalCode: 10119, city: 'Berlin' },
        picture: imgUrl,
        name: 'Grillabend',
        description: 'Gemütliches Grillen im Park',
        date: new Date('2025-08-15T16:00:00.000Z'),
        type: 'private',
      },
      {
        id: 2,
        address: { street: 'Parkweg 5', number: '5', postalCode: 10119, city: 'Berlin' },
        picture: imgUrl,
        name: 'Picknick im Grünen',
        description: 'Open-Air Picknick für alle',
        date: new Date('2025-09-01T12:00:00.000Z'),
        type: 'public',
      },
    ];
  }
}