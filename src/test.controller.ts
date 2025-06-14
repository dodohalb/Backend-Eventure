import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('test')
export class TestController {
  // ─────────────────────── Auth ───────────────────────

  /** POST /test/login */
  @Post('login')
  login(@Body() dto: { phoneNumber: number; password: string }) {
    return {
      msg: 'logged in',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.stub-token',
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
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.stub-token',
    };
  }

  // ─────────────────────── User management ───────────────────────

  /** POST /test/users/decline */
  @Post('users/decline')
  declineUser(@Body() body: { eventId: number; userId: number }) {
    return { msg: `user ${body.userId} declined from event ${body.eventId}` };
  }

  /** POST /test/users/authorize */
  @Post('users/authorize')
  authorizeUser(@Body() body: { eventId: number; userId: number }) {
    return { msg: `user ${body.userId} authorized for event ${body.eventId}` };
  }

  /** POST /test/profile */
  @Post('profile')
  updateProfile(@Body() user: any) {
    return { msg: `profile updated for ${user.name}` };
  }

  /** POST /test/join-event */
  @Post('join-event')
  joinEvent(@Body() body: { eventId: number; userId: number }) {
    return { msg: `user ${body.userId} joined event ${body.eventId}` };
  }

  // ─────────────────────── Event update / creation ───────────────────────

  /** POST /test/update-events */
  @Post('update-events')
  @UseInterceptors(FileInterceptor('picture'))
  updateEvent(
    @UploadedFile() file: Express.Multer.File,
    @Body('event') eventString: string,
  ) {
    const e = JSON.parse(eventString);
    return { msg: `event ${e.name} updated`, event: { ...e, id: 99 } };
  }

  /** POST /test/create-event */
@Post('create-event')
@UseInterceptors(FileInterceptor('picture'))
createEvent(
  @UploadedFile() file: Express.Multer.File,
  @Body('event') eventString: string,
) {
  // parse the incoming JSON
  const e = JSON.parse(eventString);

  // build a “complete” event object
  const returnedEvent = {
    id: 123,                                  // stubbed new ID
    address: e.address,                       // Address { street, number, postalCode, city }
    picture: file ? `<${file.originalname} received>` : null,
    name: e.name,
    description: e.description,
    date: e.date,                             // still ISO‐string here
    type: e.type,                             // "private" or "public"
    // below only for PrivateEvent
    users: e.users ?? [],                     // array of User
    chat: e.chat ?? [],                       // array of ChatMessage
    maxMembers: e.maxMembers ?? 10,           // stub a default
    visibility: e.visibility ?? true,         // stub a default
    authorization: e.authorization ?? false,  // stub a default
  };

  return {
    msg: 'event created',
    event: returnedEvent,
  };
}
  

  /** POST /test/get-events */
  @Post('get-events')
  getEvents(
    @Body('filter') filter: { type: string; contacts: number[]; date: string; city: string },
    @Body('phoneNumber') phoneNumber: number,
  ) {
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