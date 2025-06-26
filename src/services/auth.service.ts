import { Injectable, Logger, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DAO } from 'src/repository/dao';
import * as bcrypt from 'bcrypt';
import { User } from 'src/domainObjects/user';
import { LoginDto } from 'src/auth/loginDto';
import { LoginEntity } from '../entities/login.entity';
import { AuthMySQL } from 'src/repository/auth.repo';
import { UserMySQL } from 'src/repository/user.repo';
import { Socket } from 'socket.io';

@Injectable()
export class AuthService {
  /* NestJS logger – prints to console with context "AuthService" */
  private logger = new Logger(AuthService.name);

  /* Credential-table DAO (phoneNumber + pwHash) */
  //private daoAuth: DAO<LoginDto>= new AuthMySQL();

  /* Profile-table DAO (name, adress, …) */
  //private daoUser: DAO<User> = new UserMySQL();



  /* JwtService is injected via Nest’s DI container */
  constructor(
    private readonly jwt: JwtService,
    //@Inject(AuthMySQL) private readonly daoAuth: DAO<LoginDto>,
    //@Inject(UserMySQL) private readonly daoUser: DAO<User>,
    @Inject(AuthMySQL) private readonly authRepo: AuthMySQL,
    @Inject(UserMySQL) private readonly userRepo: UserMySQL,
  ) { }



  /* -----------------------------  REGISTER  ----------------------------- */
  async register(dto: LoginDto, user: User): Promise<{ msg: string, token: string }> {
    this.logger.log("Registering user:", user.name);

    /* 1) hash plaintext password with salt rounds = 12 */
    const hash = await bcrypt.hash(dto.password, 12);

    /* 2) abort if phone number already taken */
    //const dbUser = await this.daoAuth.get(dto.phoneNumber);
    const dbUser = await this.authRepo.getHashByPhone(dto.phoneNumber);
    if (dbUser)
      throw new UnauthorizedException('User already exists with this phone number');

    /* 3) store credentials (phone + hash) */
    //const newUser = await this.daoAuth.insert(new LoginDto(dto.phoneNumber, hash));
    const newUser = await this.userRepo.insert(user);
    if (!newUser)
      throw new UnauthorizedException('User registration failed');

    /* 4) store user profile */
    //const newUserDetails = await this.daoUser.insert(user);
    const newUserDetails = await this.authRepo.createLogin(dto.phoneNumber, hash);
    //if (!newUserDetails)     -->CreateLogin() hat keinen Rückgabewert, deswegen kann die If-Anweisung nicht ausgeführt werden
    //  throw new UnauthorizedException('User details registration failed');

    /* 5) issue JWT */
    const token = this.sign(dto.phoneNumber);
    return { msg: "User registered successfully", token };
  }



  /* -------------------------------  LOGIN  ------------------------------- */
  async login(dto: LoginDto): Promise<{ msg: string, token: string }> {
    this.logger.log("Login attempt for phone number:", dto.phoneNumber);

    /* 1) fetch stored hash for this phone number */
    //const user = await this.daoAuth.get(dto.phoneNumber);
    const storedHash = await this.authRepo.getHashByPhone(dto.phoneNumber);
    if (!storedHash) {
      this.logger.warn(
        'Login failed—no credentials for',
        dto.phoneNumber,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    /* 2) compare plaintext password with stored hash */
    const valid = await bcrypt.compare(dto.password, storedHash);
    //if (!user || !(await bcrypt.compare(dto.password, user.password))) {
    if (!valid) {
      this.logger.warn("Login attempt failed: User not found for phone number:", dto.phoneNumber);
      throw new UnauthorizedException('invalid credentials');
    }

    /* 3) sign and return JWT */
    const token = this.sign(dto.phoneNumber);
    return { msg: 'logged in', token };
  }



  /* helper – create compact JWT payload { sub: phoneNumber } */
  private sign(phoneNumber: string) {
    return this.jwt.sign({ sub: phoneNumber });
  }

  async authenticate(client: Socket): Promise<number | null> {
    const token = client.handshake.auth?.token as string | undefined;  // JWT token from client
    if (!token) {
      this.logger.warn('Client connected without token:', client.id);
      return null;
    }
    try {
      const payload = this.jwt.verify<{ sub: number }>(token.replace(/^Bearer\s/, ''));  // verify JWT
      return payload.sub;
    } catch (error) {
      this.logger.warn('✖ bad token, disconnecting:', client.id);
      return null;
    }
  }
}