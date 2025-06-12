import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DAO } from 'src/repository/dao';
import * as bcrypt from 'bcrypt';
import { User } from 'src/domainObjects/user';
import { LoginDto } from 'src/auth/loginDto';
import { AuthMySQL } from 'src/repository/authMySQL';
import { UserMySQL } from 'src/repository/userMySQL';

@Injectable()
export class AuthService {
  /* NestJS logger – prints to console with context "AuthService" */
  private logger = new Logger(AuthService.name);

  /* Credential-table DAO (phoneNumber + pwHash) */
  private daoAuth: DAO<LoginDto>= new AuthMySQL();

  /* Profile-table DAO (name, adress, …) */
  private daoUser: DAO<User> = new UserMySQL();



  /* JwtService is injected via Nest’s DI container */
  constructor(private readonly jwt: JwtService) {}



  /* -----------------------------  REGISTER  ----------------------------- */
  async register(dto: LoginDto, user: User): Promise<{msg: string, token: string}> {
    this.logger.log("Registering user:", user.name);

    /* 1) hash plaintext password with salt rounds = 12 */
    const hash = await bcrypt.hash(dto.password, 12);

    /* 2) abort if phone number already taken */
    const dbUser = await this.daoAuth.get(dto.phoneNumber);
    if(dbUser)
      throw new UnauthorizedException('User already exists with this phone number');

    /* 3) store credentials (phone + hash) */
    const newUser = await this.daoAuth.insert(new LoginDto(dto.phoneNumber, hash));
    if(!newUser)
      throw new UnauthorizedException('User registration failed');

    /* 4) store user profile */
    const newUserDetails = await this.daoUser.insert(user);
    if(!newUserDetails)
      throw new UnauthorizedException('User details registration failed');

    /* 5) issue JWT */
    const token = this.sign(user.phoneNumber);
    return { msg: "User registered successfully", token };
  }



  /* -------------------------------  LOGIN  ------------------------------- */
  async login(dto: LoginDto): Promise<{msg: string, token: string}> {
    this.logger.log("Login attempt for phone number:", dto.phoneNumber);

    /* 1) fetch stored hash for this phone number */
    const user = await this.daoAuth.get(dto.phoneNumber);

    /* 2) compare plaintext password with stored hash */
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      this.logger.warn("Login attempt failed: User not found for phone number:", dto.phoneNumber);
      throw new UnauthorizedException('invalid credentials');
    }

    /* 3) sign and return JWT */
    const token = this.sign(user.phoneNumber);
    return { msg: 'logged in', token };
  }



  /* helper – create compact JWT payload { sub: phoneNumber } */
  private sign(phoneNumber: number) {
    return this.jwt.sign({ sub: phoneNumber });
  }
}