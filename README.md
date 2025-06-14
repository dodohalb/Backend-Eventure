<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->



# Eventure Backend (NestJS)

A robust REST & WebSocket API for event management and chat functionality, built with [NestJS](https://nestjs.com/) and Socket.io.

---


## Project Overview

**Eventure Backend** provides:

* User authentication with JWT
* CRUD operations for public and private events
* Participant management (requests, approval, rejection)
* Real-time event chat via WebSocket

---

## Technologies

* Node.js (v18+)
* NestJS
* TypeScript
* Socket.io
* class-validator / class-transformer
* Passport / @nestjs/jwt
* Multer (file uploads)

---

## Prerequisites

* Node.js & npm installed
* (Optional) PostgreSQL or another database for persistence

---


## Running the Application

```bash
npm run start:dev
```

The server will be available at `http://localhost:3000`.

---

## REST API Endpoints

**All protected routes require:** `Authorization: Bearer <JWT>` header

| Method | Route              | Description                        | Example Body                                                  |
| ------ | ------------------ | ---------------------------------- | ------------------------------------------------------------- |
| POST   | `/login`           | User login → returns JWT           | `{ "phoneNumber":491512345678, "password":"secret" }`         |
| POST   | `/register`        | Register new user                  | `{ "user":{...User}, "password":"secret" }`                   |
| POST   | `/users/decline`   | Host rejects participant           | `{ "eventId":42, "userId":7 }`                                |
| POST   | `/users/authorize` | Host approves participant          | `{ "eventId":42, "userId":7 }`                                |
| POST   | `/profile`         | Update own profile                 | `{ ...full User object... }`                                  |
| POST   | `/join-event`      | User joins an event                | `{ "eventId":42, "userId":7 }`                                |
| POST   | `/update-events`   | Update event (multipart)           | `multipart: picture=@file.jpg, event={...Event JSON...}`      |
| POST   | `/create-event`    | Create new event (multipart)       | `multipart: picture=@file.jpg, event={...Event JSON...}`      |
| POST   | `/get-events`      | Fetch events list                  | `{ "filter":{...Filter JSON...}, "phoneNumber":491512345678}` |
| POST   | `/broadcast`       | Send system message to all clients | `{ "text":"Server maintenance at midnight" }`                 |

**Example cURL for `/create-event` (private event):**

````bash
curl -X POST http://localhost:3000/create-event \
  -H "Authorization: Bearer $TOKEN" \
  -F "picture=@/path/to/image.jpg" \
  -F "event={\"address\":{\"street\":\"Hauptstr. 1\",\"number\":\"1\",\"postalCode\":10115,\"city\":\"Berlin\"},\"name\":\"Grillabend\",\"description\":\"Evening BBQ in the park\",\"date\":\"2025-08-15T16:00:00.000Z\",\"type\":\"private\",\"users\":[{\"name\":\"Alice\",\"biographie\":\"Loves grilling\",\"age\":29,\"phoneNumber\":491512345678,\"address\":{\"street\":\"Nebenstr. 2\",\"number\":\"2\",\"postalCode\":10117,\"city\":\"Berlin\"}}],\"maxMembers\":10,\"visibility\":true,\"authorization\":true}"```

---

## WebSocket Messaging

**Endpoint:** `ws://localhost:3000/ws`

**Client setup:**
```ts
import { io } from 'socket.io-client';
const socket = io('ws://localhost:3000/ws', {
  transports: ['websocket'],
  auth: { token: `Bearer ${JWT}` },
});
````

| Event         | Client → Server Payload                         | Server → Client Response                                          |
| ------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| `ping`        | `socket.emit('ping', {}, ack => {})`            | Acknowledgment: `'pong'`                                          |
| `chatMessage` | `{ chatMessage: {...ChatMessage}, eventId:42 }` | Server broadcasts: `to(eventId).emit('chatMessage', chatMessage)` |
| `system`      | *via HTTP `/broadcast`*                         | `socket.on('system', msg => {})`                                  |

---

## Project Structure

```
src/
├─ app.controller.ts      # REST controller
├─ app.gateway.ts         # WebSocket gateway
├─ domainObjects/         # Event, PrivateEvent, PublicEvent, User, ChatMessage, Filter, Address
├─ services/              # Business logic
├─ repository/            # DAO interfaces & examples
├─ auth/                  # JWT strategy, guard, DTOs
└─ main.ts                # Application bootstrap
```

---

## Testing

* Use `curl` for REST endpoints
* Use `socket.io-client` or `wscat` for WebSocket interactions

---

## License

MIT © Dominik
